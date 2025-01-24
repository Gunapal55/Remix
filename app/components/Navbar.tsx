import { Form, Link } from "@remix-run/react";

type NavbarProps = {
  userName: string | null;
};

export default function Navbar({ userName }: NavbarProps) {
  return (
    <nav className="bg-gray-800 px-4 py-3">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link to="/dashboard" className="text-white text-xl font-bold">
          Dashboard
        </Link>
        
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
    </nav>
  );
}