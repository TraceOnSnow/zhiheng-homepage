# Project Agent Instructions

## Git workflow

- When a requested change reaches a coherent, user-visible milestone, validate it and create a commit automatically.
- Before committing, run the relevant checks. For application changes, prefer `npm run lint`, `npm run typecheck`, `npm run format:check`, and `npm run build` when practical.
- Use the repository-local Git identity for commits. Never rewrite existing history unless the user explicitly asks.
- Commit only files related to the current task. Do not commit secrets, `.env` files, generated build output, or unrelated working-tree changes.
- Do not push from the agent session by default. The project session wrapper pushes pending commits when the session exits and the working tree is clean.
- Use Conventional Commit messages such as `feat:`, `fix:`, `refactor:`, or `chore:`.

## Scope and safety

- Do not automatically commit a partial implementation, failing validation, or a dirty unrelated worktree.
- If validation fails for an ordinary in-scope issue, fix it before committing.
- If the worktree contains unrelated user changes, leave them untouched and mention them instead of including them in a commit.
