/* ===================================================
   Orao Impact Foundation — Main JavaScript
   =================================================== */

/* ── 1. DARK MODE ─────────────────────────────────── */
const html = document.documentElement;
const THEME_KEY = 'orao-theme';

function setTheme(theme) {
  html.setAttribute('data-theme', theme);
  localStorage.setItem(THEME_KEY, theme);
}

function initTheme() {
  const saved = localStorage.getItem(THEME_KEY);
  const preferred = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  setTheme(saved || preferred);
}

initTheme();

document.addEventListener('DOMContentLoaded', () => {
  /* ── Dark toggle ── */
  document.querySelectorAll('[data-dark-toggle]').forEach((btn) => {
    btn.setAttribute('aria-label', 'Toggle dark mode');
    btn.addEventListener('click', () => {
      setTheme(html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });
  });

  /* ── Mobile nav ── */
  const toggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  toggle?.addEventListener('click', () => {
    const expanded = toggle.getAttribute('aria-expanded') === 'true';
    toggle.setAttribute('aria-expanded', String(!expanded));
    navLinks?.classList.toggle('open');
  });

  document.querySelectorAll('.nav-links a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks?.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    });
  });

  /* Close nav when clicking outside */
  document.addEventListener('click', (e) => {
    if (navLinks?.classList.contains('open') && !e.target.closest('.nav')) {
      navLinks.classList.remove('open');
      toggle?.setAttribute('aria-expanded', 'false');
    }
  });

  /* ── Active nav link ── */
  const currentPath = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a').forEach((a) => {
    const href = a.getAttribute('href') || '';
    if (href === currentPath || (currentPath === 'index.html' && href === './') || href === `./${currentPath}`) {
      a.classList.add('active');
    }
  });

  /* ── Counter animation ── */
  const counters = document.querySelectorAll('.counter');
  const counterObserver = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const target = Number(el.dataset.target || 0);
      const suffix = el.dataset.suffix || '+';
      let current = 0;
      const duration = 1600;
      const step = Math.max(1, Math.round(target / (duration / 16)));

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        el.textContent = `${target}${suffix}`;
        obs.unobserve(el);
        return;
      }

      const tick = () => {
        current = Math.min(current + step, target);
        el.textContent = `${current}${suffix}`;
        if (current < target) requestAnimationFrame(tick);
      };
      tick();
      obs.unobserve(el);
    });
  }, { threshold: 0.4 });

  counters.forEach((c) => counterObserver.observe(c));

  /* ── Scroll reveal ── */
  const reveals = document.querySelectorAll('.reveal');
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches && reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach((el) => revealObserver.observe(el));
  } else {
    reveals.forEach((el) => el.classList.add('visible'));
  }

  /* ── FAQ accordion ── */
  document.querySelectorAll('.faq-question').forEach((btn) => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item.open').forEach((i) => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });

  /* ── Program filter ── */
  const filterBtns = document.querySelectorAll('.filter-btn');
  const programItems = document.querySelectorAll('[data-category]');
  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      programItems.forEach((item) => {
        const show = filter === 'all' || item.dataset.category === filter;
        item.style.display = show ? '' : 'none';
      });
    });
  });

  /* ── Contact form validation ── */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }

  /* ── Newsletter form ── */
  document.querySelectorAll('.newsletter').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('input[type="email"]');
      if (input?.value) {
        input.value = '';
        const btn = form.querySelector('button');
        if (btn) { btn.textContent = 'Subscribed! ✓'; btn.disabled = true; }
      }
    });
  });

  /* ── Smooth scroll for anchor links ── */
  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
});

/* ── Contact form handler ─────────────────────────── */
function handleContactSubmit(e) {
  e.preventDefault();
  const form = e.target;
  let valid = true;

  /* Validate required fields */
  form.querySelectorAll('[required]').forEach((field) => {
    const group = field.closest('.form-group');
    group?.classList.remove('has-error');
    if (!field.value.trim()) {
      group?.classList.add('has-error');
      valid = false;
    }
  });

  /* Validate email */
  const emailField = form.querySelector('[type="email"]');
  if (emailField && emailField.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailField.value)) {
    emailField.closest('.form-group')?.classList.add('has-error');
    valid = false;
  }

  if (!valid) return;

  /* Build mailto fallback */
  const name    = form.querySelector('[name="name"]')?.value || '';
  const email   = form.querySelector('[name="email"]')?.value || '';
  const subject = form.querySelector('[name="subject"]')?.value || 'General Inquiry';
  const message = form.querySelector('[name="message"]')?.value || '';

  const mailto = `mailto:info@oraoimpact.org?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`)}`;

  /* Show success message */
  const successEl = form.querySelector('.form-success');
  if (successEl) { successEl.classList.add('visible'); }

  /* Open mail client */
  window.location.href = mailto;

  /* Reset form */
  setTimeout(() => {
    form.reset();
    if (successEl) successEl.classList.remove('visible');
  }, 5000);
}

/* ── Tiny Markdown parser (for blog posts) ────────── */
function parseMarkdown(md) {
  if (!md) return '';
  let html = md
    /* Escape HTML first */
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    /* Headings */
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    /* Bold & italic */
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    /* Blockquote */
    .replace(/^&gt; (.+)$/gm, '<blockquote>$1</blockquote>')
    /* Inline code */
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    /* Links */
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" rel="noopener">$1</a>')
    /* Images */
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<img src="$2" alt="$1" loading="lazy">')
    /* Unordered lists */
    .replace(/^\s*[-*] (.+)$/gm, '<li>$1</li>')
    /* Ordered lists */
    .replace(/^\s*\d+\. (.+)$/gm, '<li>$1</li>');

  /* Wrap consecutive <li> in <ul> */
  html = html.replace(/(<li>[\s\S]+?<\/li>)(\n?(?!<li>))/g, (match) => `<ul>${match}</ul>`);

  /* Code blocks */
  html = html.replace(/```[\w]*\n([\s\S]+?)```/g, '<pre><code>$1</code></pre>');

  /* Paragraphs: blank-line-separated blocks not already wrapped in block elements */
  const blockTags = ['<h1', '<h2', '<h3', '<ul', '<ol', '<li', '<blockquote', '<pre', '<img'];
  const lines = html.split('\n');
  const result = [];
  let buffer = '';

  const flushBuffer = () => {
    const t = buffer.trim();
    if (t) {
      const isBlock = blockTags.some((tag) => t.startsWith(tag));
      result.push(isBlock ? t : `<p>${t}</p>`);
    }
    buffer = '';
  };

  lines.forEach((line) => {
    if (line.trim() === '') { flushBuffer(); } else { buffer += (buffer ? ' ' : '') + line; }
  });
  flushBuffer();

  return result.join('\n');
}

/* ── Blog post loader ─────────────────────────────── */
async function loadPost(postId) {
  const container = document.getElementById('post-content');
  if (!container) return;

  /* Determine base path for relative asset refs */
  const basePath = getBasePath();

  /* Load manifest */
  let posts = [];
  try {
    const res = await fetch(`${basePath}content/posts.json`);
    if (!res.ok) throw new Error('manifest not found');
    posts = await res.json();
  } catch {
    container.innerHTML = '<p class="post-loading">Could not load post manifest.</p>';
    return;
  }

  const meta = posts.find((p) => p.id === postId);
  if (!meta) {
    container.innerHTML = '<p class="post-loading">Post not found.</p>';
    return;
  }

  /* Render metadata */
  renderPostMeta(meta, basePath);

  /* Load markdown content */
  try {
    const res = await fetch(`${basePath}${meta.file}`);
    if (!res.ok) throw new Error('file not found');
    const mdText = await res.text();
    /* Strip frontmatter */
    const body = mdText.replace(/^---[\s\S]+?---\n/, '');
    container.innerHTML = parseMarkdown(body);
    container.classList.add('animate-in');
  } catch {
    container.innerHTML = '<p class="post-loading">Could not load post content.</p>';
  }

  /* Related posts */
  renderRelatedPosts(posts, meta, basePath);
}

function renderPostMeta(meta, basePath) {
  /* Title */
  const titleEl = document.getElementById('post-title');
  if (titleEl) titleEl.textContent = meta.title;
  document.title = `${meta.title} — Orao Impact Foundation`;

  /* Tags */
  const tagsEl = document.getElementById('post-tags');
  if (tagsEl && meta.tags) {
    tagsEl.innerHTML = meta.tags.map((t) => `<span class="tag">${t}</span>`).join('');
  }

  /* Author & date */
  const authorEl = document.getElementById('post-author-name');
  if (authorEl) authorEl.textContent = meta.author || 'Orao Impact Team';
  const dateEl = document.getElementById('post-date');
  if (dateEl) {
    dateEl.textContent = formatDate(meta.date);
    dateEl.setAttribute('datetime', meta.date);
  }

  /* Cover image */
  const coverEl = document.getElementById('post-cover-img');
  if (coverEl && meta.cover) {
    coverEl.src = `${basePath}${meta.cover}`;
    coverEl.alt = meta.title;
  }

  /* OG / SEO */
  if (meta.excerpt) {
    document.querySelector('meta[name="description"]')?.setAttribute('content', meta.excerpt);
  }
}

function renderRelatedPosts(posts, current, basePath) {
  const container = document.getElementById('related-posts');
  if (!container) return;
  const related = posts.filter((p) => p.id !== current.id && p.tags?.some((t) => current.tags?.includes(t))).slice(0, 3);
  if (!related.length) { container.closest('section')?.remove(); return; }
  container.innerHTML = related.map((p) => buildBlogCard(p, basePath)).join('');
}

/* ── Blog listing loader ──────────────────────────── */
async function loadBlogListing() {
  const grid = document.getElementById('blog-grid');
  const featuredWrap = document.getElementById('featured-post-wrap');
  if (!grid) return;

  const basePath = getBasePath();

  let posts = [];
  try {
    const res = await fetch(`${basePath}content/posts.json`);
    if (!res.ok) throw new Error();
    posts = await res.json();
  } catch {
    grid.innerHTML = '<div class="blog-empty"><p>Could not load posts.</p></div>';
    return;
  }

  /* Newest first */
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  /* Featured post */
  if (featuredWrap && posts.length) {
    const featured = posts[0];
    featuredWrap.innerHTML = `
      <a href="post.html?id=${featured.id}" class="blog-featured reveal">
        <div class="blog-featured-img">
          <img src="${basePath}${featured.cover}" alt="${featured.title}" loading="lazy">
        </div>
        <div class="blog-featured-body">
          <span class="eyebrow">Featured Post</span>
          <div class="blog-card-tags" style="margin-bottom:.6rem">
            ${(featured.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}
          </div>
          <h2>${featured.title}</h2>
          <p>${featured.excerpt}</p>
          <div class="blog-card-meta">
            <time datetime="${featured.date}">${formatDate(featured.date)}</time>
            <span>· ${featured.author || 'Orao Team'}</span>
          </div>
          <span class="program-card-link" style="margin-top:.75rem">Read article →</span>
        </div>
      </a>`;
  }

  /* Tag list */
  const allTags = [...new Set(posts.flatMap((p) => p.tags || []))];
  const tagContainer = document.getElementById('tag-filters');
  if (tagContainer) {
    tagContainer.innerHTML = allTags.map((t) =>
      `<button class="tag-filter-btn" data-tag="${t}">${t}</button>`
    ).join('');
    tagContainer.querySelectorAll('.tag-filter-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        btn.classList.toggle('active');
        filterBlogGrid(posts, basePath);
      });
    });
  }

  /* Search */
  const searchInput = document.getElementById('blog-search-input');
  searchInput?.addEventListener('input', () => filterBlogGrid(posts, basePath));
  document.getElementById('blog-search-btn')?.addEventListener('click', () => filterBlogGrid(posts, basePath));

  /* Render listing (skip featured) */
  renderBlogGrid(posts.slice(1), grid, basePath);
}

function filterBlogGrid(posts, basePath) {
  const grid = document.getElementById('blog-grid');
  if (!grid) return;

  const activeTags = [...document.querySelectorAll('.tag-filter-btn.active')].map((b) => b.dataset.tag);
  const query = document.getElementById('blog-search-input')?.value.toLowerCase().trim() || '';

  const filtered = posts.filter((p) => {
    const matchTag  = !activeTags.length || activeTags.some((t) => (p.tags || []).includes(t));
    const matchText = !query || p.title.toLowerCase().includes(query) || p.excerpt.toLowerCase().includes(query);
    return matchTag && matchText;
  });

  renderBlogGrid(filtered, grid, basePath);
}

function renderBlogGrid(posts, grid, basePath) {
  if (!posts.length) {
    grid.innerHTML = '<div class="blog-empty"><p>No posts found matching your search.</p></div>';
    return;
  }
  grid.innerHTML = posts.map((p) => buildBlogCard(p, basePath)).join('');
}

function buildBlogCard(p, basePath) {
  return `
    <a href="${basePath}post.html?id=${p.id}" class="card blog-card reveal">
      <div class="blog-card-img">
        <img src="${basePath}${p.cover}" alt="${p.title}" loading="lazy">
      </div>
      <div class="blog-card-body">
        <div class="blog-card-meta">
          <time datetime="${p.date}">${formatDate(p.date)}</time>
          <span>· ${p.author || 'Orao Team'}</span>
        </div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <div class="blog-card-tags">
          ${(p.tags || []).map((t) => `<span class="tag">${t}</span>`).join('')}
        </div>
      </div>
    </a>`;
}

/* ── Helpers ──────────────────────────────────────── */
function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

function getBasePath() {
  /* All HTML pages are at the repo root alongside content/ and assets/,
     so relative paths are always resolved from the same directory. */
  return './';
}

function getQueryParam(name) {
  return new URLSearchParams(location.search).get(name);
}

/* ── Init page-specific logic ─────────────────────── */
document.addEventListener('DOMContentLoaded', () => {
  const page = location.pathname.split('/').pop() || 'index.html';

  if (page === 'blog.html') {
    loadBlogListing();
  }

  if (page === 'post.html') {
    const id = getQueryParam('id');
    if (id) loadPost(id);
    else document.getElementById('post-content').innerHTML = '<p class="post-loading">No post ID provided.</p>';
  }
});
