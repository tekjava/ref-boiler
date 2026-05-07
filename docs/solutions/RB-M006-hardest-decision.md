# RB-M006 — Hardest Decision

**What was the hardest decision here?**

What level of specificity to write the architectural decisions section at.

Two failure modes for a setup guide of this kind:

1. **Too abstract** — lists principles ("follow the constraints") without grounding them in concrete file names, line-level behaviors, or the specific non-obvious gotchas that bit us during the build. An engineer who hasn't read all five solutions docs gains nothing.

2. **Too narrow** — transcribes the solutions docs verbatim, making the guide redundant and hard to skim. An engineer who just needs to know "where does the token live?" has to read paragraphs to find the answer.

Chose a middle path: one paragraph per decision, leading with the concrete actionable rule, followed by the non-obvious detail that would cause a bug if missed. The `collapsable={false}` entry is the clearest example — the rule is one sentence, but the "why" (Android view flattening, blank image, no error message) is what makes the difference between a developer who knows it and one who spends an afternoon debugging.

**The BRIEF template location:** considered making it a separate file at `docs/playbook/BRIEF_TEMPLATE_industry_feature.md` for easier copy-use. Kept it as an appendix in the guide instead. Reason: a template in a separate file gets discovered by search; a template in an appendix gets discovered in context, after the engineer has read the discovery questions and layer planning sections that tell them *why* each field matters. Contextual placement produces better-filled BRIEFs.

**Step 8 was added beyond the original PLAN scope.** The PLAN specified three sections: fork, discovery, Layer 3/4 planning. Adding a dedicated "Known architectural decisions" section was a judgment call — the decisions from RB-M001 through RB-M005 are the kind of knowledge that evaporates without a doc, and a BRIEF template is useless if the fork engineer accidentally breaks the API key boundary or removes `collapsable={false}` because they didn't know it was load-bearing. The section cost about 200 lines and prevents a category of bugs that would otherwise only be discovered in production.
