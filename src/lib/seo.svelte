<script lang="ts">
  type Props = {
    title: string;
    description: string;
    path: string;
    /** Absolute or path-relative URL (e.g. "/datamap-hero.png" → "https://veesker.cloud/datamap-hero.png"). */
    image?: string;
    imageAlt?: string;
  };

  let {
    title,
    description,
    path,
    image = "/og-image.png",
    imageAlt = "Veesker — Oracle IDE for 9i through 26ai",
  }: Props = $props();

  const siteName = "Veesker";
  const fullTitle = title === siteName ? title : `${title} — ${siteName}`;
  const url = `https://veesker.cloud${path}`;
  const absoluteImage = image.startsWith("http") ? image : `https://veesker.cloud${image}`;
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
  <meta property="og:image" content={absoluteImage} />
  <meta property="og:image:width" content="1200" />
  <meta property="og:image:height" content="630" />
  <meta property="og:image:alt" content={imageAlt} />
  <meta property="og:locale" content="en_US" />

  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={absoluteImage} />
  <meta name="twitter:image:alt" content={imageAlt} />
</svelte:head>
