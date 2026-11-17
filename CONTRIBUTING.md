# Listing a plugin

1. Build the plugin in its own repository, in the Claude Code and Codex layout, with Ramu's fields under `extensions["dev.getramu"]` in its manifest. `ramu plugin new <name>` or the [template](https://github.com/akalstack/ramu-plugin-template) gives you a working start; `ramu plugin dev .` installs it on your host so a thread can use it while you work.
2. Make sure `ramu plugin check .` reports no problems.
3. Sign the commit you want listed. With an SSH key:

   ```sh
   git config gpg.format ssh
   git config user.signingkey ~/.ssh/id_ed25519.pub
   git commit -S -m "Release 1.0.0"
   ```

4. Open a pull request here adding one entry to `.claude-plugin/marketplace.json`:

   ```json
   {
     "name": "render",
     "source": { "source": "github", "repo": "acme/render-plugin", "sha": "<the signed commit>" },
     "description": "Deploy to Render through its CLI.",
     "author": { "name": "Acme" },
     "keywords": ["render", "deploy"],
     "extensions": { "dev.getramu": { "signingKey": "ssh-ed25519 AAAA… you@acme.com", "stacks": ["nextjs"] } }
   }
   ```

   Commits to this repository are signed too, so sign yours.

CI runs `ramu plugin check` on every plugin. A maintainer then reviews the manifest, the MCP commands it runs, the read-only command prefixes and how the credential is used, before merging. An update is a pull request that moves `sha` to a newer signed commit; a change of `signingKey` needs the author to say why in the pull request.
