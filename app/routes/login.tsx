import { ActionFunction, json } from "@remix-run/node";
import { Form, useActionData, Link } from "@remix-run/react";
import { createUserSession, login } from "~/utils/auth.server";

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const email = form.get("email")?.toString();
  const password = form.get("password")?.toString();

  if (!email || !password) {
    return json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = await login(email, password);
  if (!user) {
    return json({ error: "Invalid credentials" }, { status: 400 });
  }

  return createUserSession(user.id, "/dashboard");
};

export default function Login() {
  const actionData = useActionData();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900">
      <div className="max-w-md w-full space-y-8 p-8 bg-gray-800 rounded-lg shadow-xl">
        <h2 className="text-center text-3xl font-bold text-white">Login</h2>
        <Form method="post" className="space-y-6">
          {actionData?.error && (
            <div className="text-red-400 text-center">{actionData.error}</div>
          )}
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
            Sign in
          </button>
          <div className="text-center text-gray-400">
            Don't have an account?{" "}
            <Link to="/register" className="text-blue-400 hover:text-blue-300">
              Register here
            </Link>
          </div>
        </Form>
      </div>
    </div>
  );
}