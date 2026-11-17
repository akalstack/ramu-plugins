---
name: amplitude-dashboards
description: "Show Amplitude event counts in a Ramu dashboard table. Use when the person asks for signups, active users or any event over time from Amplitude."
---

# Amplitude in Ramu dashboards

When Amplitude's own plugin (amplitude in Claude's plugins) is installed, its skills teach the service in full: follow them for what to do. This plugin adds what only Ramu does: reading Amplitude data into dashboards with the key saved here.

A dashboard table reads Amplitude with a `service` naming this plugin's data source:

```json
{ "id": "signups", "columns": ["date", "value"], "service": { "id": "amplitude", "event": "Sign Up", "metric": "uniques", "days": 30, "interval": 1 } }
```

- `event` is the event type exactly as Amplitude shows it.
- `metric` is `uniques` (the default), `totals`, `pct_dau` or `average`; `interval` is 1 (daily), 7 or 30.
- Rows have `date`, `series` and `value`.
