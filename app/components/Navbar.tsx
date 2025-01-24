import { Form, Link } from "@remix-run/react";

type NavbarProps = {
  userName: string | null;
};

export default function Navbar({ userName }: { userName: string | null }) {
  return (
    <nav className="bg-gray-800 h-16">
      <div className="mx-auto px-4 sm:px-6 lg:px-8 h-full">
        <div className="flex items-center justify-between h-full">
          <div className="flex items-center">
            <Link 
              to="/dashboard"
              className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500"
            >
              Tingle
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-gray-300">
              Welcome, {userName || 'User'}
            </span>
            <Form action="/logout" method="post">
              <button
                type="submit"
                className="text-gray-300 hover:text-white px-3 py-2 rounded-md text-sm"
              >
                Logout
              </button>
            </Form>
          </div>
        </div>
      </div>
    </nav>
  );
}