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


### Step 3 — Write handoff manifest

Before dispatching parallel subagents, write `.ambrosia/handoff-manifest.md` listing all dispatched task IDs and target files:
```markdown
# Handoff Manifest
Dispatched Tasks:
- task-<ID>: target files [<file1>, <file2>]
```

### Step 4 — Dispatch in parallel

Before issuing dispatch calls, post the chat-visible parallel dispatch ping to announce all dispatched tasks:
```
Dispatching <N> agents in parallel:
  -> <item-1-label>: <one-line description>
  -> <item-2-label>: <one-line description>
  ...
Waiting for all to return...
```

Issue ALL dispatch calls in this single response turn. Any parallel invocation originating from skills (such as build, debug, or verify) relies on this centralized dispatch ping.

Each subagent:
- Starts with a clean context window
- Receives only its work ticket
- Writes its full output to its report file
- Returns: status, commits made (if any), one-line result summary, concerns

### Step 5 — Integrate

After all subagents return:

1. **Read each report file.** Don't trust the one-line summary alone for integration decisions.
1a. **Canonical empty-report policy.** If any report file is missing, empty (0 bytes), or whitespace-only, the subagent output is always treated as BLOCKED requiring explicit resolution, regardless of any status reported elsewhere. Do not integrate its changes. Surface to user: "Subagent <label> returned empty output — treating as BLOCKED."
2. **Conflict check.** Verify the changes don't conflict: overlapping lines, contradictory interfaces, incompatible assumptions. If conflict found: surface to user before merging anything.
3. **Run the full test suite.** Evidence before integration claims.
4. **Handle statuses:**
   - DONE -> integrate
   - DONE_WITH_CONCERNS -> read concerns before integrating; address if correctness-related
   - NEEDS_CONTEXT -> provide context, re-dispatch that item alone
   - BLOCKED -> surface to user; don't integrate other items until blocker is assessed
5. **Clean up manifest.** Delete `.ambrosia/handoff-manifest.md` upon successful integration of all subagent results.

### Step 6 — Log completion

```
<timestamp> [handoff] <N> agents returned — integrated: <labels> | blocked: <labels if any>
```

## Timeout behavior

Agent harnesses cannot pause mid-turn to poll a wall clock. If a dispatched subagent has not returned by the time the coordinator's next response begins: note it and ask the user — "Subagent <label> has not returned. Wait, or abort and re-dispatch?" Do not auto-continue past a missing result.

## Context isolation invariant

Branches that see each other's output anchor each other — the whole parallelism benefit collapses. Enforce zero cross-contamination between dispatched subagents. The coordinator integrates; the workers never see each other.
