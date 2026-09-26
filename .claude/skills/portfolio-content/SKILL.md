---
name: portfolio-content
description: Use when adding, editing or removing a project, skill or fact on Janci's portfolio site or resume. Explains every place the same content lives so nothing gets out of sync.
---

# Keeping portfolio content in sync

The same facts show up in a few places. If you change one, check the others.

## A project lives in four places

1. The card in `index.html`, inside `#projects`. Copy an existing `<article class="card">` and keep the text to one short line. The three text cards sit in one row and Visit Rajasthan (`card--img`) goes full width under them, so keep that layout balanced.
2. The `<dialog class="modal" id="p-...">` near the bottom of `index.html`. The card's `data-open` has to match the dialog id.
3. A `KB` entry in `script.js`. Give it keywords people would actually type, and an `action: { label: "Open project", open: "p-..." }` so the chat can open the dialog. Update the `projects` entry's list as well.
4. `resume/resume.html`, only if it's one of the main projects. Then run `bash resume/build.sh` to rebuild the PDF.

The site shows four projects at most. Smaller things go on GitHub, not on the site.

## Style rules

- Colours: the Sage & Sand variables in `styles.css` (cream, sage, green, olive, terracotta `--accent`). Terracotta is only for small things that should catch the eye, never big areas. No pink or purple, and don't add new colours.
- Profile links show a short label ("GitHub", "LinkedIn") with the URL behind it, never the printed URL.
- No logo or monogram anywhere.
- Short text. One line per description.
- Don't invent anything: no made-up metrics, certificates or experience. If you're unsure, ask.

## After editing

Update `CLAUDE.md` and `SPEC.md` so they match what changed (project list, done and pending lists, the date at the top of the spec).


The PostToolUse hook checks that `script.js` parses and that every `data-open` id has a dialog. If it complains, fix it before moving on.
