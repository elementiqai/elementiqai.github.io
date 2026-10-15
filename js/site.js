const FONT_HREF =
  "https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@1&family=Outfit:wght@500;600;700;800&family=Plus+Jakarta+Sans:ital,wght@0,400;0,500;0,600;0,700;1,400;1,500&display=swap";

const PRODUCT = [
  ["whats-new.html", "What’s new", "New tools with step-by-step screenshots"],
  ["editor.html", "Design", "Visual drag and drop editor"],
  ["studio.html", "Studio", "AI assisted coding workspace"],
  ["preview.html", "Live preview", "Edit the rendered page"],
  ["widgets.html", "Widgets", "Layouts, content, and blocks"],
  ["woocommerce.html", "WooCommerce", "Design the shop. Woo sells"],
  ["pages.html", "Pages", "Create and open WordPress pages"],
];
const GUIDE = [
  ["install.html", "Install", "Add the plugin in WordPress"],
  ["start.html", "Getting started", "Your first page in Elementiq"],
  ["workflow.html", "Design vs Studio", "When to use each editor"],
  ["keys.html", "AI setup", "Connect a provider and API key"],
  ["help.html", "Help", "Guides and troubleshooting"],
  ["faq.html", "FAQ", "Common questions"],
];

function lockup() {
  return `<a class="brand" href="index.html" aria-label="Elementiq AI Web Builder">
    <img src="assets/brand/logo.svg" width="42" height="42" alt="">
    <span class="word"><strong>Elementiq</strong><em>AI Web Builder</em></span>
  </a>`;
}

function drop(label, items, here) {
  const links = items
    .map(
      ([h, l, s]) =>
        `<a href="${h}" class="${h === here ? "on" : ""}">${l}${s ? `<small>${s}</small>` : ""}</a>`
    )
    .join("");
  const on = items.some(([h]) => h === here) ? " on" : "";
  return `<div class="drop"><button type="button" class="${on.trim()}" aria-haspopup="true">${label}<span class="caret" aria-hidden="true"></span></button><div class="drop-menu">${links}</div></div>`;
}

function ensureHead() {
  if (!document.querySelector('link[href*="fonts.googleapis"][href*="Outfit"]')) {
    const pre = document.createElement("link");
    pre.rel = "preconnect";
    pre.href = "https://fonts.gstatic.com";
    pre.crossOrigin = "anonymous";
    document.head.appendChild(pre);
    const l = document.createElement("link");
    l.rel = "stylesheet";
    l.href = FONT_HREF;
    document.head.appendChild(l);
  }
  if (!document.querySelector(".grain")) {
    const g = document.createElement("div");
    g.className = "grain";
    document.body.prepend(g);
  }
}

(function mount() {
  ensureHead();
  const here = document.body.dataset.page || "index.html";
  const nav = document.getElementById("site-nav");
  if (nav) {
    nav.innerHTML = `${lockup()}
      <nav class="links">
        <a href="index.html" class="${here === "index.html" ? "on" : ""}">Home</a>
        ${drop("Product", PRODUCT, here)}
        ${drop("Guide", GUIDE, here)}
        <a href="features.html" class="${here === "features.html" ? "on" : ""}">Features</a>
        <a href="woocommerce.html" class="${here === "woocommerce.html" ? "on" : ""}">WooCommerce</a>
        <a href="about.html" class="${here === "about.html" ? "on" : ""}">About</a>
        <a href="contact.html" class="${here === "contact.html" ? "on" : ""}">Contact</a>
      </nav>
      <a class="btn btn-p nav-cta" href="install.html">Install Elementiq</a>
      <button class="btn btn-g" type="button" id="menu-btn" aria-label="Open menu"><svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg></button>`;

    nav.querySelectorAll(".drop").forEach((d) => {
      const btn = d.querySelector("button");
      btn?.addEventListener("click", (e) => {
        e.stopPropagation();
        nav.querySelectorAll(".drop").forEach((x) => x !== d && x.classList.remove("open"));
        d.classList.toggle("open");
      });
    });
    document.addEventListener("click", () => {
      nav.querySelectorAll(".drop").forEach((d) => d.classList.remove("open"));
    });

    const drawer = document.createElement("div");
    drawer.className = "drawer";
    drawer.id = "drawer";
    const group = (label, items) =>
      `<div class="drawer-group"><button type="button" class="drawer-toggle" aria-expanded="false">${label}</button><div class="drawer-sub" hidden>${items
        .map(([h, l]) => `<a href="${h}" class="${h === here ? "on" : ""}">${l}</a>`)
        .join("")}</div></div>`;
    drawer.innerHTML = `<div class="drawer-panel">
      <button class="btn btn-g drawer-close" type="button" id="drawer-close">Close</button>
      <a href="index.html" class="${here === "index.html" ? "on" : ""}">Home</a>
      ${group("Product", PRODUCT)}
      ${group("Guide", GUIDE)}
      <a href="features.html">Features</a>
      <a href="woocommerce.html">WooCommerce</a>
      <a href="about.html">About</a>
      <a href="contact.html">Contact</a>
      <a href="install.html">Install Elementiq</a>
      <a href="start.html">Start building</a>
    </div>`;
    document.body.appendChild(drawer);
    const closeGroups = () => {
      drawer.querySelectorAll(".drawer-group").forEach((groupEl) => {
        groupEl.classList.remove("is-open");
        const toggle = groupEl.querySelector(".drawer-toggle");
        const sub = groupEl.querySelector(".drawer-sub");
        if (toggle) toggle.setAttribute("aria-expanded", "false");
        if (sub) sub.hidden = true;
      });
    };
    const openDrawer = () => {
      closeGroups();
      drawer.classList.add("open");
    };
    const closeDrawer = () => {
      closeGroups();
      drawer.classList.remove("open");
    };
    document.getElementById("menu-btn")?.addEventListener("click", openDrawer);
    document.getElementById("drawer-close")?.addEventListener("click", closeDrawer);
    drawer.addEventListener("click", (e) => {
      const toggle = e.target.closest(".drawer-toggle");
      if (toggle) {
        e.preventDefault();
        const groupEl = toggle.closest(".drawer-group");
        const sub = groupEl?.querySelector(".drawer-sub");
        const willOpen = !!sub?.hidden;
        closeGroups();
        if (willOpen && groupEl && sub) {
          groupEl.classList.add("is-open");
          toggle.setAttribute("aria-expanded", "true");
          sub.hidden = false;
        }
        return;
      }
      if (e.target === drawer) closeDrawer();
    });

    window.addEventListener(
      "scroll",
      () => nav.classList.toggle("compact", window.scrollY > 24),
      { passive: true }
    );
  }

  const foot = document.getElementById("site-foot");
  if (foot) {
    foot.innerHTML = `<div class="foot-grid">
      <div class="foot-brand">${lockup()}
        <p>Elementiq is a powerful WordPress website builder that combines visual drag and drop design with AI assisted coding. It installs as a plugin and runs inside your WordPress dashboard.</p>
      </div>
      <div><h4>Product</h4>
        <a href="whats-new.html">What’s new</a>
        <a href="editor.html">Design</a>
        <a href="studio.html">Studio</a>
        <a href="preview.html">Live preview</a>
        <a href="widgets.html">Widgets</a>
        <a href="woocommerce.html">WooCommerce</a>
        <a href="pages.html">Pages</a>
        <a href="features.html">Features</a>
      </div>
      <div><h4>Guide</h4>
        <a href="install.html">Install</a>
        <a href="start.html">Getting started</a>
        <a href="workflow.html">Design vs Studio</a>
        <a href="keys.html">AI setup</a>
        <a href="help.html">Help</a>
        <a href="faq.html">FAQ</a>
      </div>
      <div><h4>In WordPress</h4>
        <a href="theme.html">Header and footer</a>
        <a href="whats-new.html#clone">Clone Website</a>
        <a href="whats-new.html#forms">Forms and SMTP</a>
        <a href="seo.html">SEO</a>
        <a href="security.html">Cybersecurity</a>
        <a href="files.html">File Manager</a>
        <a href="woocommerce.html">WooCommerce</a>
        <a href="about.html">About</a>
        <a href="contact.html">Contact</a>
      </div>
      <div><h4>Start</h4>
        <a href="install.html">Install Elementiq</a>
        <a href="start.html">Start building</a>
        <a href="contact.html">Contact us</a>
        <a href="studio.html">Open Studio</a>
      </div>
    </div>
    <div class="foot-bar">
      <span>Elementiq · WordPress plugin</span>
      <nav>
        <a href="index.html">Home</a>
        <a href="help.html">Help</a>
        <a href="faq.html">FAQ</a>
        <a href="woocommerce.html">WooCommerce</a>
        <a href="install.html">Install</a>
        <a href="contact.html">Contact</a>
      </nav>
      <span>Works inside WordPress</span>
    </div>`;
  }

  const io = new IntersectionObserver(
    (ents) => {
      ents.forEach((e) => {
        if (e.isIntersecting) e.target.classList.add("in");
      });
    },
    { threshold: 0.12 }
  );
  document.querySelectorAll(".onscroll").forEach((n) => io.observe(n));

  document.querySelectorAll(".stat[data-count]").forEach((el) => {
    const target = Number(el.dataset.count || 0);
    const strong = el.querySelector("strong");
    if (!strong) return;
    const run = () => {
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 900);
        strong.textContent = String(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    const so = new IntersectionObserver((ents) => {
      if (ents[0]?.isIntersecting) {
        run();
        so.disconnect();
      }
    });
    so.observe(el);
  });

  mountChat();
  bindContactForms();
})();

function topicOptions() {
  return `<option value="" disabled selected>Choose a topic</option>
    <option value="design">Design editor</option>
    <option value="studio">Studio and AI</option>
    <option value="install">Install and activation</option>
    <option value="keys">AI setup and API keys</option>
    <option value="billing">Account or licensing</option>
    <option value="other">Something else</option>`;
}

function mountChat() {
  if (document.querySelector(".chat-fab")) return;
  const wrap = document.createElement("div");
  wrap.className = "chat-dock";
  wrap.innerHTML = `
    <button class="chat-fab" type="button" id="chat-fab" aria-expanded="false" aria-controls="chat-panel" aria-label="Open contact chat">
      <img src="assets/brand/wordpress.svg" width="54" height="54" alt="">
    </button>
    <div class="chat-panel" id="chat-panel" role="dialog" aria-labelledby="chat-title">
      <div class="chat-head">
        <img src="assets/brand/wordpress.svg" width="32" height="32" alt="">
        <div>
          <strong id="chat-title">Contact Elementiq</strong>
          <span>WordPress plugin support</span>
        </div>
        <button class="chat-close" type="button" id="chat-close" aria-label="Close chat">×</button>
      </div>
      <div class="chat-body">
        <p class="lede">Ask about Design, Studio, install, or AI setup.</p>
        <form class="chat-form" id="chat-form" novalidate>
          <div class="chat-pair">
            <div class="form-row">
              <label for="chat-name">Name</label>
              <input id="chat-name" name="name" type="text" autocomplete="name" placeholder="Your name" required>
            </div>
            <div class="form-row">
              <label for="chat-email">Email</label>
              <input id="chat-email" name="email" type="email" autocomplete="email" placeholder="you@example.com" required>
            </div>
          </div>
          <div class="form-row">
            <label for="chat-topic">Topic</label>
            <select id="chat-topic" name="topic" required>${topicOptions()}</select>
          </div>
          <div class="form-row">
            <label for="chat-message">Message</label>
            <textarea id="chat-message" name="message" rows="2" placeholder="How can we help?" required></textarea>
          </div>
          <button class="btn btn-p" type="submit">Send message</button>
          <p class="form-status" hidden></p>
        </form>
        <a class="chat-link" href="contact.html#contact-form">Open the full contact form</a>
      </div>
    </div>`;
  document.body.appendChild(wrap);

  const fab = document.getElementById("chat-fab");
  const panel = document.getElementById("chat-panel");
  const closeBtn = document.getElementById("chat-close");
  const setOpen = (open) => {
    panel.classList.toggle("open", open);
    fab.setAttribute("aria-expanded", String(open));
  };
  fab.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(!panel.classList.contains("open"));
  });
  closeBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    setOpen(false);
  });
  panel.addEventListener("click", (e) => e.stopPropagation());
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") setOpen(false);
  });
  document.querySelectorAll("[data-open-chat]").forEach((btn) => {
    btn.addEventListener("click", () => setOpen(true));
  });
  panel.querySelector(".chat-link")?.addEventListener("click", (e) => {
    if (document.body.dataset.page === "contact.html") {
      e.preventDefault();
      setOpen(false);
      document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  });
}

function bindContactForms() {
  const done = "Thanks. Your message is ready. We will reply by email.";
  const fail = "Please add your name, a valid email, a topic, and a message.";
  const emailOk = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  const handle = (form) => {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = String(data.get("name") || "").trim();
      const email = String(data.get("email") || "").trim();
      const topic = String(data.get("topic") || "").trim();
      const message = String(data.get("message") || "").trim();
      const status = form.querySelector(".form-status");
      if (!name || !emailOk(email) || !topic || !message) {
        if (status) {
          status.hidden = false;
          status.classList.add("err");
          status.textContent = fail;
        }
        return;
      }
      form.classList.add("is-sent");
      if (status) {
        status.hidden = false;
        status.classList.remove("err");
        status.textContent = done;
      }
    });
  };
  document.querySelectorAll("#contact-form, #chat-form").forEach(handle);
}
