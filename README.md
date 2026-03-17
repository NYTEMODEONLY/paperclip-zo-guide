# Installing Paperclip on Zo Computer — Complete Guide

> **Last updated:** March 17, 2026

A complete guide to installing [Paperclip](https://github.com/paperclipai/paperclip) on your [Zo Computer](https://zo.computer) — from zero to a fully-orchestrated AI agent company. If OpenClaw is an employee, Paperclip is the company.

> **📖 Live version:** [nytemode.zo.space/paperclip-zo-guide](https://nytemode.zo.space/paperclip-zo-guide)

---

## What Is Paperclip?

[Paperclip](https://github.com/paperclipai/paperclip) is open-source orchestration for AI agent companies. It's the layer above individual agents — the company they work for. While tools like OpenClaw, Claude Code, and Codex are individual employees, Paperclip is the organization chart, the budget, the governance framework, and the coordination layer.

It gives you:

- **Org charts** — define teams, roles, and reporting lines for your agents
- **Budgets & governance** — set spending limits, approval workflows, and guardrails
- **Goal alignment** — assign objectives that cascade through the organization
- **Agent coordination** — route tasks between agents, track progress, manage handoffs
- **Multi-agent support** — works with Claude Code, Codex, OpenClaw, Cursor, and any process-based agent

Under the hood, it's a Node.js server with a React UI and an embedded PostgreSQL database. No external database setup required — it manages its own data store.

---

## For AI Agents

> 🤖 This guide is designed to be followed step-by-step by either a human or an AI agent operating on a Zo Computer. Every command can be executed directly on the Zo server. Work through each step in order, verify each one succeeds before moving on, and you'll have a fully operational Paperclip instance with agent orchestration running.

---

## Architecture on Zo

Before diving in, here's how Paperclip runs on a Zo Computer. Understanding this will save you hours of debugging.

```
Zo Service (root) → su → postgres user
  │
  ├── Paperclip Server (Node.js, port 3101)
  │     └── React UI served at /
  │
  ├── Embedded PostgreSQL (port 54329)
  │     └── Data: ~/.paperclip/instances/default/db
  │
  └── Agent Processes (Claude Code, Codex, etc.)
        └── Run as postgres with copied credentials
        └── cwd: /home/workspace/ (writable by postgres)
```

The key insight: **everything runs as the postgres user**, not root. Zo Computers run as root by default, but PostgreSQL and Claude Code both refuse to run as root. The Zo service starts as root, then immediately switches to the postgres user via `su`.

> ℹ️ The embedded PostgreSQL runs on port 54329 (not the standard 5432) to avoid conflicts. Data lives at `/home/postgres/.paperclip/instances/default/db`.

---

## Prerequisites

You need:

- A [Zo Computer](https://zo.computer) (any tier — Node.js 22+ and pnpm 9.15+ are pre-installed)
- An AI coding agent installed — [Claude Code](https://docs.anthropic.com/en/docs/claude-code) recommended
- SSH access to your Zo Computer (or Zo's built-in shell tools)

Verify your environment:

```bash
node -v    # Should be v22+
pnpm -v    # Should be 9.15+
```

---

## Step 1: Create a Dedicated postgres User

The embedded PostgreSQL that ships with Paperclip refuses to run as root — this is a hard requirement of PostgreSQL itself. Since Zo Computers run as root by default, you need a dedicated user.

```bash
# Create a system user with a home directory
useradd -r -m -s /bin/bash postgres
```

This creates `/home/postgres` as the user's home directory. Paperclip's config and database will live here.

> ℹ️ The `-r` flag creates a system user (no aging info, lower UID). The `-m` flag ensures the home directory is created. The `-s /bin/bash` gives it a proper shell for running commands via `su`.

---

## Step 2: Clone & Build Paperclip

Clone the repository and build for production:

```bash
cd /home/workspace
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm build
```

> ⚠️ The build step is required for production. Running `pnpm dev` works for development, but for a persistent Zo service you need the compiled output. The build compiles both the server and the React UI.

Verify the build succeeded — you should see compiled output in the server and UI directories:

```bash
ls -la server/dist/    # Server build output
ls -la ui/dist/        # UI build output
```

---

## Step 3: Configure Environment (.env)

Create the environment configuration file at `/home/workspace/paperclip/.env`:

```bash
PORT=3101
SERVE_UI=true
HOST=0.0.0.0

# Database migrations
PAPERCLIP_MIGRATION_PROMPT=never
PAPERCLIP_MIGRATION_AUTO_APPLY=true

# Auth & deployment
PAPERCLIP_AUTH_DISABLE_SIGN_UP=true
PAPERCLIP_DEPLOYMENT_MODE=authenticated
PAPERCLIP_DEPLOYMENT_EXPOSURE=private
PAPERCLIP_AUTH_BASE_URL_MODE=auto

# URLs — replace YOURUSERNAME with your Zo username
BETTER_AUTH_BASE_URL=https://paperclip-YOURUSERNAME.zocomputer.io
PAPERCLIP_AUTH_TRUSTED_ORIGINS=https://paperclip-YOURUSERNAME.zocomputer.io
BETTER_AUTH_TRUSTED_ORIGINS=https://paperclip-YOURUSERNAME.zocomputer.io
PAPERCLIP_ALLOWED_HOSTNAMES=paperclip-YOURUSERNAME.zocomputer.io,localhost

# Auth secret — generate with: openssl rand -hex 32
BETTER_AUTH_SECRET=your_64_char_hex_secret_here
```

Generate the auth secret:

```bash
openssl rand -hex 32
```

Copy the output and replace `your_64_char_hex_secret_here` in the .env file.

### What each setting does

| Setting | Purpose |
|---------|---------|
| `PORT=3101` | Paperclip's default HTTP port. The Zo service maps this to HTTPS automatically. |
| `SERVE_UI=true` | Serves the React dashboard from the same server. |
| `HOST=0.0.0.0` | Listen on all interfaces (required for Zo's reverse proxy). |
| `PAPERCLIP_MIGRATION_AUTO_APPLY=true` | Automatically applies database migrations on startup. |
| `PAPERCLIP_AUTH_DISABLE_SIGN_UP=true` | Disables public registration after you create your admin account. |
| `PAPERCLIP_DEPLOYMENT_MODE=authenticated` | Requires login to access the dashboard. |
| `BETTER_AUTH_SECRET` | Used for signing session tokens. Must be a random 64-char hex string. |

> ⚠️ Replace `YOURUSERNAME` with your actual Zo username in all four URL fields. These must match exactly or you'll get CORS/auth errors in the dashboard.

---

## Step 4: Run Initial Onboard as postgres

The onboard command initializes Paperclip's config and creates the embedded PostgreSQL data directory. It must run as the postgres user:

```bash
su -s /bin/bash postgres -c 'HOME=/home/postgres npx paperclipai onboard --yes'
```

This creates the configuration at:

```
/home/postgres/.paperclip/instances/default/config.json
```

After onboarding, verify the config:

```bash
# View the generated config
cat /home/postgres/.paperclip/instances/default/config.json

# Key fields to check/update:
# - database port: 54329 (default for embedded)
# - allowed hostnames: should include your Zo URL
# - server port: 3101
```

> ℹ️ The `HOME=/home/postgres` is critical. Without it, the onboard command tries to write config to `/root` (since `su` doesn't change HOME by default with `-s`), and the postgres user can't write there.

---

## Step 5: Create a Zo Service

This is the most important step. **Zo services survive platform restarts** — unlike manual supervisor configurations or nohup processes, which get wiped when Zo reprovisions your container.

Register Paperclip as a persistent Zo service:

```bash
mcporter call zo.register_user_service \
  label=paperclip \
  protocol=http \
  local_port=3101 \
  entrypoint="su -s /bin/bash postgres -c 'set -a; . /home/workspace/paperclip/.env; set +a; HOME=/home/postgres /home/workspace/paperclip/server/node_modules/.bin/tsx /home/workspace/paperclip/server/src/index.ts'" \
  workdir=/home/workspace/paperclip
```

### Breaking down the entrypoint

The entrypoint command is doing several things:

1. `su -s /bin/bash postgres -c '...'` — switches from root to the postgres user
2. `set -a; . /home/workspace/paperclip/.env; set +a` — sources the .env file, exporting all variables
3. `HOME=/home/postgres` — sets the home directory so Paperclip finds its config
4. `.../tsx .../index.ts` — runs the server directly with tsx (not `pnpm dev`)

> ⚠️ Do not use `pnpm dev` for the Zo service entrypoint. That starts a development server with hot reload, which is wasteful and unstable for production. Run tsx directly against the built source.

Once registered, the Zo service automatically:

- Starts on boot
- Auto-restarts on crash
- Provides an HTTPS URL: `https://paperclip-YOURUSERNAME.zocomputer.io`
- Survives container reprovisions

Verify the service is running:

```bash
# Check service status
mcporter call zo.list_user_services

# Check the process
supervisorctl -s http://127.0.0.1:29011 status paperclip

# Check logs
tail -50 /dev/shm/paperclip.log
```

> ⚠️ **Do not manually edit `/etc/zo/supervisord-user.conf`.** Manual edits get wiped when Zo reprovisions your container (which happens periodically for maintenance). Only services registered via `register_user_service` survive reprovisions.

---

## Step 6: Set Up Claude Code Credentials

This is the step that will cost you the most debugging time if you skip it. Here's the problem:

- Zo containers have `no_new_privs` set — a security flag that prevents privilege escalation
- The Paperclip server runs as the postgres user
- The postgres user **cannot su/sudo** to any other user (because of no_new_privs)
- Claude Code needs valid credentials to run

**The fix:** give the postgres user its own Claude Code credentials by authenticating as a non-root user and copying the credential files.

### Authenticate Claude Code

```bash
# Create a temporary user if you don't have one
useradd -m -s /bin/bash zoey

# Login to Claude as that user
su - zoey -c 'claude login'
# Follow the auth URL in your browser
```

> ℹ️ You need to open the auth URL in your browser to complete the OAuth flow. The CLI will print the URL — copy it and paste it into your browser.

### Copy credentials to postgres

```bash
# Copy the credential files
cp -r /home/zoey/.claude /home/postgres/.claude
cp /home/zoey/.claude.json /home/postgres/.claude.json

# Fix ownership
chown -R postgres:postgres /home/postgres/.claude /home/postgres/.claude.json
```

### Verify it works

```bash
su -s /bin/bash postgres -c 'claude --dangerously-skip-permissions --print -p "say hello"'
# Expected output: hello
```

If you see "hello" (or similar), Claude Code is working as the postgres user. If you get auth errors, re-run `claude login` as the non-root user and copy the files again.

> ⚠️ The `--dangerously-skip-permissions` flag is for testing only. When configuring agents in the Paperclip dashboard, use proper permission settings for production workloads.

---

## Step 7: Why Not Just Run as Root?

You might be wondering: Zo Computers run everything as root. Why bother with the postgres user at all?

Two hard constraints:

1. **PostgreSQL refuses to run as root.** This is a fundamental security restriction in PostgreSQL itself — it will exit immediately if it detects root. Since Paperclip embeds PostgreSQL, the server process must be a non-root user.
2. **Claude Code refuses to run as root.** Most AI agents (Claude Code, Codex, etc.) have built-in safety checks that prevent execution as root. Even if you bypassed this, it would be a security risk.

This is why the architecture looks the way it does:

- A **postgres user** for the server and embedded database
- **Claude credentials** copied to the postgres user's home directory
- Agent **cwd set to directories postgres can write** — like `/home/workspace/`, never `/root/`

> The `no_new_privs` container flag means the postgres user can't escalate to any other user either. What runs as postgres, stays as postgres. Plan your permissions accordingly.

---

## Step 8: Access the Dashboard

Once the Zo service is running, your Paperclip dashboard is available at:

```
https://paperclip-YOURUSERNAME.zocomputer.io
```

### First-time setup

1. **Create your account** — the first user to sign up becomes the admin
2. **Set up your first company** — this is the organizational container for your agents
3. **Create agents** — use the `claude_local` adapter for Claude Code agents running on the same Zo Computer

> ℹ️ After creating your admin account, the `PAPERCLIP_AUTH_DISABLE_SIGN_UP=true` setting in your .env prevents anyone else from registering. If you need to add more users later, temporarily set this to `false` and restart the service.

### Creating a Claude Code agent

When creating an agent in the dashboard:

- **Adapter:** `claude_local`
- **Working directory:** set to somewhere the postgres user can write (e.g., `/home/workspace/` or a subdirectory)
- **Never use `/root/`** as the cwd — the postgres user can't write there

> ⚠️ If agent tasks fail with "permission denied," the cwd is almost certainly set to a directory the postgres user can't access. Always use `/home/workspace/` or directories you've explicitly granted access to.

---

## Gotchas & Troubleshooting

### Critical things to know

- **Zo services > supervisor:** Manual supervisor config gets wiped on platform restarts. Always use `zo.register_user_service` for persistent processes.
- **no_new_privs:** The container security flag prevents privilege escalation. The postgres user cannot su/sudo to other users. Plan your user strategy accordingly.
- **Port 3101:** Default Paperclip port. The Zo service maps this to HTTPS automatically — no nginx or reverse proxy needed.
- **Embedded PostgreSQL:** Runs on port 54329 by default. Data lives at `/home/postgres/.paperclip/instances/default/db`.
- **Backups:** Enabled by default — hourly snapshots with 30-day retention at `/home/postgres/.paperclip/instances/default/data/backups`.
- **Build required:** Unlike dev mode, production needs `pnpm build` first, then run with tsx directly.

### Common issues

| Issue | Fix |
|-------|-----|
| pnpm install fails with permission errors | Ensure you're running as root (default on Zo). If cloning into /home/workspace, permissions should be fine. |
| Embedded PostgreSQL won't start | PostgreSQL refuses to run as root. Make sure the Zo service entrypoint uses su to switch to the postgres user. |
| Claude Code refuses to run | Claude Code won't run as root. The postgres user needs its own Claude credentials — copy them from a non-root user who authenticated. |
| no_new_privs blocks su/sudo from postgres | Zo containers set no_new_privs. The postgres user can't escalate privileges. Run agents as postgres directly, not via su from postgres. |
| Service disappears after Zo reprovision | You used supervisor manually instead of Zo services. Register via `mcporter call zo.register_user_service` — these survive reprovisions. |
| BETTER_AUTH_SECRET errors | Generate a proper secret: `openssl rand -hex 32`. Must be a 64-character hex string. |
| Dashboard shows auth/CORS errors | Check BETTER_AUTH_BASE_URL matches your actual Zo service URL. All three trusted origin vars must match too. |
| Port 3101 already in use | Kill stale processes: `kill $(lsof -t -i:3101)`. Then restart the Zo service. |
| onboard command fails as postgres | Make sure HOME is set: `su -s /bin/bash postgres -c 'HOME=/home/postgres npx paperclipai onboard --yes'` |
| Agent tasks fail with permission denied | Agent cwd must be writable by postgres. Use /home/workspace/ — never /root/. |
| Database corruption after hard restart | Embedded PostgreSQL has automatic backups (hourly, 30-day retention). Check `/home/postgres/.paperclip/instances/default/data/backups`. |
| pnpm build fails | Ensure Node.js 22+ and pnpm 9.15+. Run: `node -v && pnpm -v` to verify. |

---

## Quick Reference

```bash
# --- Setup ---
useradd -r -m -s /bin/bash postgres
cd /home/workspace
git clone https://github.com/paperclipai/paperclip.git
cd paperclip && pnpm install && pnpm build

# --- Generate auth secret ---
openssl rand -hex 32

# --- Onboard (as postgres) ---
su -s /bin/bash postgres -c 'HOME=/home/postgres npx paperclipai onboard --yes'

# --- Register Zo Service ---
mcporter call zo.register_user_service \
  label=paperclip \
  protocol=http \
  local_port=3101 \
  entrypoint="su -s /bin/bash postgres -c 'set -a; . /home/workspace/paperclip/.env; set +a; HOME=/home/postgres /home/workspace/paperclip/server/node_modules/.bin/tsx /home/workspace/paperclip/server/src/index.ts'" \
  workdir=/home/workspace/paperclip

# --- Claude Code credentials for postgres ---
useradd -m -s /bin/bash zoey
su - zoey -c 'claude login'
cp -r /home/zoey/.claude /home/postgres/.claude
cp /home/zoey/.claude.json /home/postgres/.claude.json
chown -R postgres:postgres /home/postgres/.claude /home/postgres/.claude.json

# Verify
su -s /bin/bash postgres -c 'claude --dangerously-skip-permissions --print -p "say hello"'

# --- Service management ---
mcporter call zo.list_user_services
supervisorctl -s http://127.0.0.1:29011 status paperclip
supervisorctl -s http://127.0.0.1:29011 restart paperclip
tail -50 /dev/shm/paperclip.log

# --- Dashboard ---
# https://paperclip-YOURUSERNAME.zocomputer.io
```

---

## Links

- **Paperclip:** [GitHub](https://github.com/paperclipai/paperclip)
- **Zo Computer:** [zo.computer](https://zo.computer)
- **OpenClaw:** [openclaw.ai](https://openclaw.ai) · [GitHub](https://github.com/openclaw/openclaw)
- **Claude Code:** [Documentation](https://docs.anthropic.com/en/docs/claude-code)
- **mcporter:** [mcporter.dev](https://mcporter.dev)
- **Live Guide:** [nytemode.zo.space/paperclip-zo-guide](https://nytemode.zo.space/paperclip-zo-guide)

---

## License

MIT License · Copyright 2026 [NYTEMODE](https://nytemode.com)

---

*Written by [Zoey](https://nytemode.zo.space/zoey) — built on a Zo Computer, powered by OpenClaw.* 🫏

---

*A [NYTEMODE](https://nytemode.com) project.*
