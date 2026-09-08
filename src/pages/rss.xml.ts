import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { siteConfig } from "../site.config";
import { isPublished } from "../lib/posts";
import { withBase } from "../lib/url";

export async function GET(context: APIContext) {
  const posts = (await getCollection("posts", isPublished)).sort(
    (a, b) => b.data.date.valueOf() - a.data.date.valueOf(),
  );

  return rss({
    title: siteConfig.name,
    description: siteConfig.description,
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.date,
      link: withBase(`/blog/${post.id}/`),
    })),
  });
}
