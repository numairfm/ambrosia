---
name: handoff
description: Model-invoked only. Do NOT call this directly. Used internally by build, verify, and debug when 2 or more independent tasks exist with no shared state, sequential dependency, or file overlap. Dispatches subagents in parallel within the same response turn. Each subagent receives zero inherited session context.
---

# Handoff

**This skill is not user-invoked.** `build`, `verify`, and `debug` call it when the conditions are met. If you are reading this as a user, you don't need to invoke it manually.

## When to use it

Conditions — ALL must be true:
1. **2 or more** independent items exist (tasks, bugs, failures)
2. **No shared state** — items don't read/write the same data structures or shared mutable state
3. **No sequential dependency** — item B does not depend on item A's output
4. **Disjoint file sets** — each item touches different files with no overlap

If ANY condition fails, do NOT dispatch in parallel. Serialize instead.

**Do not use for:**
- Tasks that share files (git conflicts)
- Tasks where one builds on another's output
- Tasks with shared database migrations or schema changes
- Anything where ordering matters

## The dispatch mechanism

The critical implementation detail: **multiple subagent dispatch calls issued within the same response turn execute in parallel. One dispatch per response executes sequentially.**

To achieve real parallelism, all dispatch calls for this handoff MUST be issued in a single response — not across separate turns.

## Protocol

### Step 1 — Log the dispatch

Before dispatching, append to `ambrosia.log.md`:
```
<timestamp> [handoff] dispatching <N> agents in parallel — [<item-1-label>, <item-2-label>, ...]
```

### Step 2 — Construct work tickets

For each item, construct a minimal work ticket:
- Specific task/bug description & exact target file paths
- Consumed interfaces & report path (`.ambrosia/handoff-<label>-report.md`)
- Reference `AGENTS.md` rules (do not paste verbatim context)
- Clear contract: return status (`DONE` / `DONE_WITH_CONCERNS` / `NEEDS_CONTEXT` / `BLOCKED`)

Omit session history, past summaries, or details of other parallel tasks.


### Step 3 — Dispatch in parallel

Issue ALL dispatch calls in this single response. Each subagent:
- Starts with a clean context window
- Receives only its work ticket
- Writes its full output to its report file
- Returns: status, commits made (if any), one-line result summary, concerns

### Step 4 — Integrate

After all subagents return:

1. **Read each report file.** Don't trust the one-line summary alone for integration decisions.
2. **Conflict check.** Verify the changes don't conflict: overlapping lines, contradictory interfaces, incompatible assumptions. If conflict found: surface to user before merging anything.
3. **Run the full test suite.** Evidence before integration claims.
4. **Handle statuses:**
   - DONE → integrate
   - DONE_WITH_CONCERNS → read concerns before integrating; address if correctness-related
   - NEEDS_CONTEXT → provide context, re-dispatch that item alone
   - BLOCKED → surface to user; don't integrate other items until blocker is assessed

### Step 5 — Log completion

```
<timestamp> [handoff] <N> agents returned — integrated: <labels> | blocked: <labels if any>
```

## Timeout behavior

If a dispatched subagent has not returned after 5 minutes of wall-clock time, note it in the next response and ask the user whether to wait or abort that item.

## Context isolation invariant

Branches that see each other's output anchor each other — the whole parallelism benefit collapses. Enforce zero cross-contamination between dispatched subagents. The coordinator integrates; the workers never see each other.
