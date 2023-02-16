import type { LinksFunction, MetaFunction } from "@remix-run/node";

import {
  Link,
  Links,
  LiveReload,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  useCatch,
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

export function CatchBoundary() {
  let caught = useCatch();
  if(caught.status === 401 || caught.status ===404) {
    return(
      <Document>
        <div className="error-container">
          <p>You must login to proceed</p>
          <Link to="/login">Login</Link>
        </div>
      </Document>
    )
  }
  throw new Error("Something went wrong!")
}

export function ErrorBoundary({error}:{error:Error}) {
  return (
    <Document>
      <div className="error-container">
        <h1>Ooops!</h1>
        <p>{error.message}</p>
        <Link to="/">Back to Safty</Link>
      </div>
    </Document>
  )
}