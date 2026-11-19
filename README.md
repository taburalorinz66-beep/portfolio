# Lorinz G. Tabura - Pixel Night City Portfolio

Plain HTML + CSS + JavaScript. No build step. The only extra thing is ONE SQL file
that you paste into the Supabase website (free) - it is not a language you install.

## Folder map (what lives where)

```
index.html            the visitor page
admin/                the admin page (login, messages, add files/link/CV, projects)
  index.html  admin.css  js/ (one file per tab)
css/                  styles, split by purpose (main.css imports them all)
  base/ screens/ effects/ layout/ components/ sections/ responsive.css
js/
  config.js           <- the ONLY file you edit (Supabase keys)
  content.js          <- your text: roles, bio, skills, featured projects (FEATURED_PROJECTS)
  core/               small helpers (dialog, toast, sound, state)
  services/           talks to Supabase: auth, items, messages
  visuals/            the pixel city, avatar, particles, cursor
  ui/                 theme toggle, navigation, command palette, transitions
  sections/           hero (Download CV?), about, skills, projects, arcade, contact, boot
  main.js             starts everything (read this first)
database/setup.sql    paste into Supabase once
  fix-storage.sql     run once if you ran an older setup.sql (lets the admin delete/replace files)
```

## Your flowchart -> files

| Flowchart box | File |
|---|---|
| Start -> Press Start; ADMIN button (bottom-right) -> login | `js/sections/boot.js`, `js/ui/admin-access.js` |
| Night / Day toggle | `js/ui/theme.js`, `css/base/variables.css` |
| Projects: All / Games / Websites | `js/sections/projects.js` |
| Arcade (coin, hearts, pause, game over) | `js/sections/arcade.js` |
| Download CV? YES / NO | `js/sections/hero.js` |
| Contact -> your Gmail + message log | `js/sections/contact.js`, `js/services/messages.js` |
| Admin login | `admin/js/admin-main.js`, `js/services/auth.js` |
| Message logs: Reply / Ignore | `admin/js/admin-messages.js` |
| Add Files / Add Link / Add CV | `admin/js/admin-add-files.js`, `admin-add-link.js`, `admin-add-cv.js` |
| View Projects: Delete / Replace / Cancel | `admin/js/admin-projects.js` |

## Quick start (see the site)

1. Open the folder in VS Code. 2. Install the "Live Server" extension.
3. Right-click `index.html` -> **Open with Live Server**.
Without Supabase the site shows only the featured projects and the contact form says it is not connected yet.

## STEP 2 - Make it live (Supabase, free)

1. supabase.com -> sign up -> **New project** (pick any name/password/region).
2. Left menu **SQL Editor** -> New query. Open `database/setup.sql` in VS Code,
   change `PUT-YOUR-ADMIN-EMAIL-HERE` to `taburalorinz66@gmail.com`, copy everything,
   paste, press **Run**.
3. **Authentication -> Users -> Add user**: your email + a strong password (tick auto-confirm).
4. **Authentication -> Sign In / Providers**: turn OFF "Allow new users to sign up".
5. **Project Settings -> API**: copy the **Project URL** and the **anon / publishable** key
   into `js/config.js`. NEVER use the `service_role` key.
6. Reload the site. Tap the ADMIN button in the bottom-right corner and type your admin email + password. `/admin/index.html` also works directly.

Free plan notes: 1 GB storage, 50 MB per file, and the project **pauses after 7 days with no
activity** (open the Supabase dashboard and press Restore).

### Already ran an older setup.sql?
Open `database/fix-storage.sql`, copy it, paste it into the Supabase SQL Editor and press Run. Without it, deleting or replacing an uploaded FILE can leave the old file behind in storage.

## STEP 3 (optional) - copy of every message in Gmail

Messages are always saved in the admin MESSAGE LOGS. To ALSO get an email:
web3forms.com -> enter taburalorinz66@gmail.com -> paste the key they email you into
`web3formsKey` in `js/config.js`. (Your address never appears in the site code.)

## Why only you can change things

The database decides who is admin (`is_admin()` in setup.sql). Visitors can read projects and
send a message - nothing else. Hiding the admin link is not the security; the database rules are.

## Troubleshooting

- **White page / only "Skip to content"**: open Live Server (not by double-clicking the file),
  press F12 -> Console and read the first red error. Make sure all folders are kept together.
- **"Not allowed"** in admin: you are not logged in as the email put into setup.sql.
- **Reply** opens Gmail with the visitor's address and your text; you press Send there.
