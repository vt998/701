<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

## Application rules
- Use one shared group gallery for the home page and groups page; category and group selectors address the same persisted photos.
- Keep admin identity in one root session provider; verify users through Auth and permissions through the database role function, with RLS enforcing every photo operation.
- Read private-bucket photos through expiring signed URLs and invalidate shared photo queries after mutations so public displays reflect saved changes.
- Record anonymous route view counts without personal identifiers; exclude the admin page from counts.
- Persist named gallery folders separately and associate photos through nullable folder_id; null identifies the existing home-only photo collection so named albums never leak into the home rotation.
- Keep added announcements in an admin-writable, publicly readable table; render the original announcements before saved additions to preserve the existing board.
