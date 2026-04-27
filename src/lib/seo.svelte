<script lang="ts">
  type Props = {
    title: string;
    description: string;
    path: string;
    image?: string;
  };

  let {
    title,
    description,
    path,
    image = "https://veesker.cloud/og-image.png",
  }: Props = $props();

  const siteName = "Veesker";
  const fullTitle = title === siteName ? title : `${title} — ${siteName}`;
  const url = `https://veesker.cloud${path}`;
</script>

<svelte:head>
  <title>{fullTitle}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={url} />
  <meta name="robots" content="index, follow, max-image-preview:large" />

  <meta property="og:type" content="website" />
  <meta property="og:site_name" content={siteName} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:image" content={image} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content="Veesker — Oracle IDE for 9i through 26ai" />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content="Veesker — Oracle IDE for 9i through 26ai" />
</svelte:head>
