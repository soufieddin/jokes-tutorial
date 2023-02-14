import type { ActionFunction} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useTransition } from "@remix-run/react";
import { db } from "~/utils/db.server";

export let action: ActionFunction = async ({request}) => {
  let formData = await request.formData();
  let name = formData.get('name');
  let content= formData.get('content')
  if (typeof name !== 'string' || typeof content !== 'string') {
    throw new Error('Form submitted incorrectly!')
  }
  let joke = await db.joke.create({
    data: {name, content}
  })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  const navigation = useTransition();
  const isSubmitting = navigation.state === 'submitting';
    return (
      <div>
        <p>Add your own hilarious joke</p>
        <Form method="post">
          <div>
            <label>
              Name: <input type="text" name="name" />
            </label>
          </div>
          <div>
            <label>
              Content: <textarea name="content" />
            </label>
          </div>
          <div>
            <button disabled={isSubmitting} type="submit" className="button">
              {isSubmitting ? "Adding..." : "Add" }
            </button>
          </div>
        </Form>
      </div>
    );
  }