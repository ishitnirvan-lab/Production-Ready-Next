---
name: Imported artifact startup
description: How imported artifact metadata becomes runnable in the Replit workspace.
---

Artifact metadata for an imported workspace may be present before the live artifact and workflow registry updates. Check the live registry after import; once the managed service appears, start that exact workflow instead of creating a replacement.

**Why:** The initial registry can be empty even when `artifact.toml` exists, and a fallback workflow may time out or bypass managed environment and routing configuration.

**How to apply:** For imported apps, wait for the registry update and use artifact-owned workflow names when available; create a custom workflow only if the service is genuinely unregistered.