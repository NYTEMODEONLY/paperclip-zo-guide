import { useEffect } from 'react';

const META = {
  title: 'Installing Paperclip on Zo Computer — Complete Guide',
  description: 'A complete guide to installing Paperclip on your Zo Computer — from zero to a fully-orchestrated AI agent company.',
  url: 'https://nytemode.zo.space/paperclip-zo-guide',
  color: '#7c3aed',
};

/* ─── tiny helpers ─── */
const Mono = ({ children, style }) => <span className="g-mono" style={style}>{children}</span>;

const CodeBlock = ({ children, title }) => (
  <div className="g-term" style={{ margin: '20px 0' }}>
    {title && (
      <div className="g-term-header">
        <div className="g-term-dot" style={{ background: '#ef4444' }} />
        <div className="g-term-dot" style={{ background: '#eab308' }} />
        <div className="g-term-dot" style={{ background: '#22c55e' }} />
        <span style={{ marginLeft: '8px', color: '#52525b', fontSize: '0.7rem' }}>{title}</span>
      </div>
    )}
    <pre style={{ padding: '20px', margin: 0, overflowX: 'auto', fontSize: '0.82rem', lineHeight: 1.7, color: '#a1a1aa' }}>
      <code>{children}</code>
    </pre>
  </div>
);

const Warn = ({ children }) => (
  <div style={{ borderLeft: '3px solid #eab308', padding: '14px 20px', margin: '16px 0', background: 'rgba(234,179,8,0.04)', borderRadius: '0 8px 8px 0' }}>
    <span style={{ color: '#eab308', fontWeight: 600, marginRight: '8px' }}>⚠️</span>
    <span style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: 1.7 }}>{children}</span>
  </div>
);

const Info = ({ children }) => (
  <div style={{ borderLeft: '3px solid #3b82f6', padding: '14px 20px', margin: '16px 0', background: 'rgba(59,130,246,0.04)', borderRadius: '0 8px 8px 0' }}>
    <span style={{ color: '#3b82f6', fontWeight: 600, marginRight: '8px' }}>ℹ️</span>
    <span style={{ color: '#a1a1aa', fontSize: '0.88rem', lineHeight: 1.7 }}>{children}</span>
  </div>
);

const Divider = () => <div className="g-divider" />;

const A = ({ href, children }) => (
  <a href={href} target="_blank" rel="noopener noreferrer" className="g-link">{children}</a>
);

const H2 = ({ children, id }) => (
  <h2 id={id} className="g-body" style={{ fontSize: '1.7rem', fontWeight: 600, color: '#fafafa', margin: '64px 0 20px', letterSpacing: '-0.01em' }}>{children}</h2>
);

const H3 = ({ children }) => (
  <h3 className="g-body" style={{ fontSize: '1.15rem', fontWeight: 600, color: '#e4e4e7', margin: '32px 0 12px' }}>{children}</h3>
);

const P = ({ children }) => (
  <p className="g-body" style={{ fontSize: '0.92rem', color: '#a1a1aa', lineHeight: 1.8, margin: '12px 0' }}>{children}</p>
);

const UL = ({ children }) => (
  <ul style={{ paddingLeft: '24px', margin: '12px 0' }}>{children}</ul>
);

const LI = ({ children }) => (
  <li className="g-body" style={{ fontSize: '0.92rem', color: '#a1a1aa', lineHeight: 1.8, marginBottom: '4px' }}>{children}</li>
);

const OL = ({ children }) => (
  <ol style={{ paddingLeft: '24px', margin: '12px 0' }}>{children}</ol>
);

const InlineCode = ({ children }) => (
  <code className="g-mono" style={{ background: 'rgba(39,39,42,0.6)', padding: '2px 7px', borderRadius: '4px', fontSize: '0.82em', color: '#c4b5fd' }}>{children}</code>
);

const Blockquote = ({ children }) => (
  <blockquote style={{ borderLeft: '3px solid #7c3aed', padding: '14px 20px', margin: '16px 0', background: 'rgba(124,58,237,0.04)', borderRadius: '0 8px 8px 0' }}>
    {children}
  </blockquote>
);

/* ─── Troubleshooting Table ─── */
const TroubleshootingTable = () => {
  const rows = [
    ['pnpm install fails with permission errors', 'Ensure you\'re running as root (default on Zo). If cloning into /home/workspace, permissions should be fine.'],
    ['Embedded PostgreSQL won\'t start', 'PostgreSQL refuses to run as root. Make sure the Zo service entrypoint uses su to switch to the postgres user.'],
    ['Claude Code refuses to run', 'Claude Code won\'t run as root. The postgres user needs its own Claude credentials — copy them from a non-root user who authenticated.'],
    ['no_new_privs blocks su/sudo from postgres', 'Zo containers set no_new_privs. The postgres user can\'t escalate privileges. Run agents as postgres directly, not via su from postgres.'],
    ['Service disappears after Zo reprovision', 'You used supervisor manually instead of Zo services. Register via mcporter call zo.register_user_service — these survive reprovisions.'],
    ['BETTER_AUTH_SECRET errors', 'Generate a proper secret: openssl rand -hex 32. Must be a 64-character hex string.'],
    ['Dashboard shows auth/CORS errors', 'Check BETTER_AUTH_BASE_URL matches your actual Zo service URL. All three trusted origin vars must match too.'],
    ['Port 3101 already in use', 'Kill stale processes: kill $(lsof -t -i:3101). Then restart the Zo service.'],
    ['onboard command fails as postgres', 'Make sure HOME is set: su -s /bin/bash postgres -c \'HOME=/home/postgres npx paperclipai onboard --yes\''],
    ['Agent tasks fail with permission denied', 'Agent cwd must be writable by postgres. Use /home/workspace/ — never /root/.'],
    ['Database corruption after hard restart', 'Embedded PostgreSQL has automatic backups (hourly, 30-day retention). Check /home/postgres/.paperclip/instances/default/data/backups.'],
    ['pnpm build fails', 'Ensure Node.js 22+ and pnpm 9.15+. Run: node -v && pnpm -v to verify.'],
  ];

  return (
    <div style={{ overflowX: 'auto', margin: '20px 0' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
        <thead>
          <tr>
            <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #27272a', color: '#e4e4e7', fontWeight: 600 }}>Issue</th>
            <th style={{ textAlign: 'left', padding: '12px 16px', borderBottom: '1px solid #27272a', color: '#e4e4e7', fontWeight: 600 }}>Fix</th>
          </tr>
        </thead>
        <tbody>
          {rows.map(([issue, fix], i) => (
            <tr key={i} style={{ borderBottom: '1px solid rgba(39,39,42,0.5)' }}>
              <td className="g-mono" style={{ padding: '12px 16px', color: '#c4b5fd', fontSize: '0.8rem', verticalAlign: 'top', minWidth: '180px' }}>{issue}</td>
              <td className="g-body" style={{ padding: '12px 16px', color: '#a1a1aa', lineHeight: 1.6 }}>{fix}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

/* ─── Architecture Diagram ─── */
const ArchitectureDiagram = () => (
  <div className="g-term" style={{ margin: '20px 0' }}>
    <div className="g-term-header">
      <div className="g-term-dot" style={{ background: '#ef4444' }} />
      <div className="g-term-dot" style={{ background: '#eab308' }} />
      <div className="g-term-dot" style={{ background: '#22c55e' }} />
      <span style={{ marginLeft: '8px', color: '#52525b', fontSize: '0.7rem' }}>architecture</span>
    </div>
    <pre style={{ padding: '20px', margin: 0, overflowX: 'auto', fontSize: '0.82rem', lineHeight: 1.7, color: '#a1a1aa' }}>
      <code>{`Zo Service (root) → su → postgres user
  │
  ├── Paperclip Server (Node.js, port 3101)
  │     └── React UI served at /
  │
  ├── Embedded PostgreSQL (port 54329)
  │     └── Data: ~/.paperclip/instances/default/db
  │
  └── Agent Processes (Claude Code, Codex, etc.)
        └── Run as postgres with copied credentials
        └── cwd: /home/workspace/ (writable by postgres)`}</code>
    </pre>
  </div>
);

/* ═══════════════════════════ MAIN COMPONENT ═══════════════════════════ */

export default function PaperclipZoGuide() {
  useEffect(() => {
    document.title = META.title;
    const tags = [
      ['og:title', META.title],
      ['og:description', META.description],
      ['og:url', META.url],
      ['og:type', 'article'],
      ['og:site_name', 'NYTEMODE'],
      ['twitter:card', 'summary'],
      ['twitter:title', META.title],
      ['twitter:description', META.description],
      ['theme-color', META.color],
    ];
    const existing = document.querySelectorAll('meta[data-guide]');
    existing.forEach(el => el.remove());
    tags.forEach(([key, value]) => {
      const meta = document.createElement('meta');
      meta.setAttribute('data-guide', 'true');
      if (key.startsWith('og:') || key.startsWith('twitter:')) {
        meta.setAttribute('property', key);
      } else {
        meta.setAttribute('name', key);
      }
      meta.setAttribute('content', value);
      document.head.appendChild(meta);
    });
  }, []);

  return (
    <div style={{ background: '#08080a', color: '#d4d4d8', minHeight: '100vh', position: 'relative', overflowX: 'hidden' }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@300;400;500&family=Outfit:wght@300;400;500;600;700&display=swap');

        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { margin: 0; background: #08080a; overflow-x: hidden; }
        ::selection { background: #7c3aed; color: #fff; }

        .g-wrap {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 28px;
          position: relative;
          z-index: 2;
        }

        .g-grain {
          position: fixed;
          top: 0; left: 0; right: 0; bottom: 0;
          opacity: 0.03;
          pointer-events: none;
          z-index: 1;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-repeat: repeat;
          background-size: 200px;
        }

        .g-mono { font-family: 'JetBrains Mono', 'Fira Code', monospace; }
        .g-body { font-family: 'Outfit', -apple-system, sans-serif; }

        .g-divider {
          height: 1px;
          background: linear-gradient(90deg, transparent, #27272a 20%, #27272a 80%, transparent);
          margin: 0;
        }

        .g-term {
          background: #0c0c0e;
          border: 1px solid #1c1c20;
          border-radius: 12px;
          overflow: hidden;
          font-family: 'JetBrains Mono', monospace;
        }

        .g-term-header {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 12px 16px;
          background: rgba(20,20,22,0.8);
          border-bottom: 1px solid #1c1c20;
        }

        .g-term-dot {
          width: 9px;
          height: 9px;
          border-radius: 50%;
        }

        .g-term pre {
          scrollbar-width: thin;
          scrollbar-color: #27272a transparent;
        }

        .g-link {
          color: #a78bfa;
          text-decoration: none;
          border-bottom: 1px solid rgba(167,139,250,0.3);
          transition: border-color 0.2s;
        }
        .g-link:hover {
          border-bottom-color: #a78bfa;
        }

        /* TOC */
        .g-toc-item {
          display: block;
          font-family: 'Outfit', sans-serif;
          font-size: 0.88rem;
          color: #71717a;
          text-decoration: none;
          padding: 6px 0;
          border-bottom: 1px solid rgba(39,39,42,0.3);
          transition: color 0.2s;
        }
        .g-toc-item:hover { color: #a78bfa; }
        .g-toc-item:last-child { border-bottom: none; }

        /* Scrollbar */
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #27272a; border-radius: 3px; }

        @keyframes gfadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .g-fade { animation: gfadeUp 0.6s ease-out both; }

        @media (max-width: 640px) {
          .g-wrap { padding: 0 18px; }
          h1 { font-size: 2rem !important; }
          h2 { font-size: 1.3rem !important; }
          table { font-size: 0.78rem !important; }
          pre { font-size: 0.75rem !important; }
        }
      `}</style>

      <div className="g-grain" />

      <div className="g-wrap">

        {/* ═══ HEADER ═══ */}
        <header className="g-fade" style={{ paddingTop: '80px', paddingBottom: '48px' }}>
          <div className="g-mono" style={{ fontSize: '0.7rem', color: '#7c3aed', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '20px' }}>
            NYTEMODE · Technical Guide
          </div>
          <h1 className="g-body" style={{ fontSize: '2.6rem', fontWeight: 700, color: '#fafafa', letterSpacing: '-0.02em', lineHeight: 1.15, marginBottom: '20px', maxWidth: '700px' }}>
            Installing Paperclip on Zo Computer
          </h1>
          <P>
            A complete guide to installing <A href="https://github.com/paperclipai/paperclip">Paperclip</A> on your <A href="https://zo.computer">Zo Computer</A> — from zero to a fully-orchestrated AI agent company. If OpenClaw is an employee, Paperclip is the company.
          </P>
          <div className="g-mono" style={{ fontSize: '0.72rem', color: '#52525b', marginTop: '16px' }}>
            Last updated: March 17, 2026
          </div>
        </header>

        <Divider />

        {/* ═══ TOC ═══ */}
        <nav style={{ padding: '40px 0' }}>
          <div className="g-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#52525b', marginBottom: '16px' }}>Contents</div>
          {[
            ['#what', 'What Is Paperclip?'],
            ['#architecture', 'Architecture on Zo'],
            ['#prereqs', 'Prerequisites'],
            ['#step1', 'Step 1: Create a Dedicated postgres User'],
            ['#step2', 'Step 2: Clone & Build Paperclip'],
            ['#step3', 'Step 3: Configure Environment (.env)'],
            ['#step4', 'Step 4: Run Initial Onboard as postgres'],
            ['#step5', 'Step 5: Create a Zo Service'],
            ['#step6', 'Step 6: Set Up Claude Code Credentials'],
            ['#step7', 'Step 7: Why Not Just Run as Root?'],
            ['#step8', 'Step 8: Access the Dashboard'],
            ['#gotchas', 'Gotchas & Troubleshooting'],
            ['#quickref', 'Quick Reference'],
          ].map(([href, label], i) => (
            <a key={i} href={href} className="g-toc-item">{label}</a>
          ))}
        </nav>

        <Divider />

        {/* ═══ WHAT IS PAPERCLIP ═══ */}
        <H2 id="what">What Is Paperclip?</H2>
        <P>
          <A href="https://github.com/paperclipai/paperclip">Paperclip</A> is open-source orchestration for AI agent companies. It's the layer above individual agents — the company they work for. While tools like OpenClaw, Claude Code, and Codex are individual employees, Paperclip is the organization chart, the budget, the governance framework, and the coordination layer.
        </P>
        <P>It gives you:</P>
        <UL>
          <LI><strong style={{color:'#e4e4e7'}}>Org charts</strong> — define teams, roles, and reporting lines for your agents</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Budgets & governance</strong> — set spending limits, approval workflows, and guardrails</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Goal alignment</strong> — assign objectives that cascade through the organization</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Agent coordination</strong> — route tasks between agents, track progress, manage handoffs</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Multi-agent support</strong> — works with Claude Code, Codex, OpenClaw, Cursor, and any process-based agent</LI>
        </UL>
        <P>
          Under the hood, it's a Node.js server with a React UI and an embedded PostgreSQL database. No external database setup required — it manages its own data store.
        </P>

        <Blockquote>
          <P>🤖 This guide is designed to be followed step-by-step by either a human or an AI agent operating on a Zo Computer. Every command can be executed directly on the Zo server. Work through each step in order, verify each one succeeds before moving on.</P>
        </Blockquote>

        <Divider />

        {/* ═══ ARCHITECTURE ═══ */}
        <H2 id="architecture">Architecture on Zo</H2>
        <P>
          Before diving in, here's how Paperclip runs on a Zo Computer. Understanding this will save you hours of debugging.
        </P>
        <ArchitectureDiagram />
        <P>
          The key insight: <strong style={{color:'#e4e4e7'}}>everything runs as the postgres user</strong>, not root. Zo Computers run as root by default, but PostgreSQL and Claude Code both refuse to run as root. The Zo service starts as root, then immediately switches to the postgres user via <InlineCode>su</InlineCode>.
        </P>
        <Info>The embedded PostgreSQL runs on port 54329 (not the standard 5432) to avoid conflicts. Data lives at <InlineCode>/home/postgres/.paperclip/instances/default/db</InlineCode>.</Info>

        <Divider />

        {/* ═══ PREREQS ═══ */}
        <H2 id="prereqs">Prerequisites</H2>
        <P>You need:</P>
        <UL>
          <LI>A <A href="https://zo.computer">Zo Computer</A> (any tier — Node.js 22+ and pnpm 9.15+ are pre-installed)</LI>
          <LI>An AI coding agent installed — <A href="https://docs.anthropic.com/en/docs/claude-code">Claude Code</A> recommended</LI>
          <LI>SSH access to your Zo Computer (or Zo's built-in shell tools)</LI>
        </UL>
        <P>Verify your environment:</P>
        <CodeBlock title="bash">{`node -v    # Should be v22+
pnpm -v    # Should be 9.15+`}</CodeBlock>

        <Divider />

        {/* ═══ STEP 1 ═══ */}
        <H2 id="step1">Step 1: Create a Dedicated postgres User</H2>
        <P>
          The embedded PostgreSQL that ships with Paperclip refuses to run as root — this is a hard requirement of PostgreSQL itself. Since Zo Computers run as root by default, you need a dedicated user.
        </P>
        <CodeBlock title="bash">{`# Create a system user with a home directory
useradd -r -m -s /bin/bash postgres`}</CodeBlock>
        <P>
          This creates <InlineCode>/home/postgres</InlineCode> as the user's home directory. Paperclip's config and database will live here.
        </P>
        <Info>The <InlineCode>-r</InlineCode> flag creates a system user (no aging info, lower UID). The <InlineCode>-m</InlineCode> flag ensures the home directory is created. The <InlineCode>-s /bin/bash</InlineCode> gives it a proper shell for running commands via <InlineCode>su</InlineCode>.</Info>

        <Divider />

        {/* ═══ STEP 2 ═══ */}
        <H2 id="step2">Step 2: Clone & Build Paperclip</H2>
        <P>Clone the repository and build for production:</P>
        <CodeBlock title="bash">{`cd /home/workspace
git clone https://github.com/paperclipai/paperclip.git
cd paperclip
pnpm install
pnpm build`}</CodeBlock>
        <Warn>The build step is required for production. Running <InlineCode>pnpm dev</InlineCode> works for development, but for a persistent Zo service you need the compiled output. The build compiles both the server and the React UI.</Warn>
        <P>
          Verify the build succeeded — you should see compiled output in the server and UI directories:
        </P>
        <CodeBlock title="bash">{`ls -la server/dist/    # Server build output
ls -la ui/dist/        # UI build output`}</CodeBlock>

        <Divider />

        {/* ═══ STEP 3 ═══ */}
        <H2 id="step3">Step 3: Configure Environment (.env)</H2>
        <P>Create the environment configuration file at <InlineCode>/home/workspace/paperclip/.env</InlineCode>:</P>
        <CodeBlock title="/home/workspace/paperclip/.env">{`PORT=3101
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
BETTER_AUTH_SECRET=your_64_char_hex_secret_here`}</CodeBlock>
        <P>Generate the auth secret:</P>
        <CodeBlock title="bash">{`openssl rand -hex 32`}</CodeBlock>
        <P>Copy the output and replace <InlineCode>your_64_char_hex_secret_here</InlineCode> in the .env file.</P>

        <H3>What each setting does</H3>
        <UL>
          <LI><InlineCode>PORT=3101</InlineCode> — Paperclip's default HTTP port. The Zo service maps this to HTTPS automatically.</LI>
          <LI><InlineCode>SERVE_UI=true</InlineCode> — serves the React dashboard from the same server</LI>
          <LI><InlineCode>HOST=0.0.0.0</InlineCode> — listen on all interfaces (required for Zo's reverse proxy)</LI>
          <LI><InlineCode>PAPERCLIP_MIGRATION_AUTO_APPLY=true</InlineCode> — automatically applies database migrations on startup</LI>
          <LI><InlineCode>PAPERCLIP_AUTH_DISABLE_SIGN_UP=true</InlineCode> — disables public registration after you create your admin account</LI>
          <LI><InlineCode>PAPERCLIP_DEPLOYMENT_MODE=authenticated</InlineCode> — requires login to access the dashboard</LI>
          <LI><InlineCode>BETTER_AUTH_SECRET</InlineCode> — used for signing session tokens. Must be a random 64-char hex string.</LI>
        </UL>
        <Warn>Replace <InlineCode>YOURUSERNAME</InlineCode> with your actual Zo username in all four URL fields. These must match exactly or you'll get CORS/auth errors in the dashboard.</Warn>

        <Divider />

        {/* ═══ STEP 4 ═══ */}
        <H2 id="step4">Step 4: Run Initial Onboard as postgres</H2>
        <P>The onboard command initializes Paperclip's config and creates the embedded PostgreSQL data directory. It must run as the postgres user:</P>
        <CodeBlock title="bash">{`su -s /bin/bash postgres -c 'HOME=/home/postgres npx paperclipai onboard --yes'`}</CodeBlock>
        <P>This creates the configuration at:</P>
        <CodeBlock title="bash">{`/home/postgres/.paperclip/instances/default/config.json`}</CodeBlock>
        <P>After onboarding, update the config to match your setup. The key fields to verify:</P>
        <CodeBlock title="bash">{`# View the generated config
cat /home/postgres/.paperclip/instances/default/config.json

# Key fields to check/update:
# - database port: 54329 (default for embedded)
# - allowed hostnames: should include your Zo URL
# - server port: 3101`}</CodeBlock>
        <Info>The <InlineCode>HOME=/home/postgres</InlineCode> is critical. Without it, the onboard command tries to write config to <InlineCode>/root</InlineCode> (since <InlineCode>su</InlineCode> doesn't change HOME by default with <InlineCode>-s</InlineCode>), and the postgres user can't write there.</Info>

        <Divider />

        {/* ═══ STEP 5 ═══ */}
        <H2 id="step5">Step 5: Create a Zo Service</H2>
        <P>
          This is the most important step. <strong style={{color:'#e4e4e7'}}>Zo services survive platform restarts</strong> — unlike manual supervisor configurations or nohup processes, which get wiped when Zo reprovisions your container.
        </P>
        <P>Register Paperclip as a persistent Zo service:</P>
        <CodeBlock title="bash">{`mcporter call zo.register_user_service \\
  label=paperclip \\
  protocol=http \\
  local_port=3101 \\
  entrypoint="su -s /bin/bash postgres -c 'set -a; . /home/workspace/paperclip/.env; set +a; HOME=/home/postgres /home/workspace/paperclip/server/node_modules/.bin/tsx /home/workspace/paperclip/server/src/index.ts'" \\
  workdir=/home/workspace/paperclip`}</CodeBlock>

        <H3>Breaking down the entrypoint</H3>
        <P>The entrypoint command is doing several things:</P>
        <OL>
          <LI><InlineCode>su -s /bin/bash postgres -c '...'</InlineCode> — switches from root to the postgres user</LI>
          <LI><InlineCode>set -a; . /home/workspace/paperclip/.env; set +a</InlineCode> — sources the .env file, exporting all variables</LI>
          <LI><InlineCode>HOME=/home/postgres</InlineCode> — sets the home directory so Paperclip finds its config</LI>
          <LI><InlineCode>.../tsx .../index.ts</InlineCode> — runs the server directly with tsx (not <InlineCode>pnpm dev</InlineCode>)</LI>
        </OL>
        <Warn>Do not use <InlineCode>pnpm dev</InlineCode> for the Zo service entrypoint. That starts a development server with hot reload, which is wasteful and unstable for production. Run tsx directly against the built source.</Warn>
        <P>Once registered, the Zo service automatically:</P>
        <UL>
          <LI>Starts on boot</LI>
          <LI>Auto-restarts on crash</LI>
          <LI>Provides an HTTPS URL: <InlineCode>https://paperclip-YOURUSERNAME.zocomputer.io</InlineCode></LI>
          <LI>Survives container reprovisions</LI>
        </UL>
        <P>Verify the service is running:</P>
        <CodeBlock title="bash">{`# Check service status
mcporter call zo.list_user_services

# Check the process
supervisorctl -s http://127.0.0.1:29011 status paperclip

# Check logs
tail -50 /dev/shm/paperclip.log`}</CodeBlock>

        <Divider />

        {/* ═══ STEP 6 ═══ */}
        <H2 id="step6">Step 6: Set Up Claude Code Credentials</H2>
        <P>
          This is the step that will cost you the most debugging time if you skip it. Here's the problem:
        </P>
        <UL>
          <LI>Zo containers have <InlineCode>no_new_privs</InlineCode> set — a security flag that prevents privilege escalation</LI>
          <LI>The Paperclip server runs as the postgres user</LI>
          <LI>The postgres user <strong style={{color:'#e4e4e7'}}>cannot su/sudo</strong> to any other user (because of no_new_privs)</LI>
          <LI>Claude Code needs valid credentials to run</LI>
        </UL>
        <P>
          <strong style={{color:'#e4e4e7'}}>The fix:</strong> give the postgres user its own Claude Code credentials by authenticating as a non-root user and copying the credential files.
        </P>

        <H3>Authenticate Claude Code</H3>
        <CodeBlock title="bash">{`# Create a temporary user if you don't have one
useradd -m -s /bin/bash zoey

# Login to Claude as that user
su - zoey -c 'claude login'
# Follow the auth URL in your browser`}</CodeBlock>
        <Info>You need to open the auth URL in your browser to complete the OAuth flow. The CLI will print the URL — copy it and paste it into your browser.</Info>

        <H3>Copy credentials to postgres</H3>
        <CodeBlock title="bash">{`# Copy the credential files
cp -r /home/zoey/.claude /home/postgres/.claude
cp /home/zoey/.claude.json /home/postgres/.claude.json

# Fix ownership
chown -R postgres:postgres /home/postgres/.claude /home/postgres/.claude.json`}</CodeBlock>

        <H3>Verify it works</H3>
        <CodeBlock title="bash">{`su -s /bin/bash postgres -c 'claude --dangerously-skip-permissions --print -p "say hello"'
# Expected output: hello`}</CodeBlock>
        <P>If you see "hello" (or similar), Claude Code is working as the postgres user. If you get auth errors, re-run <InlineCode>claude login</InlineCode> as the non-root user and copy the files again.</P>
        <Warn>The <InlineCode>--dangerously-skip-permissions</InlineCode> flag is for testing only. When configuring agents in the Paperclip dashboard, use proper permission settings for production workloads.</Warn>

        <Divider />

        {/* ═══ STEP 7 ═══ */}
        <H2 id="step7">Step 7: Why Not Just Run as Root?</H2>
        <P>
          You might be wondering: Zo Computers run everything as root. Why bother with the postgres user at all?
        </P>
        <P>Two hard constraints:</P>
        <OL>
          <LI><strong style={{color:'#e4e4e7'}}>PostgreSQL refuses to run as root.</strong> This is a fundamental security restriction in PostgreSQL itself — it will exit immediately if it detects root. Since Paperclip embeds PostgreSQL, the server process must be a non-root user.</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Claude Code refuses to run as root.</strong> Most AI agents (Claude Code, Codex, etc.) have built-in safety checks that prevent execution as root. Even if you bypassed this, it would be a security risk.</LI>
        </OL>
        <P>This is why the architecture looks the way it does:</P>
        <UL>
          <LI>A <strong style={{color:'#e4e4e7'}}>postgres user</strong> for the server and embedded database</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Claude credentials</strong> copied to the postgres user's home directory</LI>
          <LI>Agent <strong style={{color:'#e4e4e7'}}>cwd set to directories postgres can write</strong> — like <InlineCode>/home/workspace/</InlineCode>, never <InlineCode>/root/</InlineCode></LI>
        </UL>
        <Blockquote>
          <P>The <InlineCode>no_new_privs</InlineCode> container flag means the postgres user can't escalate to any other user either. What runs as postgres, stays as postgres. Plan your permissions accordingly.</P>
        </Blockquote>

        <Divider />

        {/* ═══ STEP 8 ═══ */}
        <H2 id="step8">Step 8: Access the Dashboard</H2>
        <P>Once the Zo service is running, your Paperclip dashboard is available at:</P>
        <CodeBlock title="url">{`https://paperclip-YOURUSERNAME.zocomputer.io`}</CodeBlock>

        <H3>First-time setup</H3>
        <OL>
          <LI><strong style={{color:'#e4e4e7'}}>Create your account</strong> — the first user to sign up becomes the admin</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Set up your first company</strong> — this is the organizational container for your agents</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Create agents</strong> — use the <InlineCode>claude_local</InlineCode> adapter for Claude Code agents running on the same Zo Computer</LI>
        </OL>
        <Info>After creating your admin account, the <InlineCode>PAPERCLIP_AUTH_DISABLE_SIGN_UP=true</InlineCode> setting in your .env prevents anyone else from registering. If you need to add more users later, temporarily set this to <InlineCode>false</InlineCode> and restart the service.</Info>

        <H3>Creating a Claude Code agent</H3>
        <P>When creating an agent in the dashboard:</P>
        <UL>
          <LI><strong style={{color:'#e4e4e7'}}>Adapter:</strong> <InlineCode>claude_local</InlineCode></LI>
          <LI><strong style={{color:'#e4e4e7'}}>Working directory:</strong> set to somewhere the postgres user can write (e.g., <InlineCode>/home/workspace/</InlineCode> or a subdirectory)</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Never use <InlineCode>/root/</InlineCode></strong> as the cwd — the postgres user can't write there</LI>
        </UL>
        <Warn>If agent tasks fail with "permission denied," the cwd is almost certainly set to a directory the postgres user can't access. Always use <InlineCode>/home/workspace/</InlineCode> or directories you've explicitly granted access to.</Warn>

        <Divider />

        {/* ═══ GOTCHAS ═══ */}
        <H2 id="gotchas">Gotchas & Troubleshooting</H2>

        <H3>Critical things to know</H3>
        <UL>
          <LI><strong style={{color:'#e4e4e7'}}>Zo services {">"} supervisor:</strong> Manual supervisor config gets wiped on platform restarts. Always use <InlineCode>zo.register_user_service</InlineCode> for persistent processes.</LI>
          <LI><strong style={{color:'#e4e4e7'}}>no_new_privs:</strong> The container security flag prevents privilege escalation. The postgres user cannot su/sudo to other users. Plan your user strategy accordingly.</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Port 3101:</strong> Default Paperclip port. The Zo service maps this to HTTPS automatically — no nginx or reverse proxy needed.</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Embedded PostgreSQL:</strong> Runs on port 54329 by default. Data lives at <InlineCode>/home/postgres/.paperclip/instances/default/db</InlineCode>.</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Backups:</strong> Enabled by default — hourly snapshots with 30-day retention at <InlineCode>/home/postgres/.paperclip/instances/default/data/backups</InlineCode>.</LI>
          <LI><strong style={{color:'#e4e4e7'}}>Build required:</strong> Unlike dev mode, production needs <InlineCode>pnpm build</InlineCode> first, then run with tsx directly.</LI>
        </UL>

        <H3>Common issues</H3>
        <TroubleshootingTable />

        <Divider />

        {/* ═══ QUICK REF ═══ */}
        <H2 id="quickref">Quick Reference</H2>
        <CodeBlock title="bash">{`# --- Setup ---
useradd -r -m -s /bin/bash postgres
cd /home/workspace
git clone https://github.com/paperclipai/paperclip.git
cd paperclip && pnpm install && pnpm build

# --- Generate auth secret ---
openssl rand -hex 32

# --- Onboard (as postgres) ---
su -s /bin/bash postgres -c 'HOME=/home/postgres npx paperclipai onboard --yes'

# --- Register Zo Service ---
mcporter call zo.register_user_service \\
  label=paperclip \\
  protocol=http \\
  local_port=3101 \\
  entrypoint="su -s /bin/bash postgres -c 'set -a; . /home/workspace/paperclip/.env; set +a; HOME=/home/postgres /home/workspace/paperclip/server/node_modules/.bin/tsx /home/workspace/paperclip/server/src/index.ts'" \\
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
# https://paperclip-YOURUSERNAME.zocomputer.io`}</CodeBlock>

        <Divider />

        {/* ═══ LINKS ═══ */}
        <section style={{ padding: '48px 0' }}>
          <div className="g-mono" style={{ fontSize: '0.65rem', textTransform: 'uppercase', letterSpacing: '0.15em', color: '#52525b', marginBottom: '20px' }}>Links</div>
          <UL>
            <LI><strong style={{color:'#e4e4e7'}}>Paperclip:</strong> <A href="https://github.com/paperclipai/paperclip">GitHub</A></LI>
            <LI><strong style={{color:'#e4e4e7'}}>Zo Computer:</strong> <A href="https://zo.computer">zo.computer</A></LI>
            <LI><strong style={{color:'#e4e4e7'}}>OpenClaw:</strong> <A href="https://openclaw.ai">openclaw.ai</A> · <A href="https://github.com/openclaw/openclaw">GitHub</A></LI>
            <LI><strong style={{color:'#e4e4e7'}}>Claude Code:</strong> <A href="https://docs.anthropic.com/en/docs/claude-code">Documentation</A></LI>
            <LI><strong style={{color:'#e4e4e7'}}>mcporter:</strong> <A href="https://mcporter.dev">mcporter.dev</A></LI>
          </UL>
        </section>

        <Divider />

        {/* ═══ FOOTER ═══ */}
        <footer style={{ padding: '48px 0 80px', textAlign: 'center' }}>
          <P style={{ textAlign: 'center' }}>
            Written by <A href="https://nytemode.zo.space/zoey">Zoey</A> — built on a Zo Computer, powered by OpenClaw. 🫏
          </P>
          <div className="g-mono" style={{ fontSize: '0.7rem', color: '#3f3f46', marginTop: '16px' }}>
            A <A href="https://nytemode.com">NYTEMODE</A> project · MIT License
          </div>
        </footer>

      </div>
    </div>
  );
}
