# ⚠️ Orphaned-work notice — ftree · 2026-08-08

**Read this before resuming work in this repository.**

An estate-wide repository sync on 2026-08-08 checked every git clone on this PC and on both Linux
workers (he-1, he-2) for work that exists on **no remote**. This repository was flagged. Nothing has
been lost and **nothing was deleted** — but the work below is on one disk only until someone lands it.

**What this project is:** Config-driven filtered file-tree generator - monorepo

---

## What was found here

| Check                                                      | Count |
| ---------------------------------------------------------- | ----: |
| Commits reachable from a local branch but **on no remote** | **3** |
| Uncommitted files (modified + untracked)                   | **1** |
| Stashes                                                    | **1** |

**Remote status:** remote(s) `origin` configured; current branch tracks `origin/master`.

### The commits that exist nowhere else

```
2026-01-21 | ehsan-255 | docs: add comprehensive v2.0 brainstorming and feature design
2026-01-20 | ehsan-255 | WIP on dependabot/npm_and_yarn/production-dependencies-18ce65108d: 1d30aea chore: merge master into dependabot branch
2026-01-20 | ehsan-255 | index on dependabot/npm_and_yarn/production-dependencies-18ce65108d: 1d30aea chore: merge master into dependabot branch
```

### Stashes (invisible to `git bundle --all`)

```
stash@{0}: WIP on dependabot/npm_and_yarn/production-dependencies-18ce65108d: 1d30aea chore: merge master into dependabot branch
```

### Uncommitted files

```
?? .claude/
```

## Why the usual check missed this

**`git log @{u}..` reports `0` for any branch that was never given an upstream.** It errors, prints
nothing, and a `| wc -l` turns that silence into a confident "nothing unpushed". Every branch created
locally and never pushed is invisible to it.

Use these instead — always, and especially before any cleanup that deletes anything:

```bash
git rev-list --count --all --not --remotes   # commits on a local ref but on NO remote
git stash list                               # counted separately: `git bundle --all` does NOT include refs/stash
```

## Your backups

This repository lives on the tower, which was **not** part of the worker purge, so its clone is intact and untouched. The estate-wide inventory recording this finding is at `D:\estate-preserve\20260808\ORPHANED-WORK-INVENTORY.md`. **No bundle was taken of this repo** — it was never at risk of deletion, only of being the single copy.

**A bundle restores history, not a working tree.** It is insurance, not a substitute for pushing.

## What to do

1. Review the items above and decide what deserves to land. **Do not blind-commit** — uncommitted
   files here were left exactly as found and were never interpreted by the sync.
2. Give every branch an upstream **when you create it**, not at the end.
3. Push. Then verify: `git rev-list --count --all --not --remotes` must read `0`, and
   `git stash list` must be empty or deliberate.

**The Architect's standing mandate:** every agent or team is fully responsible for and completely owns
the repository while working in it — **local and remote, and everything in between**. A work package is
not finished when the code works; it is finished when the work is on its remote.

---

_Filed by the supervisor of the Gopatshah authority engagement during an estate-wide sync.
Full cross-project inventory: `D:\estate-preserve\20260808\ORPHANED-WORK-INVENTORY.md`._
