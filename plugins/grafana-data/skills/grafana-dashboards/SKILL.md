---
name: grafana-dashboards
description: "Show Grafana metrics in a Ramu dashboard table. Use when the person asks for a dashboard of metrics, logs or a SQL query that lives in Grafana."
---

# Grafana in Ramu dashboards

Grafana's own plugin (`grafana-mcp` in Claude's plugins, offered beside this one) runs Grafana's MCP server with a service account token, for any Grafana; on Grafana Cloud, Grafana's hosted server (`grafana-cloud-mcp`, `https://mcp.grafana.com/mcp`) signs in with the Grafana account instead. Its skills teach the service in full: use its tools to list data sources, search dashboards and try a query before putting it in a table. This plugin adds what only Ramu does: a dashboard table that reads Grafana again whenever the dashboard refreshes, with the Viewer token saved on its card in Settings → Plugins. Never ask for the token or call Grafana's API with it yourself.

A dashboard table reads Grafana with a `service` naming this plugin's data source:

```json
{ "id": "errors", "columns": ["Time", "Value"], "service": { "id": "grafana", "datasource": "<data source uid>", "query": { "expr": "sum(rate(http_requests_total{status=~\"5..\"}[5m]))" }, "from": "now-7d" } }
```

- `datasource` is the uid on the data source's page in Grafana (Connections → Data sources), or from Grafana's tools that list data sources.
- `query` holds the data source's own fields: `{ "expr": "…" }` for Prometheus, `{ "rawSql": "…", "format": "table" }` for SQL data sources.
- `columns` names the fields of the first frame Grafana returns (for a Prometheus range, `Time` and `Value`).
- The dashboard reads it only after the person allows it on the dashboard; Ramu calls only `/api/ds/query` on their Grafana address.
