# CLAUDE.md

This is my personal portfolio site. It's hosted on GitHub Pages at https://janci-kundana.github.io and gets deployed every time I push to `main`.

It's a plain static site. No framework, no build step, no npm. Just three files:

- `index.html` has all the content
- `styles.css` has the styling
- `script.js` handles the nav, the project popups, the contact form and the chat assistant

The resume PDF in `assets/` is generated from `resume/resume.html`. Don't edit the PDF directly. Change the HTML and run `bash resume/build.sh` (it uses headless Chrome).

## How I want it to look

- Colours are "Sage & Sand": cream background (`--base`), soft sage sections (`--sage`), deep olive for text, dark sections and the footer (`--ink`, `--olive`), a mid green for small details (`--green`), and terracotta (`--accent`) only for things that should catch the eye, like my surname and the main buttons. It's all set as variables at the top of `styles.css`. Please don't add other colours, and no pink or purple. I went through a few palettes before picking this one.
- It should look professional. No spinning badges, tilted cards or big cartoon shadows. The slow skills banner under the hero is fine.
- No logo or "CJK" monogram anywhere, including the favicon.
- My name stays on one line in Anton (the heavy condensed font).
- Keep text short. One line per description is plenty.
- Don't put a plain white background with grey text. I found that boring.
- Links to my profiles just say the site name, like "GitHub" or "LinkedIn", with the URL behind the link. Don't print the full URL. My email address can stay visible.

## Projects

The site shows four projects and that's the limit. Right now they are Startup Success & Funding Analysis, Retail Customer Segmentation, Patient Vitals Tracker and Visit Rajasthan (the wide card with the picture, at the end).

Retail Customer Segmentation is the short name on the site. On the resume it uses the full name, "Customer Segmentation & Anomaly Detection", and it uses online retail transaction data. I haven't written down which algorithms I used yet, so don't add any algorithm names to it until I do. Everything else just gets a link to my GitHub.

When a project changes, it has to be updated in a few places (card, dialog, chat answers, maybe the resume). The `portfolio-content` skill in `.claude/skills` lists all of them. `/add-project` walks through it.

## The chat assistant

The "Ask about me" chat doesn't call any AI API. It matches keywords against a small list of answers (`KB` in `script.js`). If you add something to the site, add an answer for it there too, otherwise the chat will say it doesn't know.

## Rules

- Don't make up facts about me. No fake numbers, certificates, internships or awards. If something isn't on the site or resume already, ask me first.
- Don't push unless I ask.
- Test on a phone-sized screen (about 390px wide) as well as desktop. Nothing should scroll sideways.
- There's a hook that runs after edits to `index.html` or `script.js`. It checks the JS parses and every project button has a matching popup. If it fails, fix it.
