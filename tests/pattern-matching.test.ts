import { describe, expect, it } from 'bun:test'

// Renovate evaluates matchPackageNames regex entries (e.g. "/^serde/") via new RegExp(p).test(name).
// Exact-name entries in matchPackageNames are matched by string equality in Renovate itself.
function matchesPattern(pattern: string, packageName: string): boolean {
  return new RegExp(pattern).test(packageName)
}

// Helper: any pattern in the list matches
function matchesAny(patterns: string[], packageName: string): boolean {
  return patterns.some((p) => matchesPattern(p, packageName))
}

function exactPatterns(packageNames: string[]): string[] {
  return packageNames.map((packageName) => `^${packageName}$`)
}

// npm.json5 — matchPackageNames coverage
describe('npm.json5 matchPackageNames', () => {
  describe('@types/node, @types/react, @types/react-dom (exact names)', () => {
    // Now exact-name matches via matchPackageNames; tested here via equivalent regex
    const patterns = ['^@types/node$', '^@types/react$', '^@types/react-dom$']

    it('matches @types/node', () =>
      expect(matchesAny(patterns, '@types/node')).toBe(true))
    it('matches @types/react', () =>
      expect(matchesAny(patterns, '@types/react')).toBe(true))
    it('matches @types/react-dom', () =>
      expect(matchesAny(patterns, '@types/react-dom')).toBe(true))
    // Exact names must not bleed into unintended packages
    it('does not match @types/node-forge', () =>
      expect(matchesAny(patterns, '@types/node-forge')).toBe(false))
    it('does not match @types/react-router', () =>
      expect(matchesAny(patterns, '@types/react-router')).toBe(false))
  })

  describe('eslint, @eslint/js (exact names)', () => {
    // Both eslint and @eslint/js are now covered via matchPackageNames exact matching
    const patterns = ['^eslint$', '^@eslint/js$']

    it('matches eslint', () =>
      expect(matchesAny(patterns, 'eslint')).toBe(true))
    it('matches @eslint/js', () =>
      expect(matchesAny(patterns, '@eslint/js')).toBe(true))
    // Exact names must not match eslint plugins or scoped packages
    it('does not match eslint-plugin-react', () =>
      expect(matchesAny(patterns, 'eslint-plugin-react')).toBe(false))
    it('does not match eslint-config-prettier', () =>
      expect(matchesAny(patterns, 'eslint-config-prettier')).toBe(false))
  })

  describe('prettier (exact name)', () => {
    const pattern = '^prettier$'

    it('matches prettier', () =>
      expect(matchesPattern(pattern, 'prettier')).toBe(true))
    it('does not match prettier-plugin-tailwindcss', () =>
      expect(matchesPattern(pattern, 'prettier-plugin-tailwindcss')).toBe(
        false,
      ))
    it('does not match @prettier/plugin-ruby', () =>
      expect(matchesPattern(pattern, '@prettier/plugin-ruby')).toBe(false))
  })

  describe('/^@kitsuyui\\/react-/ (regex prefix)', () => {
    // matchPackageNames: ["/^@kitsuyui\\/react-/"] — prefix regex
    const pattern = '^@kitsuyui/react-'

    it('matches @kitsuyui/react-components', () =>
      expect(matchesPattern(pattern, '@kitsuyui/react-components')).toBe(true))
    it('matches @kitsuyui/react-playground', () =>
      expect(matchesPattern(pattern, '@kitsuyui/react-playground')).toBe(true))
    it('does not match @kitsuyui/utilities', () =>
      expect(matchesPattern(pattern, '@kitsuyui/utilities')).toBe(false))
    it('does not match kitsuyui-react-utils (no scope)', () =>
      expect(matchesPattern(pattern, 'kitsuyui-react-utils')).toBe(false))
  })
})

// gha.json5 — matchPackageNames coverage (github-actions datasource)
describe('gha.json5 matchPackageNames', () => {
  describe('actions/checkout (exact name)', () => {
    const pattern = '^actions/checkout$'

    it('matches actions/checkout', () =>
      expect(matchesPattern(pattern, 'actions/checkout')).toBe(true))
    it('does not match actions/checkout-private', () =>
      expect(matchesPattern(pattern, 'actions/checkout-private')).toBe(false))
  })

  describe('actions/upload-artifact (exact name)', () => {
    const pattern = '^actions/upload-artifact$'

    it('matches actions/upload-artifact', () =>
      expect(matchesPattern(pattern, 'actions/upload-artifact')).toBe(true))
    it('does not match actions/upload-artifact-new', () =>
      expect(matchesPattern(pattern, 'actions/upload-artifact-new')).toBe(
        false,
      ))
  })

  describe('actions/download-artifact (exact name)', () => {
    const pattern = '^actions/download-artifact$'

    it('matches actions/download-artifact', () =>
      expect(matchesPattern(pattern, 'actions/download-artifact')).toBe(true))
    it('does not match actions/download-artifacts', () =>
      expect(matchesPattern(pattern, 'actions/download-artifacts')).toBe(false))
  })
})

// cargo.json5 — matchPackageNames coverage (crate datasource)
describe('cargo.json5 matchPackageNames', () => {
  describe('serde group (exact names)', () => {
    const patterns = exactPatterns([
      'serde',
      'serde_derive',
      'serde_json',
      'serde_yaml',
    ])

    it('matches serde ecosystem packages in the explicit group', () => {
      expect(matchesAny(patterns, 'serde')).toBe(true)
      expect(matchesAny(patterns, 'serde_derive')).toBe(true)
      expect(matchesAny(patterns, 'serde_json')).toBe(true)
      expect(matchesAny(patterns, 'serde_yaml')).toBe(true)
    })

    it('does not match serde-adjacent packages outside the explicit group', () => {
      expect(matchesAny(patterns, 'serde_with')).toBe(false)
      expect(matchesAny(patterns, 'serde_repr')).toBe(false)
    })
  })

  describe('pyo3 group (exact names)', () => {
    const patterns = exactPatterns([
      'pyo3',
      'pyo3-build-config',
      'pyo3-ffi',
      'pyo3-macros',
      'pyo3-macros-backend',
    ])

    it('matches all explicit pyo3 packages', () => {
      expect(matchesAny(patterns, 'pyo3')).toBe(true)
      expect(matchesAny(patterns, 'pyo3-build-config')).toBe(true)
      expect(matchesAny(patterns, 'pyo3-ffi')).toBe(true)
      expect(matchesAny(patterns, 'pyo3-macros')).toBe(true)
      expect(matchesAny(patterns, 'pyo3-macros-backend')).toBe(true)
    })

    it('does not match unrelated packages', () => {
      expect(matchesAny(patterns, 'cpython')).toBe(false)
      expect(matchesAny(patterns, 'pydantic')).toBe(false)
    })
  })

  describe('clap group (exact names)', () => {
    const patterns = exactPatterns(['clap', 'clap_complete', 'clap_derive'])

    it('matches all explicit clap packages', () => {
      expect(matchesAny(patterns, 'clap')).toBe(true)
      expect(matchesAny(patterns, 'clap_complete')).toBe(true)
      expect(matchesAny(patterns, 'clap_derive')).toBe(true)
    })

    it('does not match adjacent clap packages', () => {
      expect(matchesAny(patterns, 'clap_builder')).toBe(false)
      expect(matchesAny(patterns, 'clapper')).toBe(false)
    })
  })

  describe('assert_cmd group (exact names)', () => {
    const patterns = exactPatterns(['assert_cmd', 'predicates'])

    it('matches assert_cmd and predicates', () => {
      expect(matchesAny(patterns, 'assert_cmd')).toBe(true)
      expect(matchesAny(patterns, 'predicates')).toBe(true)
    })

    it('does not match adjacent command assertion packages', () => {
      expect(matchesAny(patterns, 'assert_fs')).toBe(false)
      expect(matchesAny(patterns, 'predicate')).toBe(false)
    })
  })

  describe('/^rust-codecov/ (regex prefix)', () => {
    const pattern = '^rust-codecov'

    it('matches rust-codecov', () =>
      expect(matchesPattern(pattern, 'rust-codecov')).toBe(true))
    it('matches rust-codecov-core', () =>
      expect(matchesPattern(pattern, 'rust-codecov-core')).toBe(true))
    it('does not match rustfmt', () =>
      expect(matchesPattern(pattern, 'rustfmt')).toBe(false))
    it('does not match codecov-rust', () =>
      expect(matchesPattern(pattern, 'codecov-rust')).toBe(false))
  })
})

// python.json5 — matchPackageNames coverage (pypi datasource)
describe('python.json5 matchPackageNames', () => {
  describe('boto3 group (exact names)', () => {
    const patterns = exactPatterns(['boto3', 'botocore', 'boto3-stubs'])

    it('matches all explicit boto3 packages', () => {
      expect(matchesAny(patterns, 'boto3')).toBe(true)
      expect(matchesAny(patterns, 'botocore')).toBe(true)
      expect(matchesAny(patterns, 'boto3-stubs')).toBe(true)
    })

    it('does not match adjacent boto packages', () => {
      expect(matchesAny(patterns, 'aioboto3')).toBe(false)
      expect(matchesAny(patterns, 'boto')).toBe(false)
    })
  })

  describe('tooling automerge rules (exact names)', () => {
    const patterns = exactPatterns([
      'typing-extensions',
      'mypy',
      'pytest',
      'ruff',
      'black',
    ])

    it('matches the explicit tooling packages', () => {
      expect(matchesAny(patterns, 'typing-extensions')).toBe(true)
      expect(matchesAny(patterns, 'mypy')).toBe(true)
      expect(matchesAny(patterns, 'pytest')).toBe(true)
      expect(matchesAny(patterns, 'ruff')).toBe(true)
      expect(matchesAny(patterns, 'black')).toBe(true)
    })

    it('does not match adjacent tooling packages', () => {
      expect(matchesAny(patterns, 'pytest-xdist')).toBe(false)
      expect(matchesAny(patterns, 'ruff-lsp')).toBe(false)
      expect(matchesAny(patterns, 'blacken-docs')).toBe(false)
    })
  })

  describe('author package automerge rules (exact names)', () => {
    const patterns = exactPatterns([
      'timevec',
      'cachepot',
      'richset',
      'dict-zip',
      'bamboo-crawler',
      'throttle-controller',
      'tally-token',
    ])

    it('matches the explicit author packages', () => {
      expect(matchesAny(patterns, 'timevec')).toBe(true)
      expect(matchesAny(patterns, 'cachepot')).toBe(true)
      expect(matchesAny(patterns, 'richset')).toBe(true)
      expect(matchesAny(patterns, 'dict-zip')).toBe(true)
      expect(matchesAny(patterns, 'bamboo-crawler')).toBe(true)
      expect(matchesAny(patterns, 'throttle-controller')).toBe(true)
      expect(matchesAny(patterns, 'tally-token')).toBe(true)
    })

    it('does not match adjacent package names', () => {
      expect(matchesAny(patterns, 'time-vector')).toBe(false)
      expect(matchesAny(patterns, 'cachepot-tools')).toBe(false)
      expect(matchesAny(patterns, 'tally-tokenizer')).toBe(false)
    })
  })
})
