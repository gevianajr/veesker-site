import type { Component } from "svelte";

export type PostKind = "deep-dive" | "manifesto";
export type PostLang = "en" | "pt";

export type PostMetadata = {
  title: string;
  description: string;
  date: string;
  slug: string;
  lang: PostLang;
  kind: PostKind;
  tags: string[];
  translation_slug?: string;
  hero?: string;
  read_minutes?: number;
};

export type PostSummary = PostMetadata & {
  words: number;
};

export type PostFull = PostSummary & {
  Component: Component;
};

const modules = import.meta.glob<{ metadata: PostMetadata; default: Component }>(
  "/src/posts/*.md",
  { eager: true },
);

function wordCount(file: { metadata: PostMetadata }): number {
  return file.metadata.read_minutes != null ? file.metadata.read_minutes * 200 : 800;
}

export const allPostsFull: PostFull[] = Object.values(modules)
  .map((mod) => ({
    ...mod.metadata,
    words: wordCount(mod),
    Component: mod.default,
  }))
  .sort((a, b) => b.date.localeCompare(a.date));

export const allPosts: PostSummary[] = allPostsFull.map(({ Component, ...rest }) => rest);

export function postsByLang(lang: PostLang): PostSummary[] {
  return allPosts.filter((p) => p.lang === lang);
}

export function findPost(slug: string): PostFull | undefined {
  return allPostsFull.find((p) => p.slug === slug);
}

export function readMinutes(words: number): number {
  return Math.max(1, Math.round(words / 200));
}
