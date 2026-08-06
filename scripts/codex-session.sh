#!/usr/bin/env bash

set -u

PROJECT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PUSH_BRANCH="${CODEX_PUSH_BRANCH:-main}"
REMOTE="${CODEX_PUSH_REMOTE:-origin}"
CODEX_COMMAND="${CODEX_COMMAND:-codex}"

push_pending_commits() {
  cd "$PROJECT_DIR" || return 0

  local branch upstream ahead
  branch="$(git branch --show-current 2>/dev/null || true)"

  if [[ "$branch" != "$PUSH_BRANCH" ]]; then
    printf '[codex-session] 当前分支为 %s，不是 %s，跳过 push。\n' "${branch:-detached HEAD}" "$PUSH_BRANCH"
    return 0
  fi

  if [[ -n "$(git status --porcelain 2>/dev/null)" ]]; then
    printf '[codex-session] 工作区仍有未提交修改，跳过 push。\n'
    return 0
  fi

  upstream="$(git rev-parse --abbrev-ref --symbolic-full-name '@{upstream}' 2>/dev/null || true)"
  if [[ -z "$upstream" ]]; then
    printf '[codex-session] 当前分支没有 upstream，跳过 push。\n'
    return 0
  fi

  ahead="$(git rev-list --count "$upstream..HEAD" 2>/dev/null || printf '0')"
  if [[ "$ahead" -eq 0 ]]; then
    printf '[codex-session] 没有待推送的提交。\n'
    return 0
  fi

  printf '[codex-session] 检测到 %s 个待推送提交，正在推送到 %s/%s...\n' "$ahead" "$REMOTE" "$branch"
  if git push "$REMOTE" "$branch"; then
    printf '[codex-session] push 完成。\n'
  else
    printf '[codex-session] push 失败；本地提交已保留，请稍后重试。\n' >&2
  fi
}

trap push_pending_commits EXIT

cd "$PROJECT_DIR" || exit 1
"$CODEX_COMMAND" "$@"
exit_code=$?
exit "$exit_code"
