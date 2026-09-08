---
title: "Rebuilding this as a hub"
description: "Why I pulled Anchor, Stash, Tools, Trestle, and Explore under one roof."
date: 2026-09-08
tags: ["meta"]
---

I had a handful of small projects scattered across separate GitHub Pages sites:
[Anchor](https://prjvvl.github.io/anchor/), [Stash](https://prjvvl.github.io/stash/),
[Tools](https://prjvvl.github.io/tools/), and [Trestle](https://prjvvl.github.io/trestle/),
plus an older [Explore](https://prjvvl.github.io/explore/) page. Each lived at
`prjvvl.github.io/<name>/`, worked fine, but had no shared front door.

This site is that front door: a `prjvvl.github.io` repo, publishing at the root
of the domain, indexing everything else. It's built with [Trestle](https://prjvvl.github.io/trestle/)
(the same site-building kit that powers Tools and Stash), so it inherits the
same deploy pipeline, design tokens, and Markdown-based content out of the box.

More will land here over time: more posts, and a few extras beyond the basics
that are still in progress.
