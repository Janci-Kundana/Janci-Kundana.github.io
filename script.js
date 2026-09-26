document.documentElement.classList.add("js");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- nav ---------- */
const nav = document.querySelector(".nav");
const onScroll = () => nav.classList.toggle("is-scrolled", window.scrollY > 8);
onScroll();
window.addEventListener("scroll", onScroll, { passive: true });

const navLinks = [...document.querySelectorAll(".nav__links a")];
const navFor = { projects: "projects", education: "education", tools: "tools", resume: "contact", contact: "contact" };
const spy = new IntersectionObserver(
  (entries) => entries.forEach((e) => {
    if (!e.isIntersecting) return;
    const id = navFor[e.target.id];
    navLinks.forEach((a) => a.classList.toggle("is-active", a.getAttribute("href") === `#${id}`));
  }),
  { rootMargin: "-45% 0px -50% 0px" }
);
document.querySelectorAll("main section[id]").forEach((s) => spy.observe(s));

/* ---------- reveal ---------- */
const reveals = document.querySelectorAll(".reveal");
if (reduceMotion || !("IntersectionObserver" in window)) {
  reveals.forEach((el) => el.classList.add("is-in"));
} else {
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (!e.isIntersecting) return;
      e.target.classList.add("is-in");
      io.unobserve(e.target);
    }),
    { rootMargin: "0px 0px -8% 0px" }
  );
  reveals.forEach((el) => io.observe(el));
}

/* ---------- project dialogs ---------- */
const openDialog = (id) => {
  const d = document.getElementById(id);
  if (!d) return;
  d.showModal();
  document.body.classList.add("modal-open");
};
document.querySelectorAll("[data-open]").forEach((b) => b.addEventListener("click", () => openDialog(b.dataset.open)));
document.querySelectorAll("dialog.modal").forEach((d) => {
  d.addEventListener("close", () => document.body.classList.remove("modal-open"));
  d.addEventListener("click", (e) => { if (e.target === d || e.target.closest("[data-close]")) d.close(); });
});

/* ---------- contact form (opens the visitor's email app) ---------- */
const form = document.getElementById("contact-form");
const note = form.querySelector(".form__note");
form.addEventListener("submit", (e) => {
  e.preventDefault();
  let ok = true;
  form.querySelectorAll("input, textarea").forEach((f) => {
    const valid = f.checkValidity() && f.value.trim() !== "";
    f.classList.toggle("is-invalid", !valid);
    if (!valid) ok = false;
  });
  if (!ok) { note.textContent = "Please fill in all fields with a valid email."; return; }
  const { name, email, message } = Object.fromEntries(new FormData(form));
  const subject = `Portfolio message from ${name.trim()}`;
  const body = `${message.trim()}\n\n— ${name.trim()} (${email.trim()})`;
  window.location.href = `mailto:cuddaphajanci@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  note.textContent = "Opening your email app…";
});
form.addEventListener("input", (e) => e.target.classList.remove("is-invalid"));

document.getElementById("year").textContent = new Date().getFullYear();

/* ==========================================================
   Portfolio assistant
   Answers only from what's on this page — no external AI.
   To change an answer, edit the KB entries below.
   ========================================================== */
const link = (href, text) => `<a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>${text}</a>`;

const KB = [
  { id: "hello", keys: ["hi", "hello", "hey", "hii", "hola", "namaste"],
    answer: "Hi! 👋 I can tell you about Janci's projects, skills, education, resume or how to get in touch. What would you like to know?" },
  { id: "about", weight: 0.6, keys: ["who", "janci", "kundana", "yourself", "introduce", "introduction", "summary", "background"],
    answer: "C Janci Kundana is a third-year BTech student in Digital Transformation at Atria University, Bangalore — and an aspiring Data Scientist, currently focused on Data Science and Machine Learning, and on using data to build practical solutions." },
  { id: "goal", keys: ["goal", "career", "future", "aspire", "aspiring", "aim", "plan", "want", "become", "interest", "interested"],
    answer: "Janci's goal is to become a <b>Data Scientist</b>. The path so far: Digital Transformation → Data Science & Machine Learning → Aspiring Data Scientist." },
  { id: "education", keys: ["education", "university", "college", "atria", "degree", "btech", "study", "studying", "cgpa", "gpa", "grade", "marks", "year", "course"],
    answer: "<b>Atria University</b>, Bangalore — BTech in Digital Transformation (2024 — Present). Currently in third year, with a CGPA of <b>7.3</b>." },
  { id: "skills", keys: ["skill", "skills", "tools", "tool", "tech", "technology", "technologies", "stack", "languages", "language", "know", "python", "javascript", "sql", "mysql", "git", "tailwind"],
    answer: "Here's the toolkit:<ul><li><b>Data Science & ML:</b> Python, Data Analysis, Classification, Clustering, Regression, Anomaly Detection</li><li><b>Programming:</b> Python, JavaScript, HTML, CSS, Tailwind CSS, MySQL</li><li><b>Tools:</b> Git, GitHub, VS Code, MySQL Workbench</li><li><b>Concepts:</b> OOP, Basic Data Structures, Responsive Design, Problem Solving</li></ul>" },
  { id: "ml", weight: 0.8, keys: ["ml projects", "ml project", "ml work", "machine learning projects", "data science projects", "machine learning", "ml", "data science", "data", "model", "models", "ai", "analysis", "analytics"],
    answer: "Two ML projects show Janci's data science work:<ul><li><b>Startup Success & Funding Analysis</b> — classification, K-Means clustering, Ridge / Lasso / ElasticNet regression</li><li><b>Retail Customer Segmentation</b> — clustering customers and detecting anomalies in online retail transaction data</li></ul>" },
  { id: "projects", weight: 0.5, keys: ["project", "projects", "work", "built", "build", "portfolio", "made", "showcase"],
    answer: "Featured projects:<ul><li>Startup Success & Funding Analysis <i>(Data Science / ML)</i></li><li>Retail Customer Segmentation <i>(Unsupervised ML)</i></li><li>Patient Vitals Tracker <i>(Full-stack)</i></li><li>Visit Rajasthan <i>(Interactive WebGL site)</i></li></ul>Ask me about any of them!" },
  { id: "startup", keys: ["startup", "startups", "funding", "investment", "ridge", "lasso", "elasticnet", "regression", "classification", "company", "industry", "continent"],
    answer: "<b>Startup Success & Funding Analysis</b> — an academic ML project on startup funding and company success. Features explored: total funding, funding rounds, total investment, industry group and continent. Methods: classification, K-Means clustering, and Ridge, Lasso & ElasticNet regression.",
    action: { label: "Open project", open: "p-startup" } },
  { id: "retail", keys: ["retail", "customer", "customers", "segmentation", "segment", "segments", "online", "transaction", "transactions", "shopping", "shoppers", "ecommerce", "e-commerce", "anomaly", "anomalies", "outlier", "outliers", "unsupervised", "clustering", "cluster"],
    answer: "<b>Retail Customer Segmentation</b> (Customer Segmentation & Anomaly Detection) — an academic project on online retail transaction data. It groups customers by how they shop and flags transactions that don't fit normal patterns.",
    action: { label: "Open project", open: "p-retail" } },
  { id: "rajasthan", keys: ["rajasthan", "travel", "webgl", "three", "threejs", "blender", "3d", "jaipur", "udaipur", "jaisalmer", "jawai", "isometric", "creative"],
    answer: `<b>Visit Rajasthan</b> — an interactive travel experience with four destinations (Jaipur, Jaisalmer, Jawai, Udaipur), a WebGL landing scene and isometric Blender city tiles. Built with Three.js, TypeScript and Vite. ${link("https://janci-kundana.github.io/visit-rajasthan/", "Live site ↗")} · ${link("https://github.com/Janci-Kundana/visit-rajasthan", "GitHub ↗")}`,
    action: { label: "Open project", open: "p-rajasthan" } },
  { id: "vitals", keys: ["vitals", "vital", "tracker", "patient", "doctor", "full-stack", "fullstack", "full stack", "node", "express", "mongodb", "mongo", "jwt", "backend", "health"],
    answer: "<b>Patient Vitals Tracker</b> — a full-stack app to track and visualise patient vitals, with separate patient and doctor experiences. Built with Node.js, Express, MongoDB, JWT and JavaScript.",
    action: { label: "Open project", open: "p-vitals" } },
  { id: "other", keys: ["other", "more", "github", "repo", "repos", "repositories", "code", "game", "games", "side", "practice"],
    answer: `The portfolio shows Janci's four main projects. Smaller experiments and practice code are on ${link("https://github.com/Janci-Kundana", "GitHub ↗")}.` },
  { id: "experience", keys: ["experience", "internship", "intern", "job", "jobs", "employment", "company worked", "worked", "professional", "hire", "hiring", "available", "opportunity", "opportunities"],
    answer: `No professional experience is listed yet — Janci's hands-on experience comes from academic and personal projects in data science, ML and web development. For opportunities, reach out at ${link("mailto:cuddaphajanci@gmail.com", "cuddaphajanci@gmail.com")}.` },
  { id: "certs", keys: ["certificate", "certificates", "certification", "certifications", "award", "awards", "achievement", "achievements", "hackathon"],
    answer: "No certifications or awards are listed on the portfolio yet." },
  { id: "resume", keys: ["resume", "cv", "pdf", "download"],
    answer: `Here's the resume: ${link("assets/C-Janci-Kundana-Resume.pdf", "View PDF ↗")}` },
  { id: "contact", keys: ["contact", "email", "mail", "reach", "linkedin", "connect", "message", "talk"],
    answer: `Let's connect:<ul><li>Email: ${link("mailto:cuddaphajanci@gmail.com", "cuddaphajanci@gmail.com")}</li><li>${link("https://www.linkedin.com/in/c-janci-kundana-37313b328/", "LinkedIn ↗")}</li><li>${link("https://github.com/Janci-Kundana", "GitHub ↗")}</li></ul>` },
  { id: "location", keys: ["where", "location", "based", "live", "city", "bangalore", "bengaluru", "karnataka", "india"],
    answer: "Janci is based in Bangalore, Karnataka, India." },
  { id: "thanks", keys: ["thanks", "thank", "thx", "great", "cool", "nice", "awesome", "bye", "goodbye"],
    answer: "You're welcome! Feel free to ask anything else. 😊" },
];

const SUGGESTIONS = ["Who is Janci?", "Projects", "ML work", "Skills", "Education", "Contact"];

const normalise = (s) => s.toLowerCase().replace(/[^a-z0-9\s+#.-]/g, " ").replace(/\s+/g, " ").trim();

function findAnswer(q) {
  const text = ` ${normalise(q)} `;
  let best = null, bestScore = 0;
  for (const entry of KB) {
    let score = 0;
    for (const k of entry.keys) {
      if (text.includes(` ${k} `) || (k.length > 4 && text.includes(k))) score += (k.includes(" ") ? 2 : 1) * (entry.weight ?? 1);
    }
    if (score > bestScore) { best = entry; bestScore = score; }
  }
  return best;
}

const chat = document.getElementById("chat");
const fab = document.getElementById("chat-open");
const log = document.getElementById("chat-log");
const chips = document.getElementById("chat-chips");
const chatForm = document.getElementById("chat-form");
const input = document.getElementById("chat-input");

function addMsg(html, who, isText = false) {
  const div = document.createElement("div");
  div.className = `msg msg--${who}`;
  if (isText) div.textContent = html; else div.innerHTML = html;
  log.appendChild(div);
  log.scrollTop = log.scrollHeight;
  return div;
}

function renderChips(list) {
  chips.innerHTML = "";
  list.forEach((item) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "chip";
    if (typeof item === "string") {
      b.textContent = item;
      b.addEventListener("click", () => ask(item));
    } else {
      b.textContent = item.label;
      b.addEventListener("click", () => openDialog(item.open));
    }
    chips.appendChild(b);
  });
}

function ask(q) {
  if (!q.trim()) return;
  addMsg(q, "user", true);
  const typing = addMsg("•••", "bot");
  typing.classList.add("msg--typing");
  const entry = findAnswer(q);
  setTimeout(() => {
    typing.remove();
    if (entry) {
      addMsg(entry.answer, "bot");
      renderChips(entry.action ? [entry.action, ...SUGGESTIONS.slice(1, 4)] : SUGGESTIONS);
    } else {
      addMsg("I'm not sure about that one — I only know what's on this portfolio. Try asking about projects, skills, education or contact details.", "bot");
      renderChips(SUGGESTIONS);
    }
  }, reduceMotion ? 0 : 450);
}

let started = false;
function setChat(open) {
  chat.hidden = !open;
  fab.setAttribute("aria-expanded", String(open));
  if (open) {
    if (!started) {
      started = true;
      addMsg("Hi! 👋 I'm Janci's portfolio assistant. Ask me about projects, skills, education or how to get in touch.", "bot");
      renderChips(SUGGESTIONS);
    }
    input.focus();
  } else {
    fab.focus();
  }
}
fab.addEventListener("click", () => setChat(true));
document.getElementById("chat-close").addEventListener("click", () => setChat(false));
document.addEventListener("keydown", (e) => { if (e.key === "Escape" && !chat.hidden && !document.querySelector("dialog[open]")) setChat(false); });
chatForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const q = input.value;
  input.value = "";
  ask(q);
});
