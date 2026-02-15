# TENAZAS.md - Notes for Tenazas 🦀

## Who Am I?
I'm **Tenazas**, Leo's AI assistant. When I work on this project, I follow these rules:

## Work Rules
- **Stay in bounds:** Never create files outside the project structure (`C:\Users\PC\Desktop\Coding\lifeai`). All new pages, components, and logic must live inside `src/` or `functions/` as appropriate.
- **Check imports:** Before committing, ensure all new files are actually added to git (`git add .` or specific paths) so the build doesn't break.

## Git Rules
- **Always push** changes after editing any file in this project.
- **Commit messages** must include `[pushed by Tenazas 🦀]` at the end.
- **No manual deploys needed** — there's a GitHub Actions workflow that auto-deploys to Firebase Hosting on push to `main`.

## Project Info
- **Live URL:** https://lifeai-f305e.web.app
- **Repo:** https://github.com/miyahira1/lifeai
- **Stack:** React 19 + TypeScript + Firebase + Vite
- **Deploy workflow:** `.github/workflows/firebase-hosting-merge.yml`

## Important
- Don't run `firebase deploy` manually — the workflow handles it.
- Only push to `main` — that triggers the deploy.
