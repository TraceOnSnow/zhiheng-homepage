# 服务器部署：Docker Compose + 宿主机 Nginx

常驻进程只有网站应用和宿主机已有的 Nginx。Next.js 同时提供公开页面、Payload Admin、REST 和 metadata API；SQLite 没有独立数据库服务。`migrate` 是一次性容器，默认不会随 `up` 启动。

## 目录和持久化

建议将仓库克隆到 `/opt/traceonsnow/app`，将数据放在仓库外：

```text
/opt/traceonsnow/
  app/                    # 仓库、compose.yaml
    deploy/.env.production # 服务器密钥，不入 Git、不进入镜像
  data/
    database/             # payload.db 及可能的 WAL / SHM 文件
    media/                # 上传原图和缩略图
  backups/
```

Compose 将宿主机 `data/database` 挂载到容器 `/app/storage/database`，将 `data/media` 挂载到 `/app/storage/media`。数据库 URL 和图片目录由 Compose 固定为这些容器路径。替换镜像、重建容器不删除宿主机数据。使用单个应用实例，不给本地 SQLite 配置多实例扩容。

镜像内使用 `node` 用户（UID/GID 1000）。先创建目录并赋予该用户权限；Compose 不会自动创建缺失的挂载目录，避免悄悄启动到错误位置。

```sh
sudo install -d -o 1000 -g 1000 -m 0750 /opt/traceonsnow/data/database /opt/traceonsnow/data/media
sudo install -d -m 0700 /opt/traceonsnow/backups
```

## 首次启动

服务器需安装 Docker Engine、Compose v2、Nginx；HTTPS 示例使用 Certbot。以下命令在仓库根目录执行。

```sh
cp deploy/.env.production.example deploy/.env.production
chmod 600 deploy/.env.production
openssl rand -hex 32
```

把生成的随机值填入 `PAYLOAD_SECRET`，填写 `SERVER_URL=https://traceonsnow.com` 和需要的 provider 凭据。不要把开发 `.env` 整份复制为生产配置。若修改 `APP_PORT`，同步修改 Nginx upstream；若修改数据位置，同步创建目录与权限。

每个终端会话先定义这个简写，后续命令都使用同一份生产环境文件：

```sh
dc() { docker compose --env-file deploy/.env.production "$@"; }
dc config --quiet
dc build app
dc run --rm migrate
dc up -d app
dc ps
```

`config --quiet` 只验证配置；不要复制普通 `docker compose config` 输出，它可能包含展开后的密钥。真实密钥只在运行时注入；构建使用一次性占位 secret 和临时数据库，`.dockerignore` 排除真实 env、数据库、日志及旧内容。

生产库应从空库执行已提交迁移。当前本地开发库通过 schema push 建立，不能直接复制后再次执行初始迁移；已有内容需单独导入或先核实 migration baseline。迁移失败就停止部署，不启动新版本。

首次开放公网前创建管理员。可以先保持 Nginx 尚未启用，通过 SSH 隧道访问应用：

```sh
# 在你自己的电脑上执行；替换 SSH 用户和服务器地址。
ssh -N -L 13000:127.0.0.1:3000 user@server
```

打开 `http://localhost:13000/admin` 创建管理员。完成后关闭隧道，再开放 Nginx。首次创建页面在空库时允许初始化，切勿将空库直接暴露公网；创建完成后匿名用户不能注册。服务器防火墙仅向公网开放必要的 SSH、80、443，不开放 3000。Compose 也只发布 `127.0.0.1:3000`。

## 宿主机 Nginx 和 HTTPS

先将域名 A/AAAA 记录指向服务器。示例仅配置 `traceonsnow.com`；若使用其他域名，替换两个 Nginx 示例里的域名、证书路径以及 `SERVER_URL`。

已经有有效证书时直接安装 `deploy/nginx.conf`。没有证书时先安装 HTTP 引导配置，它只开放 ACME 校验，不代理应用：

```sh
sudo mkdir -p /var/www/letsencrypt
sudo cp deploy/nginx-bootstrap.conf /etc/nginx/sites-available/traceonsnow
sudo ln -s /etc/nginx/sites-available/traceonsnow /etc/nginx/sites-enabled/traceonsnow
sudo nginx -t
sudo systemctl reload nginx
sudo certbot certonly --webroot -w /var/www/letsencrypt -d traceonsnow.com
```

若该站点的 symlink 已存在，跳过 `ln -s`；处理与该域名冲突的旧配置，保留服务器上的其他站点。取得证书、创建管理员后再切换 HTTPS 配置：

```sh
sudo cp deploy/nginx.conf /etc/nginx/sites-available/traceonsnow
sudo nginx -t
sudo systemctl reload nginx
sudo certbot renew --dry-run
```

确认服务器 Certbot 定时续期已启用，并配置成功续期后的 Nginx reload：

```sh
sudo install -d /etc/letsencrypt/renewal-hooks/deploy
printf '#!/bin/sh\nsystemctl reload nginx\n' | sudo tee /etc/letsencrypt/renewal-hooks/deploy/traceonsnow-reload >/dev/null
sudo chmod 755 /etc/letsencrypt/renewal-hooks/deploy/traceonsnow-reload
systemctl list-timers --all | grep certbot
```

若系统通过其他机制运行 Certbot 定时任务，核实对应配置。不要在仓库保存证书或私钥。Nginx 示例保留 HTTP ACME 路径，关闭代理缓冲以支持 Next.js 流式响应，允许 12 MB 请求体以容纳 Payload 的 10 MB 图片及表单开销。

访问 `https://traceonsnow.com/`、`/admin`；验证管理员登录、创建作品、上传封面、保存并从前台查看。然后执行 `dc up -d --force-recreate app`，确认记录和封面仍在。应用健康检查访问首页（包含真实 Payload 读取）；失败时查看 `dc logs --tail=100 app`，不要分享含敏感信息的日志。

## 更新

先拉取代码并构建新镜像，旧应用可以继续运行。默认镜像标签是 `local`；需要保留回滚版本时，在 `.env.production` 中将 `APP_IMAGE_TAG` 改为发布版本或提交短 SHA。

```sh
git pull --ff-only
dc build app
# 下方备份流程会停止应用。完成备份后，迁移期间仍需停止旧应用：
dc stop app
dc run --rm migrate
# 只在迁移成功后执行：
dc up -d --force-recreate app
dc ps
```

schema 更改应在本地生成并提交 migration，生产不启用 schema push。更新产生短暂停机；数据库迁移不能与旧应用同时写库。不要自动执行破坏性的 down migration。回滚涉及不兼容 schema 时，需要恢复更新前的数据库和图片备份，并使用对应旧镜像。

## 备份和恢复

个人网站先采用短暂停机备份，保证数据库和图片在同一静止状态。不直接复制正在写入的 `.db`；停止应用后连同 database 目录（包括 WAL / SHM）和 media 一起打包。迁移容器也必须已经结束。以下默认使用 `/opt/traceonsnow/data`，自定义目录时对应替换。

```sh
dc stop app
backup_file="/opt/traceonsnow/backups/site-$(date -u +%Y%m%dT%H%M%SZ).tar.gz"
sudo tar -czf "$backup_file" -C /opt/traceonsnow/data database media
sudo tar -tzf "$backup_file" >/dev/null
dc start app
```

确认归档命令和归档读取都成功；如果失败，先排查备份失败原因，再手动 `dc start app` 恢复服务。备份包含私密内容，只存入受限目录，并另存一份到服务器外。另行安全备份生产环境文件，避免丢失密钥；它不混入内容归档。可以后续将这套流程封装成定时任务。

恢复时停止应用，将现有数据目录移开保留，在空数据目录中解压归档，恢复 UID/GID 1000 的权限，使用与备份相匹配的镜像启动并验证；恢复完成前不要执行新版本迁移。不要把 SQLite WAL 从另一个时间点拼到备份上。

参考：[Next.js 自托管](https://nextjs.org/docs/app/guides/self-hosting)、[Payload 部署](https://payloadcms.com/docs/production/deployment)、[Docker bind mounts](https://docs.docker.com/engine/storage/bind-mounts/)、[Nginx 代理模块](https://nginx.org/en/docs/http/ngx_http_proxy_module.html)。
