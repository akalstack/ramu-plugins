---
name: grafana-dashboards
description: "Show Grafana metrics in a Ramu dashboard table. Use when the person asks for a dashboard of metrics, logs or a SQL query that lives in Grafana."
---

# Grafana in Ramu dashboards

When Grafana's own plugin (grafana-mcp in Claude's plugins) is installed, its skills teach the service in full: follow them for what to do. This plugin adds what only Ramu does: reading Grafana data into dashboards with the key saved here.

A dashboard table reads Grafana with a `service` naming this plugin's data source:

```json
{ "id": "errors", "columns": ["Time", "Value"], "service": { "id": "grafana", "datasource": "<data source uid>", "query": { "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m]))" }, "from": "now-7d" } }
```

- `datasource` is the uid on the data source's page in Grafana (Connections → Data sources).
- `query` holds the data source's own fields: `{ "expr": "…" }` for Prometheus, `{ "rawSql": "…", "format": "table" }` for SQL data sources.
- `columns` names the fields of the first frame Grafana returns (for a Prometheus range, `Time` and `Value`).
- The dashboard reads it only after the person allows it on the dashboard; Ramu calls only `/api/ds/query` on their Grafana address.
