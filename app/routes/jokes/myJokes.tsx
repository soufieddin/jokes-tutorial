import type { Joke } from "@prisma/client";
import type { LoaderFunction } from "@remix-run/node";
import { Link, NavLink, useLoaderData } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { requireUserId } from "~/utils/session.server";

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
        <div className="jokes-list">
            {
                data.jokes.length >= 1 ? (<ul>
                    {data.jokes.map(joke=>(
                    <li key={joke.id}>
                        <Link to={`/jokes/${joke.id}`}>{joke.name}</Link>
                    </li>
                    ))}
                </ul>) : (<h4 style={{"marginBottom":"1rem"}}>You do not have any own jokes yet!</h4>)
            }
            <NavLink to="/jokes/new" className="button">
                Add your own
            </NavLink>
        </div>
    )
}