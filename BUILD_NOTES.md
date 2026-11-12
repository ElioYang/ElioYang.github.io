# Revision v4 — build and verification notes

Date: 2026-11-12 (America/Chicago). Production: https://elioyang.github.io/.

## Authority and source handling

Read the supplied `yuxing-portfolio-pack/AGENTS.md` in full and used it as the authoritative v4 specification. Earlier layout, text, inventory-chart removal, six-setting demo, and pill formatting were superseded. The supplied current `content/` and `data/` are rendered without rewriting their research statements.

The user's four additional instructions override the default design-codes gates: `findings_public` is true; harms `publish` is true; `note_for_codex` was removed; the caption is exactly:

> Autonomy dominates in every law, partly by coding convention. Reputational harm is nearly absent. Preliminary: counts for Maryland, New Jersey, and Vermont will be updated after a pending coding revision.

Findings are rendered as written, without their instruction comment. Figure F follows the findings section directly. The full “Work in progress. Findings are preliminary.” pill appears on the project page and home row, following the user's explicit override of the shorter home-row label.

Build sources are retained locally in `yuxing-portfolio-v4-source/`, outside the published checkout. Runtime interface strings and templates live under its `content/`; the build script contains rendering logic and markup, not research copy. All six supplied data JSON files are byte-identical to their retained source copies, and the demo rules are copied unchanged. Extra existing PDFs, including both James Scholar reports and the CV, are retained. `_handoff/`, instructions, tools, draft Markdown, and source templates are not published.

The original ZIP was successfully inspected and extracted at the start. It was no longer present at the supplied Downloads path during the later validation run; retained extracted source and output parity were checked. No replacement content was inferred from a missing file.

## Implemented comparison against v4

- Shared 1040px container, 17px/1.7 body, readable text color, 12px minimum, light/dark themes, contrast-qualified neutral chart strokes, unbracketed pills, active nav underline/aria-current, theme-color metadata, and print rules.
- New supplied headshot, alternate formal photo kept unused, full-width featured demo with shared three-row live matrix, six single-column linked project rows and meta lines, neutral publication titles, and source-driven footer date/email.
- All six project pages use the requested meta lines, ordering, and status badges. The new Designing Childhood Online page contains mapping Figure E, published preliminary findings, heatmap Figure F with all 42 values and six sample sizes, exact cautionary caption, value note, and method tags.
- Figures A–F use the supplied JSON: direct-labeled masking chart; third-segment-highlighted timeline after What I did; five-step AI-science pipeline with pending final step; grouped PQC bars including the separated baseline; legal mapping; and proportional harm heatmap. Award photo and alt/caption are included after PQC Result.
- Every figure has its supplied heading, data disclosure/table, caption where supplied, and source aligned to the figure width. Numeric charts redraw after a 150ms debounce and orientation change. Graphics/disclosures are kept within the specified gap.
- Eight-setting Demo: segmented age/baseline controls; full overview with mobile selected-column / Show all ages; outcome-specific action labels; law/analysis/prototype basis disclosures; mobile sentence flows; summary and strikethrough comparison in flattened view; no card action buttons while flattened; sticky desktop record and floating mobile Record(n).
- Preserved request-level status/actions, pending isolation, withdrawal, parent approved_value, revert rule, same-age no-op, age-change withdrawal, whitespace validation, local timestamps, and memory-only state.

One internal specification conflict was resolved in favor of the hard rule: §7.3 asks for 10px chip labels, but §1.5 prohibits visitor text below 12px. Chip labels are 12px. The project tagline uses the specific 19px muted style in §5; home row taglines remain 16px text color.

## §9 verification

1. **Screenshots and visual review:** all nine pages (home, six projects, Demo, 404) captured at 1366px and 390px, 18 required screenshots in `/private/tmp/yuxing-v4-qa/`. All were visually inspected. Additional checks at 360px found no horizontal page overflow. Visible text checks found no text below 12px. Dark Design Codes and Demo screenshots were also reviewed. Heatmap numbers remain readable and their meaning is not color-only.
2. **Exact Demo checks:** keyboard-operated regression confirms Under 13 + One-size-fits-all gives 8 of 8 changed settings and 4 stranger-contact openings. Teen text chat uses Change this setting → notice/four safeguards → Turn on → record; returning to Off applies immediately with the revert rule. Under-13 friend approval gives “Linked accounts + 1 parent-approved friend”. Age switching withdraws pending records with the exact age-band-changed status. Both new settings show From the law.
3. **Gates:** current HTML contains the findings and 42 heatmap cells immediately afterward, as the user requested. No instruction comments remain. A separate temporary false/false build verifies that findings text and heatmap are omitted entirely and the supplied replacement sentence is used; production source stays true/true.
4. **Links/PDFs:** structural checks resolve every internal path. All 11 retained PDF paths return 200 with a PDF signature locally. External navigation links were checked with `curl -sIL --max-time 25`: ORCID **200**; GitHub **200**; DOI **302 → ACM 403** with `cf-mitigated: challenge`. The DOI resolves to ACM, but automated retrieval is challenged; this is not recorded as a missing DOI.
5. **Accessibility/keyboard:** Lighthouse home **100/100**, Demo **100/100**. Main change/contest flows were operated through keyboard focus and Enter, with textarea validation. A complete initially visible-control focus/Tab traversal covered 31 controls, with no positive tabindex or focus trap. Light/dark computed-style checks across all nine pages confirmed sampled visible text and data-bearing SVG strokes at least 4.5:1. This is not a real screen-reader certification.
6. **Facts:** `FACT_CHECK.md` now contains 294 comparison rows. New team/role/method claims, six-law scope, mapping rules, all harm sample sizes/percentages, preliminary findings, eight-setting policy values, pipeline, baseline values, and award image claims are included. Discrepancies are listed, not silently fixed.
7. **After deployment:** a fresh isolated/logged-out Chrome context opened all nine production pages with HTTP 200, confirmed six project rows, eight Demo settings, findings followed directly by 42 heatmap cells, and the preliminary badge. It downloaded the James Scholar interim PDF (HTTP 200, 289,456 bytes, PDF signature), opened the new deep link, received the custom 404 for a nonexistent nested path, and followed the working home link. No account login or private-site bypass was used.

## Content limitations retained verbatim

- Raw Dedoose excerpts/memos, statutory source documents, coding-revision outputs, full inventory spreadsheet, and journal-invitation correspondence were not supplied. New legal and harm-coding statements are marked as author-provided preliminary material rather than independently established legal conclusions.
- Figure A's caption says “Style-oriented passages only: 60 passages”, whereas the paper distinguishes 60 overall and 30 per condition. Preserved and flagged.
- Figure D's title says extra hybrid cost appears “only” under concurrency, although its baseline pair is 29.21 vs 35.41 ms. Preserved and flagged.
- Figure B's “test messages still went out” can imply actual delivery, while the paper says no email was sent; the mechanism wording also conflates separate strict-lease/guard results. Preserved and flagged.
- The pipeline attributes the whole diagram to the interim report, while the 14-new-project count comes from the November update; 1,743 still lacks the full source inventory. Preserved and flagged.
- CV status/terminology, missing 2025 PDF/author initials, journal extension details, and geographic/event details not established by the plaque remain documented in FACT_CHECK.md.

## Published acceptance and final boundary check

The first v4 Pages build (`d0671d8814046ca94b943eeb23ad11988bf238fb`) completed successfully, and the full logged-out acceptance above passed against https://elioyang.github.io/. The final local regression additionally checks that the adult one-size-fits-all view has zero changed cards and keeps the adult explanation; only changed cards show `flattened_exposes`. The first deployment's submitted content/data were unchanged by this final behavior correction.

The retained QA artifacts include the 18 required screenshots, light/dark screenshots, results, contrast samples (lowest sampled text ratio 4.805:1), Lighthouse reports, negative-gate control, and public acceptance results. Browser scripts and build sources remain outside the public root. Both reports were updated as requested; raw coding revisions and the listed factual mismatches were not invented or silently repaired.

## Exact corrections — 2026-11-12

Applied all eleven follow-up instructions in the editable source, then rebuilt and redeployed. ITC title/caption, JCDL style-subset caption, both specified access observations, pipeline attribution, mapping “concern” caption, and the design-codes meta suffix match the supplied wording exactly. No plotted numbers were changed. The findings gates, exact preliminary heatmap caption, and full preliminary badges remain in place.

Adult parent_visibility and monitoring_signal now use not_applicable; monitoring_signal displays No signal. The exact outcome explanation is in the source rules and is shown without an action button. These adult matrix cells have no Locked/Parent tag. Matrix tags use muted text and a 1px line-colored border; selected columns use a neutral surface. Changed-state accents remain on the flattened comparison. Changed cards omit their basis disclosure entirely. The desktop recipient/principle separator was removed; the mobile sentence keeps its punctuation.

All eight overview row labels are keyboard-operable links to the corresponding card. The shared home mini-matrix links into /demo/#setting_id, waits for generated cards, and focuses/scrolls the target. Anchors on the Demo focus the card directly; a final card may stop lower in the viewport because the page has reached its end.

Validation: exact-source comparisons against the previous Git commit confirm only the requested JSON fields changed. Source/deployed JSON byte parity, internal paths, metadata, gates, and HTML checks passed. Full regression covered nine pages at 1366/390/360px, eleven PDF paths, all original Demo outcomes, whitespace handling, approval/reversion/withdrawal, 39 keyboard controls, no JavaScript exceptions, and 8 of 8 / 4 for Under 13. Targeted checks additionally verify two adult not_applicable cards, absence of their matrix tags/actions, No signal, all matrix anchors, home deep-link focus, neutral styles, two desktop arrows with no recipient dot, and no basis disclosure on changed cards. Light/dark contrast checks passed. Prior Lighthouse 100/100 results remain the v4 baseline; no new Lighthouse score is claimed for this follow-up.

FACT_CHECK.md's affected scope/attribution/wording rows have been updated to mark these corrections resolved. Unrelated source-evidence limitations remain listed. Publication and post-deployment checks are recorded below once the Pages build completes.
