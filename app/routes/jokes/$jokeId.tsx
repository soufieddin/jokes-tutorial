import type { ActionFunction, LoaderArgs, MetaFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { Form, Link, useLoaderData } from "@remix-run/react";
import { getUser, requireUserId } from "~/utils/session.server";


export const loader = async ({ params, request }: LoaderArgs) => {
  const userInfo = await getUser(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Error("Joke not found");
  }
  const jokester = await db.user.findUnique({
    where: {id: joke.jokesterId}
  })
  return json({ joke, userInfo, jokester });
};
export const action: ActionFunction = async({request, params}) => {
  let userId= await requireUserId(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if(joke?.jokesterId === userId) {
    await db.joke.delete({
      where: { 
        id: params.jokeId,
      },
    })
    return redirect("/jokes/myJokes");
  }
  throw new Error("You are not allowed to delete others joke!");
  //return redirect("/jokes/myJokes");
}
export const meta: MetaFunction = ({data}) => ({
  title: data?.joke?.name ? `Jokes |  ${data?.joke?.name}` : "Some joke",
});
export default function JokeRoute() {
  let data = useLoaderData<typeof loader>();
  //let actionData = useActionData<typeof action>();
  console.log(data);
    return (
      <div>
        <p>Here's your hilarious joke<br /> Subject: <strong>{data?.joke?.name}</strong> <br /> Author: <em>{data.jokester?.username}</em></p>
        <p>
          {data?.joke?.content}
        </p>
        <div style={{"display":"flex", "flexDirection":"column"}}>
          <Link to=".">{data.joke.name} Permalink</Link>
          {
            data.joke.jokesterId === data.userInfo?.id &&
          
            <Form method="post">
              <button type="submit" className="button"  style={{"marginTop":"1rem","fontWeight":"bold","width":"35%"}}>
                Delete
              </button>
            </Form>
          }
        </div>
      </div>
    );
  }