<script lang="ts">
  import Seo from "$lib/seo.svelte";
</script>

<Seo
  title="You're signed in"
  description="Authentication successful. You can close this tab and return to Veesker."
  path="/auth/done"
/>

<section class="auth-page">
  <div class="card">
    <div class="icon success" aria-hidden="true">✓</div>
    <h1>You're signed in</h1>
    <p class="message">You can close this tab and return to Veesker.</p>
    <p class="sub">Your Cloud features are now active.</p>
  </div>
</section>

<style>
  .auth-page {
    min-height: calc(100vh - 340px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 60px 24px;
  }
  .card {
    text-align: center;
    max-width: 420px;
    width: 100%;
    padding: 48px 40px;
    border: 1px solid var(--border);
    border-radius: 16px;
    background: rgba(255, 255, 255, 0.02);
  }
  .icon {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    font-weight: 700;
    margin-bottom: 24px;
  }
  .icon.success {
    background: rgba(52, 199, 89, 0.14);
    border: 1px solid rgba(52, 199, 89, 0.32);
    color: #4cd964;
  }
  h1 {
    font-size: 28px;
    font-weight: 700;
    margin: 0 0 14px;
  }
  .message {
    color: var(--text-muted);
    font-size: 15px;
    line-height: 1.6;
    margin: 0 0 8px;
  }
  .sub {
    color: var(--text-muted);
    font-size: 13.5px;
    line-height: 1.6;
    margin: 0;
    opacity: 0.7;
  }
</style>
