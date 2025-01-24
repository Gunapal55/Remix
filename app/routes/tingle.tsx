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

  const [isSidebarOpen, setSidebarOpen] = useState(true);

  return (
    <div className="min-h-screen bg-gray-900">
      <Navbar userName={data.user.name} />
      
      <div className="flex h-[calc(100vh-64px)]">
        {/* Hamburger Button */}
        <button
          onClick={() => setSidebarOpen(!isSidebarOpen)}
          className="fixed left-4 top-20 z-20 p-2 rounded-md bg-gray-800 text-white md:hidden"
          aria-label="Toggle Menu"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            {isSidebarOpen ? (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            ) : (
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            )}
          </svg>
        </button>

        {/* Sidebar with animation */}
        <div
          className={`fixed md:static w-64 bg-gray-800 border-r border-gray-700 h-full transition-transform duration-300 ease-in-out z-10 ${
            isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'
          }`}
        >
          <div className="p-4">
            <h1 className="text-2xl font-bold text-white mb-6">Tingle</h1>
            <div className="space-y-2">
              {['profile', 'activities', 'stats'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`w-full text-left px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab 
                      ? 'bg-blue-600 text-white' 
                      : 'text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <div className="flex items-center">
                    {tab === 'profile' && (
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    )}
                    {tab === 'activities' && (
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                    )}
                    {tab === 'stats' && (
                      <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    )}
                    {tab.charAt(0).toUpperCase() + tab.slice(1)}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Overlay for mobile */}
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-0 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 overflow-auto p-8 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto">
            {/* Remove the buttons section and keep only the content */}
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
    </div>
  );
}