# Ambrosia v2 — System Architecture

```text
                                      USER
                                        │
                                        ▼
                            ┌────────────────────┐
                            │    ORCHESTRATOR    │
                            │ (Main Chat / Brain)│
                            └────────────────────┘
                                        │
                                        ▼
══════════════════════════════════════════════════════════════════════════════
                          CORE LIFECYCLE (Always)
══════════════════════════════════════════════════════════════════════════════

             Analyze (Intent, orientation scan, success criteria, risk)
                 │
                 ▼
             Plan (File-mapped tasks, upfront YAGNI, phase splits)
                 │
                 ▼
             Implement (TDD loops via Worker subagents)
                 │
                 ▼
             Verify (Iron law evidence check: tests + line-level tracing)
                 │
                 ▼
             Finish (Debt ledger, security scan, git options, lessons)
                 │
                 ▼
               DONE

══════════════════════════════════════════════════════════════════════════════
                     EVENT-DRIVEN CAPABILITIES (Optional)
══════════════════════════════════════════════════════════════════════════════

      Analyze ──► Diverge (Architectural ideation / 2-3 paths)
    Implement ──► Debug   (4-phase root cause diagnosis on failure)
       Verify ──► Review  (Spec compliance, security, runtime correctness)
    Any Stage ──► Checkpoint (Pause/resume, context snapshot, state persistence)

══════════════════════════════════════════════════════════════════════════════
                    INTERNAL DISPATCH MECHANISM (System)
══════════════════════════════════════════════════════════════════════════════
    Orchestrator ──[dispatch_worker]──► Workers (with empty-report BLOCKED guard)
```
