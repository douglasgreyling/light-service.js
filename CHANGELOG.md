# Changelog

All notable changes to this project are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [2.0.0] - 2026-08-25

### Removed

- **The package no longer has any runtime dependencies.** `p-pipe` and
  `p-each-series` were roughly fifteen lines between them and have been inlined
  as `src/utils/pipe.js` and `src/utils/eachSeries.js` (both MIT, Sindre
  Sorhus). Their latest majors are ESM-only, which would have broken every
  CommonJS consumer; inlining removes that pressure entirely and leaves the
  choice of module format open.

### Breaking

- **Context keys which collide with the Context API are now rejected.** Your
  data and the context share one object, so a key named after a context function
  shadowed it — `{ success: ... }` crashed the run outright, and
  `{ message: ... }` passed silently and then threw when `result.message()` was
  called. All sixteen names now raise a `ReservedContextKeysError` when the
  context is built. Aliases are checked against the same list.

  If you were passing one of these keys, rename it:

  ```javascript
  // before — appeared to work, would throw on result.message()
  this.with({ message: order.message });

  // after
  this.with({ orderMessage: order.message });
  ```

  The reserved names are `success`, `failure`, `message`, `currentOrganizer`,
  `currentAction`, `errorCode`, `shouldRollback`, `fail`, `nextContext`,
  `failAndReturn`, `skipRemaining`, `failWithRollback`, `cleanActionContext`,
  `cleanOrganizerContext`, `registerAliases` and `__mapAlias`.

- **`Action.rollBack()` now honours its documented signature.** It declared
  `rollBack(context, aliases)` but handed the argument to a constructor which
  destructured `{ aliases, hooks }`, so the aliases were dropped. Callers who
  worked around this by passing `{ aliases: { ... } }` need to pass the alias
  map directly:

  ```javascript
  // before — the workaround
  await SomeAction.rollBack(context, { aliases: { number: "num" } });

  // after — as documented
  await SomeAction.rollBack(context, { number: "num" });
  ```

- **An alias which collides with an existing context value now raises.**
  Previously the existing value was silently replaced. This behaviour was
  already documented; it is now actually implemented, as an
  `AliasKeyAlreadyInContextError`.

### Fixed

- **Rollback no longer crashes when the first action fails.** The organizer
  worked out where a failure happened with
  `actions.indexOf(failedAction.constructor)`, which returns `0` for the first
  action and produced an empty rollback chain — surfacing as
  `Error: Expected at least one argument` instead of a failed context.

- **Rollback picks the right actions when an action class appears twice.**
  `indexOf` always found the first occurrence, so a pipeline like
  `reduce(A, B, A)` failing at the third position rolled back the wrong set,
  usually nothing. The organizer now records where each action ran.

- **Rollback works in bundled code.** Control flow was identified with
  `err.constructor.name === "RollbackError"`, which minifiers break by renaming
  classes. Under `esbuild --minify` a rollback threw an unrecognised error to
  the caller rather than rolling back. All such checks now use `instanceof`.

- **An asynchronous `rolledBack` on the failing action is awaited.** It was
  called without `await`, so `reduce()` could resolve while the rollback was
  still in flight.

- **Hooks receive the organizer as `this`.** Every step was bound to the action,
  including hooks declared on the organizer, so `this` inside a hook was the
  action and any organizer property read through it was `undefined`.

- **A hook which triggers a rollback no longer rolls back an action that never
  ran.** `failWithRollback` from a `beforeEach` called the action's `rolledBack`
  even though `executed` had not been reached — undoing work that was never
  done.

- **`fail()` keeps falsy values.** `fail("", { errorCode: 0 })` discarded both,
  because each was tested for truthiness rather than presence.

- **A malformed `expects` explains itself.** `expects = { defaults: {...} }`
  with no `fields` threw
  `Cannot read properties of undefined (reading 'includes')`.

### Changed

- **Hooks now bracket the actions which actually run.** An action skipped by an
  earlier failure or by `skipRemaining()` gets no hooks at all, unchanged. An
  action which starts and then fails now gets its closing `afterEach` and
  `aroundEach`, where previously both were skipped — so `aroundEach` genuinely
  surrounds the action, and instrumentation is not lost precisely when something
  has gone wrong. If your `afterEach` has side effects, it will now run on the
  failure path.

- **`reduce()` with no actions returns the context** instead of raising
  `Expected at least one argument`.

- **`shouldRollback()` returns a boolean** rather than `undefined` when an
  organizer is set but no rollback has been requested.

### Added

- **`Context` and the error classes are exported**, so the errors this library
  throws can be identified with `instanceof` — the same way the library now
  identifies them internally.

  ```javascript
  const {
    Action,
    Organizer,
    Context,
    ExpectedKeysNotInContextError,
    PromisedKeysNotInContextError,
    RollbackError,
    SkipActionError,
    AliasKeyAlreadyInContextError,
    ReservedContextKeysError,
  } = require("@douglasgreyling/light-service");
  ```

- **`displayName` for bundled code.** `currentAction()` and
  `currentOrganizer()` report class names, which minifiers rewrite. Declaring
  `static displayName = "..."` on an action or organizer keeps that metadata
  readable.

- **A `files` allowlist.** The published package was shipping the entire test
  suite and the README's images: 55 files and 94.9 kB, now 15 files and 13.2 kB.

### Documentation

- Corrected the examples, which had drifted from the API: the wrong package
  name in every `import`; hook examples comparing `currentAction()` against a
  class rather than the class name, so they never matched; a rollback example
  whose handler took an `executed` parameter but referred to an undefined
  `context`; `skipRemaining()` shown taking a message it ignores; and
  error-code conditions inverted against their messages. Every example is now
  executed against the library as part of review.
- Corrected the documented behaviour of `expects` defaults: a default applies
  when the key is **absent**, not when it is `undefined`.
- Repaired the table of contents, which linked to two sections that did not
  exist and mis-escaped two anchors.
- Documented reserved context keys, hook semantics, `displayName`, and catching
  errors by type.

### Internal

- Development now runs in Docker: `docker compose run --rm test`, `watch`,
  `lint`, `format`, `ci`. See the README's Development section.
- Migrated from Yarn to npm. Yarn 1 is unavailable on Node 26, which ships
  without Corepack, so the image could not install dependencies there.
- CI runs against Node 22, 24 and 26 (was: Node 14, long past end of life), and
  adds lint, format and `npm audit` jobs. The audit also runs weekly so newly
  disclosed advisories surface without waiting for a push.
- Added ESLint and Prettier. The first lint run found a test whose title claimed
  it checked `success` while it asserted on `failure()`.
- Test suite grew from 40 to 70 tests; every fix above landed with a test
  verified to fail without it.

[unreleased]: https://github.com/douglasgreyling/light-service.js/compare/v2.0.0...HEAD
[2.0.0]: https://github.com/douglasgreyling/light-service.js/releases/tag/v2.0.0
