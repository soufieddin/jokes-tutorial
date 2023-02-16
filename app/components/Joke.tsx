import type { Joke } from "@prisma/client";
import { Form, Link } from "@remix-run/react";


export function JokeDisplay ({joke, isOwner, canDelete=true}:{joke:Pick<Joke, 'name'| 'content'>, isOwner:boolean, canDelete:boolean}) {
    return (
        <div>
        <p>Here's your hilarious joke<br /> Subject: <strong>{joke?.name}</strong></p>
        <p>
          {joke?.content}
        </p>
        <div style={{"display":"flex", "flexDirection":"column"}}>
          <Link to=".">{joke.name} Permalink</Link>
          {
            isOwner &&
          
            <Form method="post">
              <input type="hidden" name="_method" value="delete" />
              <button disabled={!canDelete} type="submit" className="button"  style={{"marginTop":"1rem","fontWeight":"bold","width":"35%"}}>
                {canDelete ? "Delete" : "Adding your joke..."}
              </button>
            </Form>
          }
        </div>
      </div>
    )
}