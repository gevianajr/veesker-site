<script lang="ts">
  import Seo from "$lib/seo.svelte";
  import { page } from "$app/stores";

  const messages: Record<string, string> = {
    expired: "This sign-in link has expired.",
    invalid: "This sign-in link is invalid or has already been used.",
  };

  let reason = $derived($page.url.searchParams.get("reason") ?? "invalid");
  let message = $derived(messages[reason] ?? messages.invalid);
</script>

<Seo
  title="Sign-in link invalid"
  description="This sign-in link is invalid or has expired. Open Veesker and request a new link."
  path="/auth/error"
/>

<section class="auth-page">
  <div class="card">
    <div class="icon warning" aria-hidden="true">⚠</div>
    <h1>Sign-in link invalid</h1>
    <p class="message">{message}</p>
    <p class="sub">Open Veesker and request a new link.</p>
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
    margin-bottom: 24px;
  }
  .icon.warning {
    background: rgba(255, 159, 10, 0.14);
    border: 1px solid rgba(255, 159, 10, 0.32);
    color: #ff9f0a;
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
