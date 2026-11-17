---
name: fly-deploy
description: "Launch and deploy a project on Fly.io: fly.toml, fly launch, secrets and fly deploy. Use when the project deploys to Fly.io."
---

# Deploying to Fly.io

Run flyctl through `platform_cli` with `platform: "fly-cli"`. Never run `fly` yourself, pass a token or run `fly auth login`.

1. `["apps", "list", "--json"]` shows the apps the token reaches; `["status", "--json"]` shows this folder's app when `fly.toml` exists.
2. A new app: `["launch", "--no-deploy", "--yes", "--name", "<app>", "--region", "<region>"]` writes `fly.toml` and a `Dockerfile` when the project has none. Read both, adjust the internal port and the health check (`[[http_service.checks]]`), and commit them.
3. Secrets: `["secrets", "set", "KEY=value", "--stage"]`; list names with `["secrets", "list"]`. Never echo a value.
4. Deploy with `["deploy", "--detach"]`, then follow `["logs", "--no-tail"]` and `["status"]` until the machines pass their checks.
5. Postgres: `["postgres", "create", "--name", "<app>-db"]` then `["postgres", "attach", "<app>-db"]`, which sets `DATABASE_URL`.
