---
name: diverge
description: Event-driven capability of Ambrosia v2 implementing Udit Akhouri's ADHD architecture (Parallel Divergent Ideation for Coding Agents). Mitigates premature convergence by fanning out N isolated cognitive frames with zero shared context, running a separate Critic Pass for trap hunting, and deepening top survivors. Trigger on open-ended design, naming, API surface choices, or fuzzy debugging.
---

# Diverge (ADHD Engine)

`Diverge` implements Udit Akhouri's **ADHD architecture** (*Parallel Divergent Ideation for Coding Agents*). Its job is to answer one question:

> **"How do we break premature convergence and linear model anchoring by spawning isolated cognitive frames, hunting premature traps, and deepening top non-obvious survivors before committing to a plan?"**

`Diverge` treats premature convergence as an architectural problem, not a prompting one. Autoregressive Chain-of-Thought anchors on whatever it states first. `Diverge` solves this by fanning out $N$ parallel sub-processes under deliberately distorted **Cognitive Frames** with zero shared context, followed by a separate **Critic Pass** that scores ideas, hunts traps, and deepens top survivors.

---

## Operational Workflow

Execute `Diverge` through five sequential steps:

### 1. Self-Judge Gate & Tier Check
Before fanning out, evaluate if the prompt warrants divergence:
- **Gate Check:** Is the prompt open-ended, high-stakes, or asking *"give me a few ways to..."*? If NO (syntax lookup, closed bug fix with known root cause), abort `Diverge` and answer directly.
- **Select Tier:**
  - **Lite-Diverge (Default):** 3 cognitive frames. Fast, low context bloat.
  - **Full-Diverge (`diverge full`):** 6 cognitive frames. Deep architectural ideation.

### 2. Parallel Frame Fan-Out (Zero Shared Context)
Spawn $N$ isolated reasoning sub-processes under distinct **Cognitive Frames**. Each frame views the problem through a distorted lens without seeing the other frames' outputs:
- **`regulator`:** Unhandled failure modes, security boundaries, rate limits, input validation.
- **`compiler`:** Hidden state mutations, circular coupling, unsafe type boundaries.
- **`archaeologist`:** Buried assumptions, legacy technical debt, brittle dependencies.
- **`hardware-scale`:** Memory leaks, performance bottlenecks, unneeded overhead.
- **`oncall-engineer`:** 3 AM observability, fault isolation, graceful degradation, circuit breakers.
- **`minimalist-refactorer`:** Zero-dependency stdlib solutions, YAGNI cuts, deleting code.

### 3. Critic Pass & Trap Hunting
In a **separate critic pass** (isolated from generation), evaluate all raw frame outputs:
- **Novelty & Fit Scoring:** Score generated ideas on novelty (1-10) and viability/fit (1-10).
- **Trap Hunting:** Explicitly identify and flag **premature traps** (obvious, textbook, or flawed patterns that look attractive but fail in production) with 1-line reasons.

### 4. Cluster & Deepen Top Survivors
- Cluster raw ideas by underlying angle (e.g., control surface, perceptual, redundancy, economic).
- Select top-K non-obvious surviving ideas (high novelty + high viability).
- **Deepen:** Expand top survivors into concrete architecture sketches, detailing trade-offs, risks, and locked file boundaries.

### 5. Present & Route to Plan
Present the ADHD summary:
1. **Traps Flagged:** Identified pitfalls with 1-line reasons.
2. **Top Non-Obvious Picks:** Top-K deepened survivors with architecture sketches.
3. **Recommended Path:** 1-turn selection prompt (`"Reply 'go' to accept recommendation [Option X], or choose [Option Y/Z]"`).

End with:
> **Next Stage:** `Plan` — proceed to generate implementation plan for selected architectural path.

---

## Standing Rules & Invariants

1. **Zero Shared Context During Divergence:** Frames MUST be generated in parallel isolation. Never allow Frame B to see Frame A's output during divergence to prevent anchoring.
2. **Separate Critic Pass:** Scoring and trap hunting MUST happen in a separate pass after all frames have generated. Never mix critique into frame generation.
3. **Zero Code Edits:** `Diverge` MUST NOT modify project source files. Implementation is executed downstream by workers via `Plan` and `Implement`.
4. **Log State:** Log cognitive frames used, traps flagged, and selected path in `.ambrosia/logs/ambrosia.log.md`.

---

## Output Contract & Handoff

Produce a structured ADHD report covering:

1. **Gate Status & Tier:** `Lite-Diverge` (3 frames) or `Full-Diverge` (6 frames).
2. **Traps Flagged:** List of identified premature traps with 1-line failure reasons.
3. **Clustered Ideas & Deepened Picks:** Top non-obvious survivors with architecture sketches and risk profiles.
4. **Recommendation & User Choice Prompt:** Stated recommendation with 1-turn selection prompt.

End with:
> **Next Stage:** `Plan` — proceed to generate implementation plan for selected architectural path.
