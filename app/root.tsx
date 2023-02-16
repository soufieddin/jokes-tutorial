import type { LinksFunction, MetaFunction } from "@remix-run/node";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";

import globalStylesUrl from "./styles/global.css";
import globalMediumStylesUrl from "./styles/global-medium.css";
import globalLargeStylesUrl from "./styles/global-large.css";
import type { ReactNode } from "react";

export const links: LinksFunction = () => {
  return [
    {
      rel: "stylesheet",
      href: globalStylesUrl,
    },
    {
      rel: "stylesheet",
      href: globalMediumStylesUrl,
      media: "print, (min-width: 640px)",
    },
    {
      rel: "stylesheet",
      href: globalLargeStylesUrl,
      media: "screen and (min-width: 1024px)",
    },
  ];
};
export const meta: MetaFunction = () => ({
  charset: "utf-8",
  title: "Jokes Remix App",
  viewport: "width=device-width,initial-scale=1",
});

function Document({children}:{children:ReactNode}) {
  return (
    <html lang="en">
    <head>
      <Meta />
      <Links />
    </head>
    <body>
      {children}
      <ScrollRestoration />
      <Scripts />
      <LiveReload />
    </body>
  </html>
  )
}
export default function App() {
  return (
   <Document>
     <Outlet />
   </Document>
  );
}

export function ErrorBoundary({error}:{error:Error}) {
  return (
    <Document>
      <div className="error-container">
        <h1>Something went wrong!</h1>
        <p>{error.message}</p>
        <Link to="/jokes">Back to Jokes</Link>
      </div>
    </Document>
  )
}