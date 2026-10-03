// Every link that leaves the app, in one place.
// SITE moves to https://riseagainapp.com once the domain serves the site
// (docs/TODO.md, "Website live on the domain"). Until then the GitHub Pages
// address works, and it will redirect to the domain afterward.
export const SITE = 'https://trintsaunders.github.io/rise-app';

export const LINKS = {
  home: SITE,
  support: `${SITE}/support`,
  privacy: `${SITE}/privacy`,
  supportEmail: 'support@riseagainapp.com',
  helloEmail: 'hello@riseagainapp.com',
} as const;
