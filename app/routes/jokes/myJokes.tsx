import type { Joke } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {  useLoaderData } from "@remix-run/react";
import JokesList from "~/components/JokesList";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
    title: "Jokes | My Jokes",
  });
type LoaderData = {jokes: Array<Pick<Joke, "id" | "name">>}

export let loader: LoaderFunction = async ({request}) => {
    let userId = await requireUserId(request);
    let jokes = await db.joke.findMany({
    where: {jokesterId : userId},
    take: 5,
    select: {id: true, name: true},
    orderBy:{createdAt: "desc"}
  });
  let data:LoaderData ={jokes};
  return data;
}

export default function MyJokesRoute() {
    let data = useLoaderData<LoaderData>();
    return(
        <JokesList jokes={data.jokes} text="You did not add any jokes yet!" btnText="Add another one"/>
    )
}export function ErrorBoundary({error}:{error:Error}) {
    return (
      <div className="error-container">{`Something went wrong! Sorry.`}<br/><em><strong>{error.message}</strong></em></div>
    );
  }