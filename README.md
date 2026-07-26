# Ambrosia

A self-contained AI coding skill suite. Open Agent Skills format — installs as one plugin across Antigravity, OpenCode, Claude Code, Codex, Cursor, and any harness that reads `SKILL.md` files.

## Skills

| Skill | What it does |
|---|---|
| `using-ambrosia` | Bootstrap, orientation, and standing behavioral orders |
| `orient` | Maps structure and patterns in unfamiliar codebases |
| `audit` | Gap-check and improve a raw prompt/idea via interactive interrogation |
| `plan` | Decompose into a file-mapped, parallel-tagged plan |
| `build` | TDD execution with fresh subagents and git checkpointing |
| `verify` | Evidence-based completion check against the plan |
| `debug` | Systematic root-cause debugging |
| `diverge` | ADHD-style parallel ideation for open-ended decisions |
| `handoff` | Same-turn concurrent subagent dispatch (model-invoked) |
| `review` | Standalone code review for any diff or file |
| `trim` | Cut over-engineering from diff or full repo |
| `debt` | Harvest ponytail: comments into a debt ledger |
| `wrap-up` | Close out a branch: merge, PR, park, or rollback |

## Standard pipeline

```
audit → plan → build → verify → [debug] → trim → wrap-up
```

## Install

Copy this repo into your agent's skills directory, or reference `plugin.json` from your agent's plugin config.

**Antigravity / OpenCode / Claude Code:**
```bash
# Copy skills to your global skills directory
cp -r skills/* ~/.gemini/skills/
```

Or install as a plugin by pointing your agent config at this directory.

## What makes it different

- **Context rot resistance** — fresh-context subagents at every phase + persistent append-only log
- **Real parallelism** — same-turn concurrent dispatch via `handoff`, not sequential workarounds  
- **YAGNI by default** — ponytail leanness baked in, not bolted on after
- **Harness-agnostic** — pure SKILL.md format, no hooks, no harness-specific glue
- **Everything contained** — all Ambrosia artifacts live in `.ambrosia/`, nothing bleeds into your project

## Inspired by

- [obra/superpowers](https://github.com/obra/superpowers) — methodology backbone
- [UditAkhourii/adhd](https://github.com/uditakhourii/adhd) — diverge skill base
- [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — context-rot mechanisms
- [mattpocock/skills](https://github.com/mattpocock/skills) — user/model invocation split
- [safishamsi/ponytail](https://github.com/safishamsi/ponytail) — trim and debt skills

## License

MIT
