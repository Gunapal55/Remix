import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { createUser, createUserSession } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email")?.toString();
  const password = form.get("password")?.toString();
  const name = form.get("name")?.toString();

  if (!email || !password || !name) {
    return json({ error: "All fields are required" }, { status: 400 });
  }

  try {
    const user = await createUser(email, password, name);
    return createUserSession(user.id, "/dashboard");
  } catch (error) {
    return json({ error: "Email already exists" }, { status: 400 });
  }
};

export default function Register() {
  const actionData = useActionData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-bold text-white">Register</h2>
        <Form method="post" className="space-y-6">
          {actionData?.error && (
            <div className="text-red-400 text-center">{actionData.error}</div>
          )}
          <div className="space-y-2">
            <label htmlFor="name" className="block text-sm font-medium text-gray-300">
              Name
            </label>
            <input
              type="text"
              name="name"
              id="name"
              required
              className="w-full p-3 border bg-gray-700 border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your name"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-gray-300">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              required
              className="w-full p-3 border bg-gray-700 border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your email"
            />
          </div>
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-300">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              required
              className="w-full p-3 border bg-gray-700 border-gray-600 rounded-md text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter your password"
            />
          </div>
          <button
            type="submit"
            className="w-full py-3 px-4 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors"
          >
            Register
          </button>
        </Form>
      </div>
    </div>
  );
}