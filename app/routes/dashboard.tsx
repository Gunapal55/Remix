import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Link } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";

type LoaderData = {
  user: {
    id: string;
    email: string;
    name: string | null;
    createdAt: string;
  };
};

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const userId = await requireUserId(request);
    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        createdAt: true,
      }
    });

    if (!user) {
      throw new Response("Not Found", { status: 404 });
    }

    return json<LoaderData>({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString(),
      }
    });
  } catch (error) {
    if (error instanceof Response) {
      throw error;
    }
    throw new Response("Unauthorized", { status: 401 });
  }
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-gray-900 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-white">Dashboard</h1>
        <div className="bg-gray-800 p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
          <div className="space-y-2 text-gray-300">
            <p>
              <strong className="text-white">Name:</strong> {data.user.name || 'Not provided'}
            </p>
            <p>
              <strong className="text-white">Email:</strong> {data.user.email}
            </p>
            <p>
              <strong className="text-white">Member since:</strong>{" "}
              {new Date(data.user.createdAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}