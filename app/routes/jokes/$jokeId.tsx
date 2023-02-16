import type { ActionFunction, LoaderArgs, MetaFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { db } from "~/utils/db.server";
import { Form, Link, useCatch, useLoaderData, useParams } from "@remix-run/react";
import { getUser, getUserId, requireUserId } from "~/utils/session.server";


export const loader = async ({ params, request }: LoaderArgs) => {
  const userInfo = await getUser(request);
  const joke = await db.joke.findUnique({
    where: { id: params.jokeId },
  });
  if (!joke) {
    throw new Response("Joke not found", { status: 404});
  }
  const jokester = await db.user.findUnique({
    where: {id: joke.jokesterId}
  })
  return json({ joke, userInfo, jokester });
};
export const action: ActionFunction = async({request, params}) => {
  let form = await request.formData();
  let userId= await getUserId(request);
  if(form.get('_method') === 'delete'){
    const joke = await db.joke.findUnique({
      where: { id: params.jokeId },
    });
    if(!joke) {
      throw new Response("What a joke! Not found", { status: 404})
    }
    if(joke.jokesterId === userId) {
      await db.joke.delete({
        where: { 
          id: params.jokeId,
        },
      })
      return redirect("/jokes/myJokes");
    }
    throw new Response("You are not allowed to delete this joke!", {status: 403});
  }
  //return redirect("/jokes/myJokes");
}
export const meta: MetaFunction = ({data}) => ({
  title: data?.joke?.name ? `Jokes |  ${data?.joke?.name}` : "Some joke",
});
export default function JokeRoute() {
  let data = useLoaderData<typeof loader>();
  let isOwner = data.joke.jokesterId === data.userInfo?.id
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
            isOwner &&
          
            <Form method="post">
              <input type="hidden" name="_method" value="delete" />
              <button type="submit" className="button"  style={{"marginTop":"1rem","fontWeight":"bold","width":"35%"}}>
                Delete
              </button>
            </Form>
          }
        </div>
      </div>
    );
  }
  export function CatchBoundary() {
    let caught = useCatch();
    switch(caught.status) {
      case 404:
        return(
          <div className="error-container">
            <p>Joke not found!</p>
            <Link to="/jokes">Back to Jokes</Link>
          </div>
        );
        case 403:
        return(
          <div className="error-container">
            <p>You are not allowed to delete this joke</p>
            <Link to="/jokes/myJokes">Go to My Jokes</Link>
          </div>
        );
        default:
          throw new Error(`Unexpected caught response with status: ${caught.status}`)
    }
  }

  
  export function ErrorBoundary({error}:{error:Error}) {
    const { jokeId } = useParams();
    return (
      <div className="error-container">{`There was an error with loading or handeling joke by the id ${jokeId}. Sorry.`}<br/><em><strong>{error.message}</strong></em></div>
    );
  }