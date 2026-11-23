---
name: amplitude-dashboards
description: "Show Amplitude event counts in a Ramu dashboard table. Use when the person asks for signups, active users or any event over time from Amplitude."
---

# Amplitude in Ramu dashboards

Amplitude's own plugin (`amplitude` in Claude's plugins, offered beside this one) connects Amplitude's hosted MCP server, signed in with the person's Amplitude account (`https://mcp.amplitude.com/mcp`, or `https://mcp.eu.amplitude.com/mcp` for data in the EU), and its skills teach the service in full: use it to answer a question once, explore charts and find the exact event names. This plugin adds what only Ramu does: a dashboard table that reads Amplitude again whenever the dashboard refreshes, with the project's keys saved on its card in Settings → Plugins. Never ask for the keys or call Amplitude's API with them yourself.

A dashboard table reads Amplitude with a `service` naming this plugin's data source:

```json
{ "id": "signups", "columns": ["date", "value"], "service": { "id": "amplitude", "event": "Sign Up", "metric": "uniques", "days": 30, "interval": 1 } }
```

- `event` is the event type exactly as Amplitude shows it. Look it up first (with Amplitude's tools, or ask the person): a misspelled event returns no rows, not an error.
- `metric` is `uniques` (the default), `totals`, `pct_dau` or `average`; `interval` is 1 (daily), 7 or 30.
- Rows have `date`, `series` and `value`.
- The keys belong to one project and one data center (US or EU, chosen on the card). For another project, the person saves that project's keys.
