# Spec: AI Digital Twin portfolio

C Janci Kundana, BTech Digital Transformation, Atria University
Last updated: 26 Sep 2026 (evening)

## What I'm building

A portfolio website that works as a small "digital twin" of me. It shows who I am, my projects, skills, education and resume. It also has a chat box where visitors can ask questions about me and get answers without scrolling through everything.

Live link: https://janci-kundana.github.io

I built it with Claude Code, and I set up the repo so Claude Code knows how to keep working on it. That setup is the CLAUDE.md file plus the skill, commands and hook listed below.

## Core features

1. **Hero section.** My name, what I study, that I want to be a data scientist, and three quick facts (location, focus, looking for internships).
2. **Projects.** Four projects, each with a card and a popup that has more detail. Two are ML projects (startup funding analysis, and customer segmentation with anomaly detection on online retail data), one is a full-stack app and one is a 3D travel website. Smaller stuff is left on GitHub on purpose.
3. **Education and skills.** University, year and CGPA, then skills grouped into four boxes.
4. **Resume.** View or download the PDF. The PDF is made from an HTML file so it's easy to update.
5. **Contact.** Email, LinkedIn and GitHub links, and a form that opens the visitor's email app with the message filled in.
6. **Chat assistant ("Ask about me").** Answers questions about my projects, skills, education and contact details. It can also open a project's popup. Right now it works by keyword matching on a list of answers I wrote, so it only says things that are true and it works offline.
7. **Design.** A "Sage & Sand" palette: cream and soft sage backgrounds, deep olive for text and the dark sections, and terracotta only for things I want people to notice (my surname, the main buttons). It took a few tries. Bright pastels and purple didn't feel right, so I picked this calmer earthy set from four options. It works on phones, and animations are turned off for people who have reduced motion set.

## Plugin components (Claude Code)

These live in the `.claude/` folder.

| Type | Name | What it does |
|------|------|--------------|
| Project memory | `CLAUDE.md` | Tells Claude how the site is structured, my design rules, and not to make things up about me |
| Skill | `portfolio-content` | Lists every place a project or fact appears (card, popup, chat answer, resume) so updates don't get out of sync |
| Command | `/add-project <name>` | Asks me for the project details and then adds it everywhere using the skill. Won't go over four projects |
| Command | `/rebuild-resume` | Rebuilds the resume PDF from `resume/resume.html` and checks it's still one page |
| Hook | `check-site.sh` (PostToolUse on Edit/Write) | After `index.html` or `script.js` is edited, checks the JS has no syntax errors and every project button has a matching popup. If not, it tells Claude to fix it |

## Done

- [x] Site layout and all sections
- [x] Four projects with detail popups
- [x] Chat assistant with keyword answers and quick-question chips
- [x] Contact form (mailto)
- [x] Resume updated for third year, focused on data science, with 3 projects instead of the old ones
- [x] Resume source in HTML with a build script
- [x] Redesign: Sage & Sand palette (cream, sage, olive, terracotta) instead of pastels and purple, removed the CJK logo, cleaner and more professional look
- [x] Corrected the second ML project to Customer Segmentation & Anomaly Detection (online retail data) everywhere: site card, popup, chat answers and resume
- [x] Resume header redone: email plus "LinkedIn" and "GitHub" as short clickable labels instead of long URLs, and no portfolio link under the name. The site's contact section uses the same short labels
- [x] Deployed on GitHub Pages
- [x] CLAUDE.md, skill, two commands and the check hook

## Pending

- [ ] Connect the chat to a real LLM (probably Claude through a small serverless function, so the API key isn't in the browser). It should still only answer from my own info.
- [ ] Contact form that sends the message directly instead of opening the email app
- [ ] Achievements and certifications section, once I have something to put there
- [ ] Add screenshots or results (charts) for the two ML projects
- [ ] Add links to the ML project notebooks once they're cleaned up and on GitHub
- [ ] Add the actual methods I used for the customer segmentation project (right now it just says clustering and anomaly detection)
- [ ] Maybe a dark mode

## Notes

- I kept it as plain HTML, CSS and JS because it's small and GitHub Pages can serve it as it is.
- The chat is keyword-based for now so it can't give wrong answers about me. The LLM version is the next big step.
