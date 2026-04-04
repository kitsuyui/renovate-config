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

### Policy

I recommend to configure renovate in each project.
This repository will contain common configuration for renovate.
For example, the following things.

- In Rust's `cargo`, update `serde` and `serde_derive` at the same time.
- In Node.js's `npm`, update `eslint` and `eslint-plugin-xxx` at the same time.
- ...

If you configure these things in each project, you will have to configure the same thing in multiple projects.

### Minimum release age policy

This preset adds a short quarantine window before newly published releases are proposed by Renovate.

- `npm`: `3 days`
- `pypi`: `2 days`
- `cargo`: `3 days`
- `github-actions`: `3 days`

The main reference is Renovate's `minimumReleaseAge` feature:

- https://docs.renovatebot.com/key-concepts/minimum-release-age/

The current defaults are chosen with the following official references in mind:

- `npm`: keep `3 days` to align with Renovate's npm security preset and npm's 72 hour unpublish window
  - https://docs.renovatebot.com/presets-security/#securityminimumreleaseagenpm
  - https://docs.npmjs.com/policies/unpublish/
- `pypi`: use `2 days` because PyPI states that security reports are acknowledged within 48 hours
  - https://pypi.org/security/
  - https://docs.pypi.org/project-management/yanking/
  - https://blog.pypi.org/posts/2023-12-13-2fa-enforcement/
- `cargo`: use the default `3 days` because crates.io documents removal/advisory processes, but this repository does not rely on a fixed public review SLA
  - https://blog.rust-lang.org/2026/02/13/crates.io-malicious-crate-update/
  - https://blog.rust-lang.org/2022/05/10/malicious-crate-rustdecimal/
- `github-actions`: use the default `3 days` because GitHub documents governance controls, but this repository does not rely on a fixed public Marketplace review SLA
  - https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/enabling-features-for-your-repository/managing-github-actions-settings-for-a-repository

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
