import { Form } from "@remix-run/react";

export default function NewJokeRoute() {
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
            <button type="submit" className="button">
              Add
            </button>
          </div>
        </Form>
      </div>
    );
  }