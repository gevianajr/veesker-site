<script lang="ts">
  // Features showcase
</script>

<svelte:head><title>Features — Veesker</title></svelte:head>

<section class="hero">
  <div class="container">
    <h1>Features</h1>
    <p class="lead">Everything Veesker does today. All free under Apache 2.0, all available in every tier.</p>
  </div>
</section>

<section class="content">
  <div class="container">

    <div class="feat-block">
      <h2>SQL editor</h2>
      <ul>
        <li><strong>Multi-statement execution</strong> — PL/SQL-aware splitter handles strings, comments, q-quoted literals, and BEGIN/END blocks separated by `/`.</li>
        <li><strong>Per-statement results</strong> — each statement gets its own result tab with status, elapsed time, and row count.</li>
        <li><strong>Cancel running queries</strong> — Cmd/Ctrl + . aborts the in-flight statement (server-side connection.break()).</li>
        <li><strong>Run modes</strong> — at-cursor, selection, or whole tab.</li>
        <li><strong>Virtualized result grid</strong> — millions of rows without UI freeze, sortable, resizable columns.</li>
        <li><strong>Query history</strong> — per-connection SQLite-backed with elapsed time, row count, error code; click to reload.</li>
        <li><strong>File I/O</strong> — Save / Save As / Open .sql files with file-modified indicator.</li>
        <li><strong>DML safety</strong> — destructive operations trigger confirmation modal showing impact.</li>
        <li><strong>EXPLAIN PLAN</strong> — visualization of execution plan tree with cost & cardinality.</li>
        <li><strong>Compile errors inline</strong> — for CREATE PROCEDURE/FUNCTION/PACKAGE, errors at the failing line.</li>
        <li><strong>CodeMirror 6</strong> — syntax highlighting, minimap, schema-aware autocomplete.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>Schema browser</h2>
      <ul>
        <li><strong>All object kinds</strong> — Tables, Views, Sequences, Procedures, Functions, Packages, Triggers, Types, REST Modules.</li>
        <li><strong>DataFlow graph</strong> — visual upstream/downstream dependencies via FK + PL/SQL body scanning.</li>
        <li><strong>Object inspector</strong> — columns, indexes, related (FKs in/out, dependents, constraints, grants).</li>
        <li><strong>Quick actions</strong> — preview data with PK ordering, exact COUNT, view DDL, navigate related.</li>
        <li><strong>Vector indicator</strong> — schemas with VECTOR-typed columns are flagged.</li>
        <li><strong>System schema toggle + filtering</strong> — hide noise, find anything fast.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>AI Sheep 🐑</h2>
      <ul>
        <li><strong>Live database access</strong> — Sheep runs SELECT queries against your real schema to answer questions.</li>
        <li><strong>Context-aware</strong> — knows the current schema, currently selected object, live connection.</li>
        <li><strong>Explain & analyze</strong> — highlight any SQL → "Explain with AI" → line-by-line walkthrough.</li>
        <li><strong>Generate SQL</strong> — describe what you want, get a SQL draft to review and run.</li>
        <li><strong>Markdown rendering</strong> — code blocks, inline code, syntax-highlighted.</li>
        <li><strong>API key in OS keychain</strong> — Anthropic key stored locally, fallback to env var.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>Vector search studio</h2>
      <ul>
        <li><strong>Embedding providers</strong> — Ollama (local), OpenAI, Voyage, custom OpenAI-compatible endpoints.</li>
        <li><strong>HNSW & IVF indexes</strong> — create, drop, parameterize accuracy/distance metric.</li>
        <li><strong>Similarity search UI</strong> — text input → embeddings → live similarity results.</li>
        <li><strong>2D PCA scatter plot</strong> — color-coded by cluster, click points to see source rows.</li>
        <li><strong>Embed batch operations</strong> — bulk-embed pending rows with progress tracking.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>PL/SQL Debugger</h2>
      <ul>
        <li><strong>Breakpoints</strong> — gutter click or Ctrl+B.</li>
        <li><strong>Step controls</strong> — Step Into, Step Over, Step Out, Continue.</li>
        <li><strong>Watch variables</strong> — real-time variable inspection.</li>
        <li><strong>Call stack</strong> — current line highlight, click to navigate frames.</li>
        <li><strong>DBMS_OUTPUT capture</strong> — see all output as it happens.</li>
        <li><strong>SYS_REFCURSOR extraction</strong> — view cursor results when execution completes.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>VRAS — REST API Studio</h2>
      <ul>
        <li><strong>Auto-CRUD</strong> — 1-click ORDS.ENABLE_OBJECT for tables/views.</li>
        <li><strong>Custom SQL endpoints</strong> — write parameterized SQL, define route + method, deploy.</li>
        <li><strong>Procedure endpoints</strong> — pick any procedure/function, params auto-introspected, JSON via APEX_JSON.</li>
        <li><strong>Sheep AI integration</strong> — describe endpoint in natural language, AI fills the form.</li>
        <li><strong>OAuth 2.0 client management</strong> — create clients, role assignment, secret-once display.</li>
        <li><strong>Inline HTTP test panel</strong> — auto-injected Bearer tokens, JSON pretty-print.</li>
        <li><strong>Module browser</strong> — read existing ORDS modules, view source code.</li>
        <li><strong>Export as SQL</strong> — reverse-engineer any deployed module into recreatable PL/SQL.</li>
        <li><strong>Bootstrap detection</strong> — auto-detects ORDS install, schema enable, base URL; one-click "Habilitar agora".</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>Workspace UX</h2>
      <ul>
        <li><strong>Dark / light mode</strong> with smooth transitions.</li>
        <li><strong>Customizable panels</strong> — resize schema tree and AI panel, persisted.</li>
        <li><strong>System tray integration</strong> — minimize to tray, status badges per connection.</li>
        <li><strong>Command palette</strong> — Ctrl+K for fast navigation.</li>
        <li><strong>Help center & onboarding</strong> — in-app guided tour for new users.</li>
        <li><strong>Auto-update</strong> — Tauri-native updater with Ed25519-signed releases.</li>
        <li><strong>Audit trail</strong> — every SQL execution logged to audit/&lt;date&gt;.jsonl.</li>
      </ul>
    </div>

    <div class="feat-block">
      <h2>Cross-platform</h2>
      <ul>
        <li><strong>Windows</strong> — NSIS installer + MSI, runs on Windows 10 (with WebView2) and Windows 11.</li>
        <li><strong>macOS</strong> — .dmg + .app for Apple Silicon and Intel.</li>
        <li><strong>Linux</strong> — supported via build (not yet packaged).</li>
        <li><strong>Zero Oracle client install</strong> — node-oracledb Thin driver.</li>
      </ul>
    </div>

  </div>
</section>

<style>
  .hero { padding: 80px 0 30px; text-align: center; }
  h1 { font-size: 48px; margin-bottom: 16px; }
  .lead { color: var(--text-muted); font-size: 16px; max-width: 720px; margin: 0 auto; }
  .content { padding: 30px 0 80px; }
  .feat-block {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 12px; padding: 28px;
    margin-bottom: 18px;
  }
  .feat-block h2 { font-size: 24px; margin: 0 0 18px; color: var(--accent-text); }
  .feat-block ul { list-style: none; padding: 0; margin: 0; }
  .feat-block li {
    padding: 10px 0; border-top: 1px dashed var(--border);
    font-size: 14.5px; line-height: 1.6; color: var(--text-muted);
  }
  .feat-block li:first-child { border-top: none; }
  .feat-block li strong { color: var(--text); }
</style>
