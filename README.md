# renovate-config

This repository contains common configuration for renovate.
You can use this common configuration by specifying this repository as `extends` in your renovate.json.

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>kitsuyui/renovate-config"
  ]
}
```

### Preset files

The following preset files are available for individual `extends` references.
Use `github>kitsuyui/renovate-config:<filename>` to apply a specific preset without enabling all defaults.

| File | Extends syntax | Description |
| --- | --- | --- |
| `cargo.json5` | `github>kitsuyui/renovate-config:cargo.json5` | Rust/Cargo: minimumReleaseAge 3 days, groups for serde / pyo3 / clap / assert_cmd, automerge for own crates |
| `gha.json5` | `github>kitsuyui/renovate-config:gha.json5` | GitHub Actions: pin digests to immutable SHAs, minimumReleaseAge 3 days, automerge for official/trusted actions |
| `lockfile.json5` | `github>kitsuyui/renovate-config:lockfile.json5` | Enable lock file maintenance with automerge |
| `npm.json5` | `github>kitsuyui/renovate-config:npm.json5` | npm: minimumReleaseAge 3 days, automerge for swc / @types / turbo / Next.js / typescript-eslint / eslint / prettier / own packages |
| `pin.json5` | `github>kitsuyui/renovate-config:pin.json5` | Enable automerge for pinning updates |
| `python.json5` | `github>kitsuyui/renovate-config:python.json5` | PyPI: minimumReleaseAge 2 days, boto3 group, automerge for typing-extensions / mypy / pytest / ruff / black / own packages |

Example: apply only the npm preset alongside the default:

```json
{
  "$schema": "https://docs.renovatebot.com/renovate-schema.json",
  "extends": [
    "github>kitsuyui/renovate-config",
    "github>kitsuyui/renovate-config:npm.json5"
  ]
}
```

> **Breaking changes**: This repository does not currently provide versioned releases.
> Preset changes take effect immediately for all consumers.
> Watch this repository or pin to a specific commit SHA in your `extends` path to avoid unexpected changes.

### Policy

I recommend to configure renovate in each project.
This repository will contain common configuration for renovate.
For example, the following things.

- In Rust's `cargo`, update `serde` and `serde_derive` at the same time.
- In Node.js's `npm`, update `eslint` and `eslint-plugin-xxx` at the same time.
- ...

If you configure these things in each project, you will have to configure the same thing in multiple projects.

### Versioning and live updates

This repository has **no versioned releases**. All sub-preset references in
`default.json` (`github>kitsuyui/renovate-config:<file>`) point to the default
branch without SHA pinning. This is intentional: changes take effect
immediately for all consumers.

If you need a stable, reproducible configuration, pin the reference in your
own config file using the commit SHA:

```json
{
  "extends": [
    "github>kitsuyui/renovate-config@<commit-sha>"
  ]
}
```

See the [Renovate docs on presets](https://docs.renovatebot.com/config-presets/)
for details on how SHA pinning works for `github>` references.

### Schedule and timezone

This preset includes a `timezone` and `schedule` that are inherited by all consumers:

- `timezone`: `Asia/Tokyo` (JST, UTC+9)
- `schedule`: `["before 9am every weekday", "every weekend"]`

Renovate interprets `schedule` relative to the configured `timezone`. If your project is not in JST, Renovate PRs will arrive at times that do not correspond to your local working hours. To override, add these fields to your own `renovate.json`:

```json
{
  "extends": ["github>kitsuyui/renovate-config"],
  "timezone": "America/New_York",
  "schedule": ["before 9am every weekday"]
}
```

### Minimum release age policy

This repository keeps only the applied configuration values.
The source-of-truth document for the policy rationale and official ecosystem references is:

- https://github.com/kitsuyui/kitsuyui/wiki/Official-Information-for-Dependency-Update-Policies

Current values in this preset:

- `npm`: `3 days`
- `pypi`: `2 days`
- `cargo`: `3 days`
- `github-actions`: `3 days`

### Auto merge policy

I only enable auto merge for the following rules.

1. I am the author of the package.
2. The package is an official package of the language, framework or service.
3. The package health is good enough.
  - Security ... Snyk score, number of vulnerabilities.
  - Popularity ... Linus's Law (given enough eyeballs, all bugs are shallow), number of downloads, Big tech's usage, etc.
  - Maintenance ... Update frequency, number of open issues, etc.
  - Community ... Code of conducts, number of maintainers, number of contributors, code review, code coverage, etc.
  - Documentation ... README, CONTRIBUTING, etc.

## License

I don't think that there is any right in this repository because this repository contains only configuration for Renovate application.
However, I will license this repository under MIT License for formal reasons.
