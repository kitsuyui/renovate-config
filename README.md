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

## License

I don't think that there is any right in this repository because this repository contains only configuration for Renovate application.
However, I will license this repository under MIT License for formal reasons.
