<script lang="ts">
  import Seo from "$lib/seo.svelte";
  const RELEASE = "0.2.0";
  const RELEASE_URL = `https://github.com/gevianajr/veesker/releases/tag/v${RELEASE}`;
</script>

<Seo
  title="Download"
  description="Download Veesker for Windows, macOS, and Linux. Free, open source under Apache 2.0. No account required, no telemetry, no Oracle Instant Client needed."
  path="/download"
/>

<section class="hero">
  <div class="container">
    <h1>Download Veesker</h1>
    <p class="lead">
      Latest release: <strong>v{RELEASE}</strong>.
      Free for personal use and small organizations.
      <a href="/pricing">Pricing →</a>
    </p>

    <div class="downloads">
      <div class="dl">
        <div class="dl-os">🪟 Windows 10/11 · x64</div>
        <h3>Veesker_{RELEASE}_x64-setup.exe</h3>
        <p class="muted">NSIS installer · ~34 MB</p>
        <a href="{RELEASE_URL}" class="btn primary" target="_blank" rel="noopener">Get from GitHub Release ↗</a>
        <p class="hint">SmartScreen will warn — code signing in progress. Click "More info" → "Run anyway".</p>
      </div>
      <div class="dl">
        <div class="dl-os">🍎 macOS · Apple Silicon + Intel</div>
        <h3>Veesker_{RELEASE}_universal.dmg</h3>
        <p class="muted">DMG · coming soon (Apple Silicon needs separate build)</p>
        <a href="{RELEASE_URL}" class="btn" target="_blank" rel="noopener">Build from source ↗</a>
        <p class="hint">macOS releases will be published once the build pipeline lands.</p>
      </div>
      <div class="dl">
        <div class="dl-os">🐧 Linux</div>
        <h3>Build from source</h3>
        <p class="muted">No packaged Linux release yet</p>
        <a href="https://github.com/gevianajr/veesker#build-from-source" class="btn" target="_blank" rel="noopener">Build instructions ↗</a>
      </div>
    </div>

    <div class="checksums">
      <h3>Verify your download (optional but recommended)</h3>
      <p class="muted">SHA-256 checksums and Ed25519 signatures are published with each GitHub release.</p>
      <pre class="cmd">Get-FileHash -Algorithm SHA256 .\Veesker_{RELEASE}_x64-setup.exe</pre>
    </div>

    <div class="auto-update">
      <h3>Auto-update built in</h3>
      <p>
        After installing v{RELEASE} or later, Veesker checks GitHub Releases on launch and offers
        in-app updates. Each release is signed with our Ed25519 key — Veesker verifies before installing.
      </p>
    </div>
  </div>
</section>

<style>
  .hero { padding: 80px 0; }
  h1 { font-size: 44px; margin-bottom: 16px; }
  .lead { color: var(--text-muted); font-size: 16px; margin-bottom: 36px; }
  .downloads {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px;
    margin-bottom: 50px;
  }
  .dl {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 24px;
  }
  .dl-os {
    font-size: 12px; color: var(--text-muted);
    text-transform: uppercase; letter-spacing: 0.06em;
    margin-bottom: 12px;
  }
  .dl h3 { font-size: 16px; margin: 0 0 6px; word-break: break-all; }
  .dl .muted { color: var(--text-muted); font-size: 13px; margin: 0 0 14px; }
  .dl .btn { width: 100%; justify-content: center; margin-bottom: 10px; }
  .dl .hint { color: var(--text-muted); font-size: 11.5px; margin: 0; line-height: 1.5; }

  .checksums, .auto-update {
    background: var(--bg-soft); border: 1px solid var(--border);
    border-radius: 10px; padding: 24px; margin-bottom: 18px;
  }
  .checksums h3, .auto-update h3 { font-size: 16px; margin: 0 0 8px; }
  .checksums .muted, .auto-update p {
    color: var(--text-muted); font-size: 13.5px; line-height: 1.55; margin: 0 0 12px;
  }
  .cmd {
    background: var(--bg); border: 1px solid var(--border);
    padding: 12px; border-radius: 6px;
    font-family: "JetBrains Mono", monospace; font-size: 12px;
    color: var(--text); margin: 0; overflow-x: auto;
  }

  @media (max-width: 880px) {
    .downloads { grid-template-columns: 1fr; }
  }
</style>
