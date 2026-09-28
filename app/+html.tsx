import { ScrollViewStyleReset } from 'expo-router/html';
import type { ReactNode } from 'react';

// This file is web-only and used to configure the root HTML for every
// web page during static rendering.
// The contents of this function only run in Node.js environments and
// do not have access to the DOM or browser APIs.
export default function Root({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/*
          Disable body scrolling on web. This makes ScrollView components work closer to how they do on native.
          However, body scrolling is often nice to have for mobile web. If you want to enable it, remove this line.
        */}
        <ScrollViewStyleReset />

        {/* Using raw CSS styles as an escape-hatch to ensure the background color never flickers in dark-mode. */}
        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
        {/* Add any additional <head> elements that you want globally available on web... */}
      </head>
      <body>{children}</body>
    </html>
  );
}

// Values mirror constants/theme.ts (cream, mist, ink); CSS can't import them.
// On a laptop-width window the app sits in a phone-width column: it's a phone
// app, and stretched edge to edge its cards and buttons read as broken.
const responsiveBackground = `
body {
  background-color: #FBF7EF;
}
@media (min-width: 640px) {
  body {
    background-color: #F1E9DB;
  }
  #root {
    max-width: 440px;
    margin: 0 auto;
    box-shadow: 0 0 0 1px rgba(44, 42, 38, 0.06), 0 24px 80px rgba(44, 42, 38, 0.1);
  }
}`;
