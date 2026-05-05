# Orao Impact Foundation Website

A modern, clean, and impact-driven website for the Orao Impact Foundation — a tech-enabled nonprofit empowering communities across Africa through digital skills, community safety, and SME growth.

**Live site:** [GitHub Pages URL — configure in repository settings]

---

## Pages

| Page | File | Description |
|------|------|-------------|
| Home | `index.html` | Hero, impact stats, featured programs, testimonials, blog preview |
| About | `about.html` | Mission, vision, story, values, team, SDG alignment |
| Programs | `programs.html` | Detailed program pages with images, video embeds, filterable list |
| Blog | `blog.html` | Searchable, filterable blog listing with featured post |
| Post | `post.html` | Single post renderer (loads content dynamically from Markdown files) |
| Contact | `contact.html` | Contact form (mailto fallback), contact info, FAQ accordion |

---

## Project Structure

```
OraoImpact/
├── index.html           # Homepage
├── about.html           # About page
├── programs.html        # Programs page
├── blog.html            # Blog listing
├── post.html            # Single blog post renderer
├── contact.html         # Contact page
├── styles.css           # Main stylesheet (all pages)
├── script.js            # Main JavaScript (all pages)
├── assets/
│   └── images/          # Placeholder SVG images
│       ├── program-digital.svg
│       ├── program-safety.svg
│       ├── program-sme.svg
│       ├── blog-digital.svg
│       ├── blog-safety.svg
│       ├── blog-sme.svg
│       └── about-hero.svg
└── content/
    ├── posts.json       # Blog post manifest (index of all posts)
    └── posts/           # Markdown blog post files
        ├── digital-skills-new-literacy.md
        ├── mesafe-community-safety.md
        └── shopmon-smes-go-digital.md
```

---

## Adding a New Blog Post

### Step 1 — Create the Markdown file

Add a new `.md` file in `content/posts/`. The file should have YAML frontmatter at the top:

```markdown
---
title: Your Post Title Here
date: 2025-06-01
author: Author Name
tags: [Tag1, Tag2, Tag3]
cover: assets/images/your-cover-image.svg
excerpt: A one-sentence summary of the post shown on listing pages.
---

## Your First Heading

Post content goes here. Supported Markdown:

- **Bold text**, *italic text*
- [Links](https://example.com)
- Images: ![Alt text](assets/images/photo.jpg)
- Headings: ## H2, ### H3
- Lists (bullet and numbered)
- > Blockquotes
- `inline code` and code blocks
```

### Step 2 — Add the post to the manifest

Open `content/posts.json` and add a new entry. Posts are displayed in reverse chronological order (newest first):

```json
{
  "id": "your-post-slug",
  "title": "Your Post Title Here",
  "date": "2025-06-01",
  "author": "Author Name",
  "tags": ["Tag1", "Tag2", "Tag3"],
  "excerpt": "A one-sentence summary shown on listing pages.",
  "cover": "assets/images/your-cover-image.svg",
  "file": "content/posts/your-post-slug.md"
}
```

**Important:** The `"id"` must match the filename (without `.md`) and is used in URLs as `post.html?id=your-post-slug`.

---

## Adding or Updating a Program

Programs are defined directly in `programs.html`. To add a new program:

1. Copy an existing `<div class="program-detail-section">` block.
2. Update the `data-category` attribute (used by the filter buttons).
3. Add an `id` attribute for deep-linking (e.g., `id="newprogram"`).
4. Update the content: title, description, tags, meta items, and image.
5. Add a corresponding filter button in the `<div class="filter-bar">` section.
6. Update program card links in `index.html` if needed.

---

## Replacing Placeholder Assets

### Images

Replace the SVG files in `assets/images/` with real photographs or branded graphics. Recommended sizes:

| Image | Recommended size |
|-------|-----------------|
| Program images | 800 × 500 px |
| Blog cover images | 800 × 400 px |
| About hero | 1140 × 420 px |
| Team avatars | 200 × 200 px (square) |

Keep the same filenames, or update the references in `content/posts.json` and the HTML files.

### Video Embeds

The video placeholder sections in `programs.html` can be replaced with real YouTube embeds. Replace:

```html
<div class="video-placeholder" role="img" aria-label="...">
  ...
</div>
```

with a responsive YouTube iframe:

```html
<div style="aspect-ratio:16/9; border-radius:var(--radius); overflow:hidden">
  <iframe
    width="100%" height="100%"
    src="https://www.youtube.com/embed/YOUR_VIDEO_ID"
    title="Your video title"
    frameborder="0"
    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
    allowfullscreen
    loading="lazy">
  </iframe>
</div>
```

### Team Profiles

In `about.html`, replace the placeholder team cards with real names, roles, bios, and headshots:

```html
<article class="card team-card">
  <div class="team-avatar">
    <img src="assets/images/team-firstname.jpg" alt="Firstname Lastname headshot"/>
  </div>
  <p class="team-name">Firstname Lastname</p>
  <p class="team-role">Role Title</p>
  <p class="team-bio">Brief biography goes here.</p>
</article>
```

---

## Dark Mode

Dark mode is automatic based on the user's OS preference and can be toggled manually using the button in the navigation bar. The preference is saved in `localStorage` under the key `orao-theme`.

---

## Hosting on GitHub Pages

1. Go to **Settings → Pages** in this repository.
2. Set **Source** to `Deploy from a branch`.
3. Select `main` branch, `/ (root)` folder.
4. Save — the site will be live at `https://<username>.github.io/OraoImpact/`.

All asset paths use relative URLs and are compatible with GitHub Pages subdirectory hosting.

---

## Contact

**Email:** info@oraoimpact.org  
**Website:** [GitHub Pages URL]

---

© 2025 Orao Impact Foundation
