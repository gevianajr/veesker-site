<script lang="ts">
  import Seo from "$lib/seo.svelte";
  const RELEASE = "0.2.4";
  const BASE = `https://github.com/gevianajr/veesker/releases/download/v${RELEASE}`;
  const RELEASE_URL = `https://github.com/gevianajr/veesker/releases/tag/v${RELEASE}`;
</script>

<Seo
  title="Download"
  description="Download Veesker Community Edition for Windows, macOS, and Linux. Free forever under Apache 2.0. No account required, no telemetry, no Oracle Instant Client needed."
  path="/download"
/>

<section class="hero">
  <div class="container">
    <h1>Download Veesker CE</h1>
    <p class="lead">
      Community Edition · v{RELEASE} · Free forever under Apache 2.0.
      <a href="/pricing">CE vs Cloud →</a>
    </p>

    <div class="downloads">
      <div class="dl">
        <div class="dl-os">🪟 Windows 10/11 · x64</div>
        <h3>Veesker_{RELEASE}_x64-setup.exe</h3>
        <p class="muted">NSIS installer · ~34 MB</p>
        <a href="{BASE}/Veesker_{RELEASE}_x64-setup.exe" class="btn primary" target="_blank" rel="noopener">Download for Windows ↗</a>
        <p class="hint">SmartScreen may warn on first run — click "More info" → "Run anyway".</p>
      </div>
      <div class="dl">
        <div class="dl-os">🍎 macOS · Apple Silicon</div>
        <h3>Veesker_{RELEASE}_aarch64.dmg</h3>
        <p class="muted">DMG · M1 / M2 / M3 / M4</p>
        <a href="{BASE}/Veesker_{RELEASE}_aarch64.dmg" class="btn primary" target="_blank" rel="noopener">Download for macOS (ARM) ↗</a>
        <p class="hint">Right-click → Open on first launch if Gatekeeper blocks.</p>
      </div>
      <div class="dl">
        <div class="dl-os">🍎 macOS · Intel</div>
        <h3>Veesker_{RELEASE}_x64.dmg</h3>
        <p class="muted">DMG · Intel Core i5 / i7 / i9</p>
        <a href="{RELEASE_URL}" class="btn primary" target="_blank" rel="noopener">Get from GitHub Release ↗</a>
        <p class="hint">Download <code>Veesker_{RELEASE}_x64.dmg</code> from the release page. Right-click → Open on first launch.</p>
      </div>
      <div class="dl">
        <div class="dl-os">🐧 Linux · x64</div>
        <h3>Veesker_{RELEASE}_amd64.AppImage</h3>
        <p class="muted">AppImage or .deb</p>
        <a href="{RELEASE_URL}" class="btn primary" target="_blank" rel="noopener">Get from GitHub Release ↗</a>
        <p class="hint">Download <code>.AppImage</code> or <code>.deb</code> from the release page. Run <code>chmod +x</code> before launching the AppImage.</p>
      </div>
    </div>

    <div class="checksums">
      <h3>Verify your download (optional but recommended)</h3>
      <p class="muted">SHA-256 checksums and Ed25519 signatures are published with each GitHub release.</p>
      <pre class="cmd"># Windows (PowerShell)
Get-FileHash -Algorithm SHA256 .\Veesker_{RELEASE}_x64-setup.exe

# macOS / Linux
shasum -a 256 Veesker_{RELEASE}_aarch64.dmg</pre>
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
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 18px;
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

  @media (max-width: 1100px) {
    .downloads { grid-template-columns: repeat(2, 1fr); }
  }
  @media (max-width: 600px) {
    .downloads { grid-template-columns: 1fr; }
  }
</style>
