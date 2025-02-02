import { LoaderFunction, json } from "@remix-run/node";
import { useLoaderData, Link, Form, useActionData } from "@remix-run/react";
import { requireUserId } from "~/utils/auth.server";
import { db } from "~/utils/db.server";
import { useState, useEffect } from "react";
import Navbar from "~/components/Navbar";
import { useRef } from "react";

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
        {/* Sidebar with animation */}
        <div
          className={`fixed md:static w-16 hover:w-64 bg-gray-800 h-full 
            transition-all duration-300 ease-in-out transform z-10 group border-r border-gray-700
            ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
        >
          <div className="p-4 h-full">
            {/* User Profile Section */}
            <div className="mb-8 flex items-center space-x-4">
              <div className="w-10 h-10 rounded-full bg-gray-600 flex-shrink-0 overflow-hidden">
                <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <span className="text-white hidden group-hover:block whitespace-nowrap">
                {data.user.name || 'User'}
              </span>

            </div>
            {/* Navigation Items */}
            <div className="space-y-6">
              <button
                onClick={() => setActiveTab('profile')}
                className={`w-full flex items-center space-x-4 p-2 rounded-lg transition-all duration-200
                  ${activeTab === 'profile' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <span className="hidden group-hover:block whitespace-nowrap">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab('activities')}
                className={`w-full flex items-center space-x-4 p-2 rounded-lg transition-all duration-200
                  ${activeTab === 'activities' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                <span className="hidden group-hover:block whitespace-nowrap">Activities</span>
              </button>

              <button
                onClick={() => setActiveTab('stats')}
                className={`w-full flex items-center space-x-4 p-2 rounded-lg transition-all duration-200
                  ${activeTab === 'stats' 
                    ? 'bg-blue-600 text-white' 
                    : 'text-gray-300 hover:bg-gray-700 hover:text-white'}`}
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <span className="hidden group-hover:block whitespace-nowrap">Analytics</span>
              </button>
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
        <div className="flex-1 overflow-auto p-8 ml-16 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
          <div className="max-w-4xl mx-auto">
            {activeTab === 'profile' && (
              <div className="space-y-6">
                <div className="bg-gray-800 p-6 rounded-lg shadow">
                  <h2 className="text-xl font-semibold mb-4 text-white">Update Profile</h2>
                  <Form method="post" className="space-y-4">
                    <input type="hidden" name="intent" value="updateProfile" />
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