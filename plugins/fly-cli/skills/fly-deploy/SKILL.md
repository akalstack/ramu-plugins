---
name: fly-deploy
description: "Launch and deploy a project on Fly.io: fly.toml, fly launch, secrets, Managed Postgres and fly deploy. Use when the project deploys to Fly.io."
---

# Deploying to Fly.io

Run flyctl through `platform_cli` with `platform: "fly-cli"`, signed in with the token on the plugin's card in Settings → Plugins. Never run `fly` in a shell yourself, pass a token or run `fly auth login`. Reads (`status`, `logs --no-tail`, `apps list`, `mpg list` and the like) run straight away; anything else asks the person, and a production deploy asks with its own card.

1. `["apps", "list", "--json"]` shows the apps the token reaches; `["status", "--json"]` shows this folder's app when `fly.toml` exists. Pass `-a <app>` explicitly once you know it.
2. A new app: `["launch", "--no-deploy", "--yes", "--name", "<app>", "--region", "<region>"]` writes `fly.toml` and a `Dockerfile` when the project has none. Read both, adjust the internal port and the health check (`[[http_service.checks]]`), and commit them.
3. Secrets: `["secrets", "set", "KEY=value", "--stage"]`; list names with `["secrets", "list"]`. Never echo a value.
4. Deploy with `["deploy", "--detach"]`, then follow `["logs", "--no-tail"]` and `["status"]` until the machines pass their checks (`["checks", "list"]`).
5. Postgres: Fly's Managed Postgres. `["mpg", "list"]` for a cluster to reuse, else `["mpg", "create", "-n", "<app>-db", "-o", "<org>", "-r", "<region>", "--plan", "Basic"]`, wait on `["mpg", "status", "<cluster-id>"]`, then `["mpg", "attach", "<cluster-id>", "-a", "<app>"]`, which sets `DATABASE_URL`. A cluster bills from the moment it is made: say so before creating one.
6. Fly's own plugin (`fly`, offered beside this one) has Fly's full skill, with references for scaling, volumes, networking, certificates and Sprites, and Fly's hosted MCP server (`https://mcp.fly.io`, signed in with the Fly.io account) for reading apps and Machines without a project folder. Follow its references, but run every flyctl command it gives through `platform_cli` as above.
