import { Anchor, Wrench, Archive, Layers, Compass } from "@lucide/astro";
import type { AstroComponent } from "@lucide/astro";

/**
 * Single source of truth for the /projects index and the featured cards on
 * the home page. `repo` drives the build-time GitHub stats lookup in
 * src/pages/projects.astro. Leave it undefined for projects with no repo
 * to look up.
 */
export interface Project {
  slug: string;
  title: string;
  description: string;
  href: string;
  icon: AstroComponent;
  repo?: string;
  featured?: boolean;
}

export const projects: Project[] = [
  {
    slug: "anchor",
    title: "Anchor",
    description: "A personal dashboard: curated news feed plus tiered learning paths with progress tracking.",
    href: "https://prjvvl.github.io/anchor/",
    icon: Anchor,
    repo: "prjvvl/anchor",
    featured: true,
  },
  {
    slug: "tools",
    title: "Tools",
    description: "A suite of everyday dev utilities: QR codes, JSON formatting, Base64, UUIDs, regex testing, and more.",
    href: "https://prjvvl.github.io/tools/",
    icon: Wrench,
    repo: "prjvvl/tools",
    featured: true,
  },
  {
    slug: "stash",
    title: "Stash",
    description: "A lightweight file and snippet manager for stashing things you want to find again.",
    href: "https://prjvvl.github.io/stash/",
    icon: Archive,
    repo: "prjvvl/stash",
    featured: true,
  },
  {
    slug: "trestle",
    title: "Trestle",
    description: "A GitHub Pages site-building kit that ships with deploy, SEO, and content already wired up. This site is built with it.",
    href: "https://prjvvl.github.io/trestle/",
    icon: Layers,
    repo: "prjvvl/trestle",
  },
  {
    slug: "explore",
    title: "Explore",
    description: "An earlier portfolio page, linking out to older projects like a Leetcode clone and a YouTube clone.",
    href: "https://prjvvl.github.io/explore/",
    icon: Compass,
    repo: "prjvvl/explore",
  },
];
