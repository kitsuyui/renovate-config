import { describe, expect, it } from 'bun:test'

// Renovate evaluates matchPackagePatterns entries as regexes via new RegExp(p).test(name).
function matchesPattern(pattern: string, packageName: string): boolean {
  return new RegExp(pattern).test(packageName)
}

// Helper: any pattern in the list matches
function matchesAny(patterns: string[], packageName: string): boolean {
  return patterns.some((p) => matchesPattern(p, packageName))
}

// npm.json5 — matchPackagePatterns coverage
describe('npm.json5 matchPackagePatterns', () => {
  describe('^@types/node$, ^@types/react$, ^@types/react-dom$', () => {
    const patterns = ['^@types/node$', '^@types/react$', '^@types/react-dom$']

    it('matches @types/node', () =>
      expect(matchesAny(patterns, '@types/node')).toBe(true))
    it('matches @types/react', () =>
      expect(matchesAny(patterns, '@types/react')).toBe(true))
    it('matches @types/react-dom', () =>
      expect(matchesAny(patterns, '@types/react-dom')).toBe(true))
    // Anchored patterns must not bleed into unintended packages
    it('does not match @types/node-forge', () =>
      expect(matchesAny(patterns, '@types/node-forge')).toBe(false))
    it('does not match @types/react-router', () =>
      expect(matchesAny(patterns, '@types/react-router')).toBe(false))
  })

  describe('^eslint$', () => {
    const pattern = '^eslint$'

    it('matches eslint', () =>
      expect(matchesPattern(pattern, 'eslint')).toBe(true))
    // Anchored: must not match eslint plugins or scoped packages
    it('does not match eslint-plugin-react', () =>
      expect(matchesPattern(pattern, 'eslint-plugin-react')).toBe(false))
    it('does not match eslint-config-prettier', () =>
      expect(matchesPattern(pattern, 'eslint-config-prettier')).toBe(false))
    // @eslint/js is the eslint v9+ official config package.
    // The current pattern does not cover it; update this test and the
    // matching rule together if @eslint/js automerge is intended.
    it('does not match @eslint/js (current behavior — update if intent changes)', () =>
      expect(matchesPattern(pattern, '@eslint/js')).toBe(false))
  })

  describe('^prettier$', () => {
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

  describe('^@kitsuyui/react-', () => {
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

// gha.json5 — matchPackagePatterns coverage (github-actions datasource)
describe('gha.json5 matchPackagePatterns', () => {
  describe('^actions/checkout$', () => {
    const pattern = '^actions/checkout$'

    it('matches actions/checkout', () =>
      expect(matchesPattern(pattern, 'actions/checkout')).toBe(true))
    it('does not match actions/checkout-private', () =>
      expect(matchesPattern(pattern, 'actions/checkout-private')).toBe(false))
  })

  describe('^actions/upload-artifact$', () => {
    const pattern = '^actions/upload-artifact$'

    it('matches actions/upload-artifact', () =>
      expect(matchesPattern(pattern, 'actions/upload-artifact')).toBe(true))
    it('does not match actions/upload-artifact-new', () =>
      expect(matchesPattern(pattern, 'actions/upload-artifact-new')).toBe(
        false,
      ))
  })

  describe('^actions/download-artifact$', () => {
    const pattern = '^actions/download-artifact$'

    it('matches actions/download-artifact', () =>
      expect(matchesPattern(pattern, 'actions/download-artifact')).toBe(true))
    it('does not match actions/download-artifacts', () =>
      expect(matchesPattern(pattern, 'actions/download-artifacts')).toBe(false))
  })
})
