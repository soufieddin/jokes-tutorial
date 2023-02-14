import type { LoaderArgs } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { Link, useLoaderData } from "@remix-run/react";

export const loader = async ({ params }: LoaderArgs) => {
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Error("Joke not found");
  }
  return json({ joke });
};
export default function JokeRoute() {
  let data = useLoaderData<typeof loader>();
    return (
      <div>
        <p>Here's your hilarious joke about <strong>{data?.joke?.name}</strong>:</p>
        <p>
          {data?.joke?.content}
        </p>
        <Link to=".">{data.joke.name} Permalink</Link>
      </div>
    );
  }