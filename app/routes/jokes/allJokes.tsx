import type { Joke, User } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { getUser } from "~/utils/session.server";

type LoaderData = {jokes: Array<Pick<Joke, "id" | "name">>, user: User | null}

export let loader: LoaderFunction = async ({request}) => {
  let user = await getUser(request);
  let jokes = await db.joke.findMany({
    take: 5,
    select: {id: true, name: true},
    orderBy:{createdAt: "desc"}
  });
  let data:LoaderData ={jokes, user};
  return data;
}

export default function AllJokesRoute() {
    let data = useLoaderData<LoaderData>();
    return(
        <div className="jokes-list">
            <ul >
            {data.jokes.map(joke=>(
            <li key={joke.id}>
                <Link to={`/jokes/${joke.id}`}>{joke.name}</Link>
            </li>
            ))}
        </ul>
        <NavLink to="/jokes/new" className="button">
            Add your own
        </NavLink>
        </div>
    )
}