document.documentElement.classList.add("js");

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- nav: scrolled state, mobile menu, active link ---------- */
const nav = document.querySelector(".nav");
const toggle = document.querySelector(".nav__toggle");
const links = document.getElementById("nav-links");

const setMenu = (open) => {
  toggle.setAttribute("aria-expanded", String(open));
  toggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  links.classList.toggle("is-open", open);
};

toggle.addEventListener("click", () => setMenu(toggle.getAttribute("aria-expanded") !== "true"));
links.addEventListener("click", (e) => { if (e.target.closest("a")) setMenu(false); });
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const navLinks = [...links.querySelectorAll('a[href^="#"]:not(.btn)')];
const sectionFor = {
  home: "home", about: "about", skills: "skills", projects: "projects",
  education: "education", learning: "education", resume: "contact", contact: "contact",
};
const spy = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const target = sectionFor[entry.target.id];
      navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${target}`));
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

/* ---------- reveal on scroll ---------- */
const revealables = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  revealables.forEach((el) => el.classList.add("is-in"));
} else {
  // stagger siblings that enter together
  revealables.forEach((el) => {
    const siblings = [...el.parentElement.children].filter((c) => c.classList.contains("reveal"));
    el.style.setProperty("--d", `${Math.min(siblings.indexOf(el), 5) * 0.07}s`);
  });
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-in");
        io.unobserve(entry.target);
      });
    },
    { rootMargin: "0px 0px -8% 0px", threshold: 0.08 }
  );
  revealables.forEach((el) => io.observe(el));
}

/* ---------- project detail dialogs ---------- */
document.querySelectorAll("[data-open]").forEach((btn) => {
  const dialog = document.getElementById(btn.dataset.open);
  if (!dialog) return;
  btn.addEventListener("click", () => {
    dialog.showModal();
    document.body.classList.add("modal-open");
  });
});
document.querySelectorAll("dialog.modal").forEach((dialog) => {
  dialog.addEventListener("close", () => document.body.classList.remove("modal-open"));
  dialog.addEventListener("click", (e) => {
    // close on backdrop click or close button
    if (e.target === dialog || e.target.closest("[data-close]")) dialog.close();
  });
});

/* ---------- contact form ----------
   Static site, so the form opens the visitor's email app with everything
   filled in. To send from the page instead, point the form at a service
   like Formspree and remove this handler. */
const form = document.getElementById("contact-form");
const note = form.querySelector(".form__note");

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;
  form.querySelectorAll("input, textarea").forEach((field) => {
    const ok = field.checkValidity() && field.value.trim() !== "";
    field.closest(".field").classList.toggle("is-invalid", !ok);
    if (!ok) valid = false;
  });
  if (!valid) {
    note.textContent = "Please fill in your name, a valid email, and a message.";
    note.classList.add("is-error");
    return;
  }
  const { name, email, message } = Object.fromEntries(new FormData(form));
  const subject = `Portfolio message from ${name.trim()}`;
  const body = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
  window.location.href =
    `mailto:cuddaphajanci@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.classList.remove("is-error");
  note.textContent = "Your email app should open now — thanks for reaching out!";
});
form.addEventListener("input", (e) => e.target.closest(".field")?.classList.remove("is-invalid"));

document.getElementById("year").textContent = new Date().getFullYear();

/* ---------- hero dot field ----------
   A quiet grid of points; the ones near a moving "centroid" (your cursor,
   or a slow drift when idle) lean in and pick up the accent colour —
   a small nod to clustering. */
(() => {
  const canvas = document.querySelector(".hero__field");
  const ctx = canvas.getContext("2d");
  const hero = canvas.parentElement;
  const GAP = 26;
  const RADIUS = 170;
  let w = 0, h = 0, dpr = 1, points = [], visible = true, raf = 0, t = 0;
  const pointer = { x: 0, y: 0, active: false, lastMove: 0 };
  const centroid = { x: 0, y: 0 };
  let colors = {};

  const readColors = () => {
    const css = getComputedStyle(document.documentElement);
    colors = { dot: css.getPropertyValue("--muted").trim(), accent: css.getPropertyValue("--accent").trim() };
  };

  const resize = () => {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = hero.clientWidth;
    h = hero.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    points = [];
    for (let y = GAP / 2; y < h; y += GAP) for (let x = GAP / 2; x < w; x += GAP) points.push({ x, y });
    if (!centroid.x) { centroid.x = w * 0.72; centroid.y = h * 0.42; }
    draw();
  };

  const draw = () => {
    ctx.clearRect(0, 0, w, h);
    for (const p of points) {
      const dx = centroid.x - p.x;
      const dy = centroid.y - p.y;
      const dist = Math.hypot(dx, dy);
      const k = reduceMotion ? 0 : Math.max(0, 1 - dist / RADIUS);
      const pull = k * k * 10;
      const x = p.x + (dist ? (dx / dist) * pull : 0);
      const y = p.y + (dist ? (dy / dist) * pull : 0);
      ctx.globalAlpha = 0.28 + k * 0.6;
      ctx.fillStyle = k > 0.18 ? colors.accent : colors.dot;
      ctx.beginPath();
      ctx.arc(x, y, 1.1 + k * 1.3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  };

  const tick = () => {
    t += 0.004;
    const idle = !pointer.active || performance.now() - pointer.lastMove > 2500;
    const tx = idle ? w * (0.68 + 0.18 * Math.sin(t * 1.3)) : pointer.x;
    const ty = idle ? h * (0.45 + 0.2 * Math.sin(t * 0.9 + 1)) : pointer.y;
    centroid.x += (tx - centroid.x) * 0.06;
    centroid.y += (ty - centroid.y) * 0.06;
    draw();
    raf = visible ? requestAnimationFrame(tick) : 0;
  };

  readColors();
  resize();
  window.addEventListener("resize", resize);
  window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => { readColors(); draw(); });

  if (reduceMotion) return;

  hero.addEventListener("pointermove", (e) => {
    const r = hero.getBoundingClientRect();
    pointer.x = e.clientX - r.left;
    pointer.y = e.clientY - r.top;
    pointer.active = true;
    pointer.lastMove = performance.now();
  });
  hero.addEventListener("pointerleave", () => { pointer.active = false; });

  new IntersectionObserver(([entry]) => {
    visible = entry.isIntersecting;
    if (visible && !raf) raf = requestAnimationFrame(tick);
  }).observe(hero);
})();
