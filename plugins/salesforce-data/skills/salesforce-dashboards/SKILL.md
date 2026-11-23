---
name: salesforce-dashboards
description: "Show Salesforce records in a Ramu dashboard table with SOQL. Use when the person asks for pipeline, opportunities, accounts or cases from Salesforce."
---

# Salesforce in Ramu dashboards

Salesforce's own plugin (`salesforce-development` in Claude's plugins, offered beside this one) teaches building on Salesforce in full: metadata, Apex, deploys and the org's objects and fields. Follow it for that work. This plugin adds what only Ramu does: a dashboard table that reads Salesforce records with SOQL whenever the dashboard refreshes, through the person's own sign-in saved on its card in Settings → Plugins. Never ask for a token or call Salesforce's API with it yourself.

A dashboard table reads Salesforce with a `service` naming this plugin's data source:

```json
{ "id": "pipeline", "columns": ["StageName", "Amount", "Account.Name"], "service": { "id": "salesforce", "soql": "SELECT StageName, Amount, Account.Name FROM Opportunity WHERE IsClosed = false" } }
```

- Only `SELECT` queries run; a related record's field is read by its path (`Account.Name`). Use API names (`Amount`, `Custom_Field__c`), not labels, and add `LIMIT` and a `WHERE` on dates for large objects: one query returns at most 2,000 records.
- Sign-in is through the person's own connected app: in Setup → App Manager, a connected app with OAuth on, the callback `http://localhost:7417/plugin/callback`, the `api` and `refresh_token` scopes, and PKCE required. They paste its consumer key in Settings → Plugins → Salesforce.
