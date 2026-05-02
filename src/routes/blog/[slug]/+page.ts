import { error } from "@sveltejs/kit";
import type { PageLoad } from "./$types";
import { allPosts, findPost } from "$lib/blog/posts";

export const prerender = true;

export const load: PageLoad = async ({ params }) => {
  const post = findPost(params.slug);
  if (!post) throw error(404, "Post not found");
  const { Component, ...metadata } = post;
  return { metadata, Component };
};

export async function entries() {
  return allPosts.map((p) => ({ slug: p.slug }));
}
