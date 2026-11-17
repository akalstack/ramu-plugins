---
name: salesforce-dashboards
description: "Show Salesforce records in a Ramu dashboard table with SOQL. Use when the person asks for pipeline, opportunities, accounts or cases from Salesforce."
---

# Salesforce in Ramu dashboards

When Salesforce's own plugin (salesforce-development in Claude's plugins) is installed, its skills teach the service in full: follow them for what to do. This plugin adds what only Ramu does: reading Salesforce data into dashboards with the key saved here.

A dashboard table reads Salesforce with a `service` naming this plugin's data source:

```json
{ "id": "pipeline", "columns": ["StageName", "Amount", "Account.Name"], "service": { "id": "salesforce", "soql": "SELECT StageName, Amount, Account.Name FROM Opportunity WHERE IsClosed = false" } }
```

- Only `SELECT` queries run; a related record's field is read by its path (`Account.Name`).
- Sign-in is through the person's own connected app: in Setup → App Manager, a connected app with OAuth on, the callback `http://localhost:7417/plugin/callback`, the `api` and `refresh_token` scopes, and PKCE required. They paste its consumer key in Settings → Plugins → Salesforce.
