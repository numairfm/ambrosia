# Ambrosia

A self-contained, high-performance AI coding skill suite. Built for context-rot resistance, maximum execution speed, and token efficiency without compromising code quality.

Works natively across **Antigravity**, **Claude Code**, **OpenCode**, **Cursor**, **Codex**, **Gemini CLI**, **Copilot CLI**, and any harness supporting `SKILL.md` files or plugin hooks.

---

## Skill Index

| Skill | Type | What it does |
|---|---|---|
| `using-ambrosia` | Bootstrap | Suite introduction, standing behavioral orders (ADHD, Ponytail, Web Grounding), and mode routing |
| `orient` | Tool | Maps codebase architecture, entry points, and fragile zones |
| `audit` | Tool | Refines raw task prompts, formulates default assumptions, and identifies parallel safety |
| `plan` | Spine | Decomposes tasks into file-mapped implementation plans (with fast-path inline research for ≤3 files) |
| `build` | Spine | Executes plans via TDD using isolated subagents with mandatory independent task review |
| `verify` | Spine | Empirical verification gate with line-by-line requirement tracing (`file:line`) |
| `debug` | Tool | Systematic 4-phase root-cause debugging with early divergence escalation |
| `diverge` | Tool | Multi-frame architectural, UX, and naming ideation (Lite 3-option vs Full 5-frame matrix) |
| `handoff` | System | Concurrent subagent dispatch mechanism (model-invoked) |
| `review` | Tool | Standalone code review for any diff or commit range |
| `trim` | Tool | Audits & strips over-engineering (`yagni`, `stdlib`, `native`, `delete`, `shrink`) |
| `debt` | Tool | Harvests and tracks `// ponytail:` technical debt markers into a ledger |
| `wrap-up` | Spine | Closes out branches cleanly: merge locally, create PR, park, or rollback |

---

## Standard Pipeline

```
[orient] → audit → plan → build → verify → [debug] → [trim] → wrap-up
```

*Direct Execution:* Questions, single-file bugfixes, or small edits bypass the pipeline and execute directly.

---

## Multi-Harness Installation

Ambrosia features automatic `SessionStart` context injection and cross-harness hook support.

### Antigravity CLI
```bash
agy plugin install https://github.com/numairfm/ambrosia
```

### Claude Code
```bash
/plugin install numairfm/ambrosia
```

### OpenCode.ai
Add Ambrosia to `opencode.json`:
```json
{
  "plugin": ["ambrosia@git+https://github.com/numairfm/ambrosia.git"]
}
```

### Cursor Agent
```text
/add-plugin https://github.com/numairfm/ambrosia
```

### Gemini CLI
```bash
gemini extensions install https://github.com/numairfm/ambrosia
```

---

## Key Differentiators

- **Context Rot Resistance:** Isolated subagent contexts per task + append-only `ambrosia.log.md` + coordinator compression every 3 tasks.
- **Real Parallelism:** Same-turn concurrent subagent dispatch via `handoff`.
- **Always-On Ponytail Leanness:** YAGNI by default, native stdlib/platform prioritization, and `// ponytail:` debt tracking.
- **Fast-Path & Precision:** Fast-path inline research for small plans paired with Superpowers-grade independent code reviews and line-by-line verification.
- **Clean Workspace Isolation:** All state, specs, and plans reside in `.ambrosia/` — zero project structure pollution.

---

## Inspired By

- [obra/superpowers](https://github.com/obra/superpowers) — methodology backbone & multi-agent hook structure
- [UditAkhourii/adhd](https://github.com/uditakhourii/adhd) — diverge skill base
- [open-gsd/gsd-core](https://github.com/open-gsd/gsd-core) — context-rot mechanisms
- [mattpocock/skills](https://github.com/mattpocock/skills) — user/model invocation split
- [safishamsi/ponytail](https://github.com/safishamsi/ponytail) — trim and debt skills

---

## License

MIT
