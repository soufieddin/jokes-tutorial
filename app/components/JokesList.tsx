import type { Joke } from "@prisma/client";
import { Link, NavLink } from "@remix-run/react";

export default function JokesList({jokes, text, btnText}:{jokes: Array<Pick<Joke, "id" | "name">>, text?:string, btnText?:string}) {
    return(
        <div className="jokes-list">
            {
                jokes.length >= 1 ? (<ul>
                    {jokes.map(joke=>(
                    <li key={joke.id}>
                        <Link prefetch="intent" to={`/jokes/${joke.id}`}>{joke.name}</Link>
                    </li>
                    ))}
                </ul>) : (<h4 style={{"marginBottom":"1rem"}}>{text}</h4>)
            }
            <NavLink to="/jokes/new" className="button">
                {btnText}
            </NavLink>
        </div>
    )
}