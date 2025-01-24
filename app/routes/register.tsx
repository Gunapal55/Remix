import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
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
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl border border-gray-700">
        <div className="text-center space-y-3">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
            Welcome to Tingle
          </h1>
          <p className="text-xl text-gray-300 font-medium">
            Create your account
          </p>
        </div>
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

          <div className="text-center text-gray-400">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-400 hover:text-blue-300">
              Login here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}