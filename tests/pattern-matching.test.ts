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
