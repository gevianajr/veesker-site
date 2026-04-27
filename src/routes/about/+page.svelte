<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="About"
  description="Veesker is created and maintained by Geraldo Ferreira Viana Júnior — Senior Oracle Engineer with 14 years of experience building mission-critical PL/SQL, ERP, and APEX systems."
  path="/about"
/>

<section class="hero">
  <div class="container">
    <h1>About</h1>
    <p class="lead">The creator, the origin story, and where to reach me.</p>
  </div>
</section>

<section class="content">
  <div class="container narrow">

    <div class="creator-card">
      <img src="/geraldo-viana.jpg" alt="Geraldo Ferreira Viana Júnior" class="profile-photo" />
      <div class="creator-info">
        <h2>Geraldo Ferreira Viana Júnior</h2>
        <p class="role">Senior Oracle Engineer · Creator of Veesker</p>
        <div class="links">
          <a href="https://github.com/gevianajr" target="_blank" rel="noopener">GitHub @gevianajr</a>
          <a href="https://www.linkedin.com/in/geraldovianajr/" target="_blank" rel="noopener">LinkedIn</a>
          <a href="mailto:geraldo@veesker.cloud">geraldo@veesker.cloud</a>
        </div>
      </div>
    </div>

    <h2>The creator</h2>
    <p>
      Veesker is created and maintained by <strong>Geraldo Ferreira Viana Júnior</strong>, a Senior Oracle
      Engineer with 14 years of experience building mission-critical PL/SQL, ERP, and APEX systems for
      finance, retail, and supply-chain enterprises.
    </p>
    <p>
      I started designing Veesker in 2022 — based on years of accumulated frustration with the existing Oracle
      developer tooling. PL/SQL Developer is closed and Windows-only. SQL Developer is heavy and dated. DBeaver
      is generic. None of them treat Oracle 23ai as a first-class target, and none of them integrate AI in a
      way that's actually useful for database work.
    </p>
    <p>
      The bottleneck for years was never the vision. It was solo implementation velocity. In 2026, with Claude
      Code mature enough to act as a serious engineering collaborator, four years of design finally became a
      shipping product — without compromising architectural control.
    </p>

    <h2>What I'm doing now</h2>
    <ul>
      <li>Building Veesker as the Oracle 23ai studio I always wished existed</li>
      <li>Open-sourcing the codebase under Apache 2.0</li>
      <li>Available for senior Oracle / AI engineering roles, technical leadership, and selective consulting on Oracle 23ai + AI implementations</li>
    </ul>

    <h2>Connect</h2>
    <ul class="connect-list">
      <li><span class="lbl">GitHub</span> <a href="https://github.com/gevianajr" target="_blank" rel="noopener">@gevianajr</a></li>
      <li><span class="lbl">LinkedIn</span> <a href="https://www.linkedin.com/in/geraldovianajr/" target="_blank" rel="noopener">Geraldo Viana Jr</a></li>
      <li><span class="lbl">Email</span> <a href="mailto:geraldo@veesker.cloud">geraldo@veesker.cloud</a></li>
      <li><span class="lbl">Repo</span> <a href="https://github.com/gevianajr/veesker" target="_blank" rel="noopener">github.com/gevianajr/veesker</a></li>
    </ul>

    <h2>Trademark and licensing</h2>
    <p>
      "Veesker" and the Veesker sheep mascot are trademarks of Geraldo Ferreira Viana Júnior. The source code
      is open under <a href="https://github.com/gevianajr/veesker/blob/main/LICENSE" target="_blank" rel="noopener">Apache 2.0</a>,
      but the name and logo are not. See the
      <a href="https://github.com/gevianajr/veesker/blob/main/README.md#trademark-policy" target="_blank" rel="noopener">trademark policy</a>
      and <a href="https://github.com/gevianajr/veesker/blob/main/NOTICE" target="_blank" rel="noopener">NOTICE file</a> for details.
    </p>
    <p>
      For permission to use the Veesker name or mascot in any commercial or promotional context, contact
      <a href="mailto:geefatec@gmail.com">geefatec@gmail.com</a>.
    </p>

  </div>
</section>

<style>
  .hero {
    padding: 80px 0 40px;
    text-align: center;
  }
  .hero h1 {
    font-size: clamp(2rem, 5vw, 3rem);
    margin: 0 0 16px;
  }
  .lead {
    color: var(--text-muted);
    font-size: 1.1rem;
    margin: 0;
  }

  .content {
    padding: 40px 0 80px;
  }

  .narrow {
    max-width: 720px;
  }

  .creator-card {
    display: flex;
    gap: 24px;
    align-items: center;
    background: var(--bg-soft);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 28px;
    margin-bottom: 48px;
  }

  .profile-photo {
    width: 96px;
    height: 96px;
    border-radius: 50%;
    object-fit: cover;
    object-position: center top;
    flex-shrink: 0;
    border: 2px solid var(--border);
  }

  .creator-info h2 {
    margin: 0 0 4px;
    font-size: 1.3rem;
  }

  .role {
    color: var(--text-muted);
    font-size: 0.9rem;
    margin: 0 0 16px;
  }

  .links {
    display: flex;
    gap: 12px;
    flex-wrap: wrap;
  }

  .links a {
    font-size: 0.85rem;
    color: var(--accent-text);
    border: 1px solid var(--border);
    border-radius: 6px;
    padding: 4px 12px;
    text-decoration: none;
  }

  .links a:hover {
    background: var(--border);
    text-decoration: none;
  }

  .content h2 {
    font-size: 1.25rem;
    margin: 40px 0 12px;
  }

  .content p {
    color: var(--text-muted);
    line-height: 1.7;
    margin: 0 0 16px;
  }

  .content ul {
    color: var(--text-muted);
    padding-left: 1.5rem;
    line-height: 1.8;
  }

  .connect-list {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .connect-list li {
    display: flex;
    gap: 12px;
    font-size: 0.95rem;
    align-items: baseline;
  }

  .lbl {
    color: var(--text-muted);
    font-size: 0.8rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    min-width: 72px;
  }

  .content a {
    color: var(--accent-text);
  }
</style>
