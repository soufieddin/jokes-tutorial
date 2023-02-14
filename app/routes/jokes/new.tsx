import type { ActionFunction, ActionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form, useActionData, useTransition } from "@remix-run/react";
import { db } from "~/utils/db.server";
import { badRequest } from "~/utils/request.server";

function validateJokeName(name: string){
  if(name.trim().length < 3) {
    return "Joke name must be at least 3 characters long"
  }
}

function validateJokeContent(content: string){
  if(content.trim().length < 12) {
    return "Joke content must be at least 12 characters long"
  }
}

export let action: ActionFunction = async ({request}: ActionArgs) => {
  let formData = await request.formData();
  let name = formData.get('name');
  let content= formData.get('content')
  if (typeof name !== 'string' || typeof content !== 'string') {
    return badRequest({
      fieldErrors: null,
      fields: null,
      formError: `Form not submitted correctly.`,
    });
  }
  const fieldErrors = {
    name: validateJokeName(name),
    content: validateJokeContent(content)
  }
  const fields = { name, content };

  if(Object.values(fieldErrors).some(Boolean)){
    return badRequest({
      fieldErrors,
      fields,
      formError: null,
    });
  }
  let joke = await db.joke.create({
    data: fields
  })
  return redirect(`/jokes/${joke.id}`)
}

export default function NewJokeRoute() {
  const navigation = useTransition();
  const isSubmitting = navigation.state === 'submitting';
  let actionData = useActionData<typeof action>();
    return (
      <div>
        <p>Add your own hilarious joke</p>
        <Form method="post">
        <div>
          <label>
            Name:{" "}
            <input
              type="text"
              defaultValue={actionData?.fields?.name}
              name="name"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.name) ||
                undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.name
                  ? "name-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.name ? (
            <p
              className="form-validation-error"
              role="alert"
              id="name-error"
            >
              {actionData.fieldErrors.name}
            </p>
          ) : null}
        </div>
        <div>
          <label>
            Content:{" "}
            <textarea
              defaultValue={actionData?.fields?.content}
              name="content"
              aria-invalid={
                Boolean(actionData?.fieldErrors?.content) ||
                undefined
              }
              aria-errormessage={
                actionData?.fieldErrors?.content
                  ? "content-error"
                  : undefined
              }
            />
          </label>
          {actionData?.fieldErrors?.content ? (
            <p
              className="form-validation-error"
              role="alert"
              id="content-error"
            >
              {actionData.fieldErrors.content}
            </p>
          ) : null}
        </div>
        <div>
          {actionData?.formError ? (
            <p
              className="form-validation-error"
              role="alert"
            >
              {actionData.formError}
            </p>
          ) : null}
            <button disabled={isSubmitting} type="submit" className="button">
              {isSubmitting ? "Adding..." : "Add" }
            </button>
          </div>
        </Form>
      </div>
    );
  }