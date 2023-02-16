import type { Joke } from "@prisma/client";
import type { LoaderFunction, MetaFunction } from "@remix-run/node";
import {  Link, useCatch, useLoaderData } from "@remix-run/react";
import JokesList from "~/components/JokesList";
import { db } from "~/utils/db.server";
import { getUserId } from "~/utils/session.server";

export const meta: MetaFunction = () => ({
    title: "Jokes | My Jokes",
  });
type LoaderData = {jokes: Array<Pick<Joke, "id" | "name">>}

export let loader: LoaderFunction = async ({request}) => {
    let userId = await getUserId(request);
    if(!userId) {
        throw new Response("Yo, login first please", {
            status: 401,
        })
    }
    let jokes = await db.joke.findMany({
    where: {jokesterId : userId},
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
}

export function CatchBoundary() {
    let caught = useCatch();
    switch(caught.status) {
        case 401:
        return(
            <div className="error-container">
            <p>You must login to get access to this page</p>
            <Link to="/login">Login</Link>
            </div>
        );
        default:
            throw new Error(`Unexpected caught response with status: ${caught.status}`)
    }
}
export function ErrorBoundary({error}:{error:Error}) {
    return (
      <div className="error-container">{`Something went wrong! Sorry.`}<br/><em><strong>{error.message}</strong></em></div>
    );
  }