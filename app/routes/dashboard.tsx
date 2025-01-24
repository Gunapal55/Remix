import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Link, Form, useActionData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { useState, useEffect } from "react";
import Navbar from "~/components/Navbar";

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

export const action: ActionFunction = async ({ request }) => {
  const userId = await requireUserId(request);
  const form = await request.formData();
  const name = form.get("name")?.toString();

  try {
    await db.user.update({
      where: { id: userId },
      data: { name },
    });
    return json({ success: true });
  } catch (error) {
    return json({ error: "Failed to update profile" }, { status: 400 });
  }
};

export default function Dashboard() {
  const data = useLoaderData<typeof loader>();
  const actionData = useActionData();
  const [activeTab, setActiveTab] = useState('profile');
  const [showQuote, setShowQuote] = useState(false);
  const [quote, setQuote] = useState('');
  
  // Move quotes outside component to avoid recreation on each render
  const inspirationalQuotes = [
    "The only way to do great work is to love what you do.",
    "Innovation distinguishes between a leader and a follower.",
    "Stay hungry, stay foolish.",
    "Code is like humor. When you have to explain it, it's bad.",
    "First, solve the problem. Then, write the code."
  ];

  // Use useEffect to handle client-side interactions
  useEffect(() => {
    if (showQuote && !quote) {
      const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
      setQuote(inspirationalQuotes[randomIndex]);
    }
  }, [showQuote, quote]);

  const getRandomQuote = () => {
    setShowQuote(true);
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length);
    setQuote(inspirationalQuotes[randomIndex]);
  };

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar userName={data.user.name} />
      
      <div className="p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <div className="space-x-4">
              {['profile', 'activities', 'stats'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 rounded-md ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                  }`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow mb-6">
                <h2 className="text-xl font-semibold mb-4 text-white">Update Profile</h2>
                <Form method="post" className="space-y-4">
                  {actionData?.error && (
                    <div className="text-red-400">{actionData.error}</div>
                  )}
                  {actionData?.success && (
                    <div className="text-green-400">Profile updated successfully!</div>
                  )}
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-300">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      defaultValue={data.user.name || ''}
                      className="mt-1 w-full p-3 border bg-gray-700 border-gray-600 rounded-md text-white"
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                  >
                    Update Profile
                  </button>
                </Form>
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-white">Profile Information</h2>
                <div className="space-y-2 text-gray-300">
                  <p><strong className="text-white">Name:</strong> {data.user.name || 'Not provided'}</p>
                  <p><strong className="text-white">Email:</strong> {data.user.email}</p>
                  <p><strong className="text-white">Member since:</strong> {new Date(data.user.createdAt).toLocaleDateString()}</p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-white">Daily Inspiration</h2>
                <button
                  onClick={getRandomQuote}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md mb-4"
                >
                  Get Inspired!
                </button>
                {showQuote && (
                  <p className="text-gray-300 italic">{quote}</p>
                )}
              </div>

              <div className="bg-gray-800 p-6 rounded-lg shadow">
                <h2 className="text-xl font-semibold mb-4 text-white">Quick Links</h2>
                <div className="grid grid-cols-2 gap-4">
                  <a
                    href="https://github.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 p-4 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-semibold text-white">GitHub</h3>
                    <p className="text-sm">Check out trending repositories</p>
                  </a>
                  <a
                    href="https://dev.to"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-gray-700 p-4 rounded-lg text-gray-300 hover:bg-gray-600 transition-colors"
                  >
                    <h3 className="font-semibold text-white">Dev.to</h3>
                    <p className="text-sm">Read latest tech articles</p>
                  </a>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'stats' && (
            <div className="bg-gray-800 p-6 rounded-lg shadow">
              <h2 className="text-xl font-semibold mb-4 text-white">Your Activity Stats</h2>
              <div className="grid grid-cols-3 gap-4">
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold">Login Streak</h3>
                  <p className="text-2xl text-blue-400">1 day</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold">Profile Views</h3>
                  <p className="text-2xl text-blue-400">0</p>
                </div>
                <div className="bg-gray-700 p-4 rounded-lg">
                  <h3 className="text-white font-semibold">Achievement Points</h3>
                  <p className="text-2xl text-blue-400">100</p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}