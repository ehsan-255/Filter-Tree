# ftree v2.0 - Comprehensive Brainstorming

**Date**: 2026-01-21
**Vision**: Make ftree the essential bridge between humans and AI agents in development workflows

## Executive Summary

ftree started as a config-driven file-tree generator. The next evolution transforms it into **the context intelligence layer** for AI-driven development - solving the industry's #1 problem: context precision over volume.

**Core Insight**: AI agents fail in large codebases not because of small context windows, but because they get the WRONG context. ftree v2 becomes the intelligence layer that gives AI agents exactly what they need, remembers what matters, and keeps codebases clean.

---

## Research Findings: 2026 AI-Driven SDLC Pain Points

Based on industry research ([The New Stack](https://thenewstack.io/5-key-trends-shaping-agentic-development-in-2026/), [QCon AI](https://www.infoq.com/news/2025/12/ai-in-sdlc-webster/), [Faros AI](https://www.faros.ai/blog/best-ai-coding-agents-2026)):

### Critical Problems

1. **Context Precision Crisis**: "Context windows are RAM, not hard drives" - Karpathy. Agents drown in irrelevant files
2. **Large Codebase Failure**: AI agents make developers LESS productive in established codebases
3. **Session Amnesia**: Agents forget everything between sessions, developers repeat context setup endlessly
4. **Code Quality Degradation**: AI acts as "amplifier" - faster velocity but increased instability and complexity
5. **Messy Codebases**: Duplicates, unnecessary code, excessive comments pile up from AI-generated code
6. **Review Bottlenecks**: PRs 25x larger in additions than deletions, taking 4-13 hours to merge
7. **Context Engineering Fatigue**: Too many rules files, memory files, configs just to make AI work

### What's Missing

- Intelligent context selection (not just filtering)
- Persistent memory across AI sessions
- Codebase health monitoring for AI-generated mess
- Semantic understanding of code relationships
- Smart change impact analysis

---

## ftree v2.0 Feature Domains

### 1. SMART CONTEXT ENGINE

**Problem**: AI agents get too much irrelevant context or miss critical files

#### 1.1 Semantic Context Selection

- **Dependency-aware filtering**: Include files based on import/require relationships
- **Change impact radius**: Show only files affected by proposed changes
- **Hot path detection**: Identify frequently-changed files together
- **Test-to-source mapping**: Automatically include relevant tests with source files

#### 1.2 Context Budgeting

- **Token estimation**: Show token count for filtered tree (for GPT-4, Claude, etc.)
- **Smart truncation**: When over budget, intelligently drop least-relevant files
- **Context compression**: Summary mode - show file signatures instead of full content
- **Chunking strategies**: Split large contexts into coherent, related chunks

#### 1.3 AI-Optimized Presets

```yaml
presets:
  ai-feature-add:
    description: 'Context for adding a new feature'
    includes:
      - source files matching feature name
      - related tests
      - API/interface definitions
      - README/docs mentioning feature
    maxTokens: 50000

  ai-bug-fix:
    description: 'Context for fixing a bug'
    includes:
      - error stack trace files
      - files in call chain
      - related tests
      - recent changes to these files
    prioritize: recently-modified

  ai-refactor:
    description: 'Safe refactoring context'
    includes:
      - files to refactor
      - all dependents
      - all tests
    validation: ensure-no-broken-deps
```

---

### 2. AI MEMORY LAYER

**Problem**: AI agents forget between sessions, developers waste time re-explaining

#### 2.1 Project Memory Files

- **`.ftree/memory.json`**: Persistent facts about the project
  - Architecture decisions
  - Code ownership (who wrote what)
  - Deprecated patterns to avoid
  - Preferred libraries/approaches
  - Known issues/workarounds

#### 2.2 Interaction History

- **`.ftree/interactions.jsonl`**: Log of AI interactions
  - What was asked
  - What context was provided
  - What changes were made
  - Outcome (success/failure)
- **Learning from history**: Suggest context based on similar past tasks

#### 2.3 Context Recipes

- **Auto-save successful context selections**: "This worked before"
- **Share recipes team-wide**: Export/import successful patterns
- **Smart suggestions**: "Last time you fixed auth, you needed these 8 files"

---

### 3. CODEBASE HEALTH MONITOR

**Problem**: AI-generated code creates mess - duplicates, bloat, complexity

#### 3.1 AI-Generated Code Detection

- **Signature patterns**: Detect common AI coding patterns
- **Quality metrics**: Track complexity, duplication in AI-touched files
- **Velocity vs quality dashboard**: Show if AI is helping or hurting

#### 3.2 Duplicate Detection

- **Semantic duplicates**: Find similar code blocks (not just exact matches)
- **Consolidation suggestions**: "These 3 files do the same thing"
- **Refactor opportunities**: Highlight DRY violations

#### 3.3 Bloat Tracking

- **Unused code detection**: Dead functions, unused imports
- **Comment noise**: Excessive or redundant comments
- **Over-engineering alerts**: Unnecessarily complex patterns
- **File growth monitoring**: Track files growing too fast

#### 3.4 Health Presets

```yaml
presets:
  health-check:
    description: 'Show codebase health issues'
    analysis:
      - duplicates
      - unused-exports
      - excessive-comments
      - growing-too-fast
    output: health-report

  ai-impact:
    description: 'Show AI-touched code quality'
    filter: ai-generated
    metrics:
      - complexity-trend
      - duplication-rate
      - test-coverage
```

---

### 4. REVIEW INTELLIGENCE

**Problem**: PRs too large, hard to review, miss important changes

#### 4.1 Smart Diff Context

- **Change impact tree**: Show which files are truly affected
- **Dependency cascade**: Visualize how changes ripple through codebase
- **Risk scoring**: Highlight high-risk changes (core logic, no tests, etc.)

#### 4.2 Review Presets

```yaml
presets:
  pr-review:
    description: 'Optimized PR review context'
    includes:
      - changed files
      - files importing changed files
      - tests for changed files
    exclude:
      - generated files
      - lock files
      - trivial changes (formatting, comments only)
    annotations:
      - risk-level
      - test-coverage
      - complexity-delta

  breaking-changes:
    description: 'Find potential breaking changes'
    filter: public-api-changes
    analysis: dependency-impact
```

#### 4.3 AI Review Assistant

- **Summarize PR**: Generate human-readable summary of changes
- **Review checklist**: Suggest what reviewers should check
- **Related PRs**: Find similar past changes for context

---

### 5. TASK MANAGEMENT SYSTEM

**Problem**: AI agents need structured task context, humans need visibility

#### 5.1 Task File Format

```yaml
# .ftree/tasks/feature-auth.yaml
task:
  id: AUTH-001
  title: 'Implement OAuth2 authentication'
  status: in-progress
  priority: high

context:
  files:
    - src/auth/**
    - tests/auth/**
    - docs/authentication.md
  preset: ai-feature-add

subtasks:
  - name: 'Create OAuth2 provider interface'
    status: completed
    files: [src/auth/provider.ts]

  - name: 'Implement Google OAuth'
    status: in-progress
    files: [src/auth/google.ts]

  - name: 'Add tests'
    status: pending
    files: [tests/auth/google.test.ts]

ai_context:
  instructions: 'Follow OAuth2 RFC 6749. Use existing session management.'
  constraints: 'Must work with current JWT token system'
  examples: 'See src/auth/basic-auth.ts for pattern'
```

#### 5.2 Task Commands

```bash
# CLI
ftree task create "Implement OAuth2"
ftree task show AUTH-001
ftree task context AUTH-001  # Generate context for AI
ftree task complete AUTH-001

# VS Code
Right-click → "Create ftree Task"
Status bar shows active task
Code Lens "📋 View Task Context"
```

#### 5.3 AI Agent Integration

- **Task-aware context**: AI reads task file to understand goals
- **Progress tracking**: AI updates task as work progresses
- **Handoff support**: New AI session resumes from task state

---

### 6. TODO MANAGEMENT

**Problem**: TODOs scattered, forgotten, no context for fixing them

#### 6.1 TODO Discovery & Tracking

```bash
# Scan codebase for TODOs
ftree todo scan

# Output: .ftree/todos.json
{
  "todos": [
    {
      "id": "TODO-001",
      "file": "src/auth/google.ts",
      "line": 42,
      "text": "TODO: Add retry logic",
      "priority": "medium",
      "context": "OAuth2 token refresh",
      "relatedFiles": ["src/auth/provider.ts"],
      "createdDate": "2026-01-15"
    }
  ]
}
```

#### 6.2 TODO Context Generation

```bash
# Generate AI context for fixing a TODO
ftree todo context TODO-001

# Outputs:
# - The file with the TODO
# - Related files (imports, dependents)
# - Recent changes to this area
# - Similar resolved TODOs
```

#### 6.3 TODO Commands

```bash
ftree todo scan              # Find all TODOs
ftree todo list              # Show active TODOs
ftree todo context <id>      # Get AI context for TODO
ftree todo resolve <id>      # Mark as resolved
ftree todo report            # Generate TODO report (grouped by priority, age, owner)
```

---

### 7. RIGHT-CLICK INTEGRATION (VS Code)

**Problem**: Too much friction to use ftree, needs to be instant

#### 7.1 Context Menu Actions

**File/Folder Right-Click**:

- "📋 Copy ftree Context" → Copies filtered tree to clipboard
- "🔍 Show in ftree" → Opens ftree panel focused on selection
- "🎯 Create Task from Selection" → Creates task with selected files
- "📝 Generate TODO Report" → Scans selection for TODOs

**Editor Right-Click**:

- "📦 Show Context for This Function" → Shows files related to selected code
- "🔗 Find Dependencies" → Shows what imports/uses this code
- "🧪 Include Related Tests" → Adds test files to context

#### 7.2 Quick Context Actions

```typescript
// Right-click on folder → "Quick Context Menu"
- 🚀 "For AI Bug Fix"
- ⭐ "For AI Feature Add"
- 🔨 "For AI Refactor"
- 📊 "Health Check"
- 👀 "For Code Review"
```

---

### 8. PRESET LIBRARY EXPANSION

#### 8.1 Essential Presets

```yaml
# Development
ai-setup:
  description: 'Help AI understand new project'
  includes: [README*, CONTRIBUTING*, package.json, requirements.txt, Dockerfile, .env.example]

onboarding:
  description: 'New developer orientation'
  includes: [docs/**, ARCHITECTURE.md, main source entry points]

# Debugging
error-context:
  description: 'Context for debugging an error'
  includes:
    - file where error occurs
    - call stack files
    - recent commits to these files
  dynamic: true

stack-trace:
  description: 'From stack trace to source'
  input: stack-trace.txt
  includes: files-in-stack-trace

# Code Review
security-review:
  description: 'Security-sensitive files'
  includes: [auth/**, api/**, middleware/**, config/**]
  highlights: [passwords, tokens, secrets, eval, exec]

performance-review:
  description: 'Performance-critical code'
  includes: [database queries, loops, API calls]
  metrics: [complexity, query-count]

# Documentation
doc-sync:
  description: 'Keep docs in sync with code'
  includes:
    - changed source files
    - docs mentioning those files
  validation: docs-up-to-date

api-docs:
  description: 'API documentation context'
  includes: [routes/**, controllers/**, API comments]
  format: openapi-compatible

# Testing
test-coverage:
  description: 'Files missing tests'
  includes: source files without corresponding tests
  analysis: coverage-gaps

flaky-tests:
  description: 'Tests that fail intermittently'
  includes: tests with history of failures
  metrics: failure-rate

# Maintenance
tech-debt:
  description: 'Technical debt hot spots'
  analysis: [high-complexity, many-TODOs, frequent-bugs]
  sortBy: debt-score-desc

dependency-upgrade:
  description: 'Files affected by dependency upgrade'
  input: package-name
  includes: files-importing-package
```

#### 8.2 Framework-Specific Presets

```yaml
# React
react-component:
  extensions: [tsx, jsx]
  includes: [components/**, hooks/**, contexts/**]

# Node.js/Express
express-api:
  includes: [routes/**, controllers/**, middleware/**]

# Python/Django
django-view:
  includes: [views.py, models.py, serializers.py, urls.py]

# Database
db-migration:
  includes: [migrations/**, models/**, schema.**]
```

---

### 9. PHYSICAL FOLDER TREE GENERATION

**Problem**: Need to CREATE folder structures, not just view them

#### 9.1 Template-Based Generation

```yaml
# templates/microservice.yaml
template:
  name: microservice
  description: 'Generate microservice folder structure'

structure:
  src/:
    - index.ts
    - config/
      - database.ts
      - redis.ts
    - routes/
      - index.ts
    - controllers/
    - models/
    - middleware/
    - utils/
  tests/:
    - unit/
    - integration/
  docs/:
    - API.md
    - SETUP.md
  - Dockerfile
  - docker-compose.yml
  - .env.example
  - README.md

variables:
  serviceName: prompt
  port: prompt
  database: choice(postgres, mysql, mongodb)
```

#### 9.2 Generation Commands

```bash
# CLI
ftree generate microservice --name=auth-service --port=3001
ftree generate from-preset my-template
ftree template list
ftree template create my-template

# VS Code
Right-click in Explorer → "Generate Structure from Template"
Command Palette → "ftree: Generate Project Structure"
```

#### 9.3 Smart Generation

- **Analyze existing projects**: Learn structure from successful repos
- **Best practices**: Generate with linting, testing, CI/CD pre-configured
- **Framework detection**: Auto-generate appropriate structure for detected framework

---

### 10. CLI IMPROVEMENTS FOR AI AGENTS

#### 10.1 Machine-Readable Output

```bash
# JSON output for AI parsing
ftree run source --format=json
ftree task show AUTH-001 --format=json
ftree todo list --format=json

# Structured output
{
  "preset": "source",
  "stats": {
    "fileCount": 42,
    "totalSize": "150KB",
    "tokenEstimate": 45000
  },
  "tree": [...],
  "files": [
    {
      "path": "src/index.ts",
      "size": "2.5KB",
      "tokens": 350,
      "importance": "high",
      "dependencies": ["src/config.ts", "src/routes/index.ts"]
    }
  ]
}
```

#### 10.2 AI-Friendly Commands

```bash
# Context for specific task
ftree ai-context --task="fix authentication bug" --budget=50000

# Smart context selection
ftree ai-context --purpose=feature-add --feature=oauth

# Memory integration
ftree ai-remember "Use bcrypt for password hashing, not MD5"
ftree ai-recall "password hashing"

# Change impact
ftree ai-impact --file=src/auth/provider.ts
```

#### 10.3 Scripting & Integration

```bash
# Pipe-friendly
ftree run source --format=json | jq '.files[].path'

# Exit codes for CI/CD
ftree health-check --fail-on=duplicates,complexity
echo $?  # 0 = pass, 1 = fail

# GitHub Actions integration
- name: Check codebase health
  run: |
    ftree health-check --format=github-annotations
    ftree ai-impact --since=HEAD~1 --format=pr-comment
```

---

### 11. VS CODE IMPROVEMENTS FOR HUMANS

#### 11.1 Enhanced UI

- **ftree Panel**: Dedicated sidebar panel (like Explorer)
  - Live filtering
  - Drag files to create custom contexts
  - Save custom views
  - Token counter live updates

- **Status Bar Integration**:
  - Show active task
  - Show current context size
  - Quick preset switcher

- **Tree View Enhancements**:
  - File importance indicators (🔥 hot file, 🧪 test, 📄 doc)
  - Inline metrics (complexity, size, last modified)
  - Color-coding by risk/importance

#### 11.2 Interactive Features

```typescript
// Hover over file in ftree panel
Shows:
- Token count
- Dependencies (imports/exports)
- Related files
- Recent changes
- "Add to context" button

// Multi-select in ftree panel
Select multiple files → Right-click → "Create Context Preset"

// Drag-and-drop
Drag files from Explorer to ftree panel → Auto-creates filtered view
```

#### 11.3 Smart Notifications

```typescript
// Context awareness
"You're editing auth.ts. Related files not in view: [auth.test.ts, provider.ts]";
'This file was flagged in last health check: High complexity';

// Proactive suggestions
"You've opened 5 authentication files. Use preset 'auth-feature'?";
"PR ready? Run 'pr-review' preset to check completeness";
```

#### 11.4 Workspace Integration

- **Settings Sync**: ftree configs sync with VS Code settings sync
- **Multi-root Support**: Different ftree configs per workspace folder
- **Remote Development**: Works with Remote SSH, Containers, WSL

---

### 12. ADVANCED FEATURES

#### 12.1 AI Training Data Generation

```bash
# Generate training data for custom AI models
ftree generate-training-set --task=bug-fixes --samples=1000

# Output: pairs of (context → solution) for fine-tuning
```

#### 12.2 Collaboration Features

```yaml
# Shared team context recipes
.ftree/team-presets.yaml

# Context for pair programming
ftree collab start
# Generates: optimal context for two developers working together

# Context for handoff
ftree handoff create --to=jane@example.com
# Packages: current task, context, progress notes
```

#### 12.3 Analytics & Insights

```bash
# Context usage analytics
ftree analytics context-usage
# Shows: most-used presets, token consumption, success rates

# AI effectiveness metrics
ftree analytics ai-impact
# Shows: velocity change, quality metrics, cost per feature

# Team patterns
ftree analytics team
# Shows: common context patterns, bottlenecks, collaboration metrics
```

#### 12.4 Integration Ecosystem

- **IDE Plugins**: JetBrains, Sublime Text, Vim/Neovim
- **AI Tools**: Claude, ChatGPT, GitHub Copilot, Cursor integration
- **CI/CD**: GitHub Actions, GitLab CI, Jenkins plugins
- **Project Management**: Jira, Linear, GitHub Issues integration
- **Documentation**: Auto-update docs based on context changes

---

## Implementation Priority Matrix

### Phase 1: Core Foundation (v2.0)

**Must-Haves**:

1. Right-click integration (VS Code)
2. AI-optimized presets (ai-feature-add, ai-bug-fix, ai-refactor)
3. Token estimation & budgeting
4. Machine-readable JSON output
5. Preset library expansion (20+ essential presets)

**Impact**: Makes ftree 10x easier to use, immediately valuable for AI agents

### Phase 2: Intelligence Layer (v2.1)

**High-Value**:

1. Dependency-aware filtering
2. Project memory files (.ftree/memory.json)
3. Change impact analysis
4. Smart context suggestions
5. TODO discovery & management

**Impact**: Transforms ftree from filter to intelligence layer

### Phase 3: Quality & Health (v2.2)

**Quality Focus**:

1. Codebase health monitoring
2. Duplicate detection
3. AI-generated code tracking
4. Health check presets
5. Review intelligence

**Impact**: Keeps codebases clean as AI usage increases

### Phase 4: Collaboration (v2.3)

**Team Features**:

1. Task management system
2. Context recipes sharing
3. Interaction history
4. Team analytics
5. Handoff support

**Impact**: Makes ftree valuable for teams, not just individuals

### Phase 5: Ecosystem (v3.0)

**Scale Features**:

1. Physical folder generation
2. AI training data generation
3. Multi-IDE support
4. External integrations (Jira, Linear, etc.)
5. Enterprise features (SSO, audit logs, etc.)

**Impact**: ftree becomes platform, not just tool

---

## Technical Architecture Changes

### New Components

```
ftree-v2/
├── packages/
│   ├── cli/                  # Existing CLI
│   ├── vscode/               # Existing VS Code extension
│   ├── core/                 # NEW: Shared core logic
│   │   ├── context-engine/   # Smart context selection
│   │   ├── memory/           # Persistent memory layer
│   │   ├── analysis/         # Code analysis (health, duplicates)
│   │   └── intelligence/     # ML/heuristics for suggestions
│   ├── templates/            # NEW: Folder generation templates
│   ├── tasks/                # NEW: Task management
│   └── integrations/         # NEW: External tool integrations
├── schemas/
│   ├── ftree.schema.json     # Existing config schema
│   ├── task.schema.json      # NEW: Task schema
│   ├── memory.schema.json    # NEW: Memory schema
│   └── template.schema.json  # NEW: Template schema
└── .ftree/                   # NEW: Project-level ftree data
    ├── memory.json           # Project memory
    ├── interactions.jsonl    # Interaction history
    ├── tasks/                # Active tasks
    └── todos.json            # Discovered TODOs
```

### Key Design Decisions

1. **Monorepo stays**: npm workspaces work well
2. **Shared core package**: Extract common logic for reuse across CLI and extensions
3. **Plugin architecture**: Enable community extensions
4. **Local-first data**: `.ftree/` directory for project-specific data (gitignore by default)
5. **Backward compatibility**: v1 configs must work in v2

---

## Success Metrics

### Adoption Metrics

- NPM downloads (target: 10K/month → 100K/month)
- VS Code extension installs (target: 1K → 50K)
- GitHub stars (target: 500 → 10K)

### Usage Metrics

- Presets per project (target: >3)
- Daily active users
- Context generations per day
- Token savings (vs. naive "send everything")

### Quality Metrics

- Codebase health score improvements
- PR review time reduction
- AI-generated code quality (measured by static analysis)
- Duplicate code reduction

### Business Metrics

- Premium features (teams, enterprise)
- Integration partnerships (AI tool vendors)
- Community contributions (presets, plugins)

---

## Business Model (Future)

### Free Tier (Current)

- All core features
- Unlimited local use
- Community presets
- Open source

### Pro Tier ($10/month)

- Cloud sync (contexts, memory, tasks)
- Advanced analytics
- Priority support
- Team collaboration features
- Private preset sharing

### Enterprise Tier ($100/user/year)

- SSO/SAML
- Audit logs
- Custom integrations
- On-premise deployment
- SLA support
- Training & onboarding

---

## Risks & Mitigations

### Risk 1: Complexity Creep

**Risk**: Too many features make ftree hard to use
**Mitigation**:

- Keep CLI simple by default
- Advanced features opt-in
- Progressive disclosure in UI
- Preset library makes complexity accessible

### Risk 2: Performance

**Risk**: Analysis/intelligence features slow on large codebases
**Mitigation**:

- Incremental analysis (cache results)
- Background workers
- Opt-in expensive features
- Sampling for very large repos

### Risk 3: Competition

**Risk**: AI tools build similar features
**Mitigation**:

- Open source = community moat
- Deep integrations (become indispensable)
- Fastest iteration speed
- Best UX (humans love it)

### Risk 4: AI Tools Evolve

**Risk**: Future AI models don't need context help
**Mitigation**:

- Diversify value: health monitoring, tasks, TODOs standalone
- Human-AI bridge always valuable (trust, control, cost)
- Pivot to "AI-native development tools" if needed

---

## Next Steps

### Immediate Actions

1. **User validation**: Share this doc with 5-10 developers using AI agents daily
2. **Prototype**: Build right-click integration + 3 AI presets (can ship in 1 week)
3. **Measure**: Add telemetry to understand which features matter most
4. **Community**: Share vision on Twitter, Reddit, HN to gauge interest

### Experimentation

1. **A/B test**: Does "smart context" improve AI output quality?
2. **Beta program**: Invite 20 heavy AI agent users to test v2 features
3. **Integration POC**: Partner with one AI tool (Claude, Cursor) for deep integration

### Documentation

1. Write "AI-Native Development with ftree" guide
2. Create video demos of each major feature
3. Build preset gallery website (browse, search, contribute presets)
4. Write case studies: "How ftree cut our AI context costs by 84%"

---

## Vision for 2027

By end of 2027, ftree should be:

- **The standard** for AI-human development workflows
- **Installed by default** in AI-native development environments
- **The bridge** that makes large codebases accessible to AI agents
- **The memory** that makes AI agents actually useful long-term
- **The quality gate** that keeps AI-generated code from becoming technical debt

**Aspiration**: "Using AI without ftree" should feel as awkward as "using Git without a .gitignore"

---

## Sources & Research

- [The New Stack: 5 Key Trends Shaping Agentic Development in 2026](https://thenewstack.io/5-key-trends-shaping-agentic-development-in-2026/)
- [QCon AI: How AI is Breaking the SDLC](https://www.infoq.com/news/2025/12/ai-in-sdlc-webster/)
- [Faros AI: Best AI Coding Agents for 2026](https://www.faros.ai/blog/best-ai-coding-agents-2026)
- [DEV: MCP and AI-Assisted Coding Predictions](https://dev.to/blackgirlbytes/my-predictions-for-mcp-and-ai-assisted-coding-in-2026-16bm)
- [The Real Struggle with AI Coding Agents](https://www.smiansh.com/blogs/the-real-struggle-with-ai-coding-agents-and-how-to-overcome-it/)
- [Research.ai: 12 Reasons AI Agents Still Aren't Ready](https://research.aimultiple.com/ai-agents-expectations-vs-reality/)
- [Composio: Why AI Agent Pilots Fail](https://composio.dev/blog/why-ai-agent-pilots-fail-2026-integration-roadmap)

---

**End of Brainstorming Document**
