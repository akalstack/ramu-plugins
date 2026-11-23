# Ramu plugins

The index of plugins for [Ramu](https://getramu.dev). One install adds a service's skills, MCP servers, credential, safe CLI commands and abilities for every provider. Browse them in Ramu under **Settings → Plugins**, or at [getramu.dev/plugins](https://getramu.dev/plugins).

`.claude-plugin/marketplace.json` lists every plugin with its source and pinned commit. The same file works as a Claude Code marketplace:

```sh
claude plugin marketplace add akalstack/ramu-plugins
```

## By Ramu

Akalstack maintains these plugins, and they live in [`plugins/`](plugins):

| Plugin | Adds |
| --- | --- |
| [fly-cli](plugins/fly-cli) | flyctl through `platform_cli` and a deploy skill, with Fly's own plugin offered beside it |
| [grafana-data](plugins/grafana-data) | the `grafana` data source for dashboards |
| [amplitude-data](plugins/amplitude-data) | the `amplitude` data source for dashboards |
| [salesforce-data](plugins/salesforce-data) | the `salesforce` data source for dashboards, with a sign-in through your own connected app |
| [higgsfield-media](plugins/higgsfield-media) | Higgsfield's hosted MCP server, signed in with your Higgsfield account, mapped to video, images, speech, music and sound effects so `make_video`, `generate_image`, `speak`, `make_music` and `make_sound` run on it, with Higgsfield's own plugin offered beside it |
| [meshy](plugins/meshy) | Meshy's MCP server mapped to 3D models, so `make_model` makes textured GLB models, a game assets skill, and Meshy's own skills offered beside it |
| [tripo](plugins/tripo) | Tripo's own MCP tools from `tripo-cli`, mapped to 3D models, with rigging, animation, texturing and conversion |
| [godot](plugins/godot) | the `godot` command through `platform_cli` (checks run without asking, exports ask) and a Godot projects skill |

## Adding a plugin

Open a pull request that adds one entry to `.claude-plugin/marketplace.json`; see [CONTRIBUTING.md](CONTRIBUTING.md). Start a new plugin from [akalstack/ramu-plugin-template](https://github.com/akalstack/ramu-plugin-template) or with `ramu plugin new <name>`.

## Signatures

Every commit in this repository is signed with Akalstack's key, which ships in Ramu: a clone whose commit that key did not sign is refused before anything in it is read. A plugin in its own repository names its author's signing key in its entry, and Ramu installs only a pinned commit signed by that key.
