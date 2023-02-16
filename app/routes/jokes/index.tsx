import { json } from "@remix-run/node";
import { useLoaderData, Link, useCatch } from "@remix-run/react";

import { db } from "~/utils/db.server";

export const loader = async () => {
  const count = await db.joke.count();
  const randomRowNumber = Math.floor(Math.random() * count);
  const [randomJoke] = await db.joke.findMany({
    take: 1,
    skip: randomRowNumber,
  });
  if (!randomJoke) {
    throw new Response("No random joke found", {
      status: 404,
    });
  }
  return json({ randomJoke });
};

export default function JokesIndexRoute() {
  const data = useLoaderData<typeof loader>();

  return (
    <div>
      <p>This random joke is about <strong>{data.randomJoke.name}</strong>:</p>
      <p>{data.randomJoke.content}</p>
      <Link to={data.randomJoke.id}>
        "{data.randomJoke.name}" Permalink
      </Link>
    </div>
  );
}

export function CatchBoundary() {
  let caught = useCatch();
  switch(caught.status) {
      case 404:
      return(
          <div className="error-container">
          <p>There are no jokes to display.</p>
          <Link to="/">Bcke to Safty!</Link>
          </div>
      );
      default:
          throw new Error(`Unexpected caught response with status: ${caught.status}`)
  }
}
export function ErrorBoundary() {
  return (
    <div className="error-container">
      I did a whoopsies.
    </div>
  );
}