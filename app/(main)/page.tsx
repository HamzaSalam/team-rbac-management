import Link from "next/link";
import { featureNames, roleNames } from "../const";

export default function Home() {
  const user = false;
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-3xl text-white mb-6 font-bold">
        Team Access Control
      </h1>
      <p className="mb-8 text-slate-300">
        Manage access to your team's resources with ease.
      </p>
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3>Features Demonstration</h3>
          <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
            {featureNames.map((feature, index) => (
              <li key={index}>{feature.name}</li>
            ))}
          </ul>
        </div>
        <div className="bg-slate-800 p-6 border border-slate-700 rounded-lg">
          <h3>User Roles</h3>
          <ul className="list-disc list-inside text-slate-300 text-sm space-y-1">
            {roleNames.map((role, index) => (
              <li key={index}>
                <strong className={role.color}>{role.role}</strong> {role.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {user ? (
        <div className="bg-green-900/30 border border-green-600 rounded-lg p-4">
          <p className="text-green-300">
            Wellcome Back <strong>Hamza</strong>! You are logged in as{" "}
            <strong>user</strong>.
          </p>
          <Link
            href="/dashboard"
            className="text-green-300 hover:text-green-400 bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg mt-4 inline-block"
          >
            Go to Dashboard
          </Link>
        </div>
      ) : (
        <div className="bg-blue-900/30 border border-blue-600 rounded-lg p-4">
          <p className="text-slate-300 mb-4">
            You are not logged in. Please log in to access the dashboard.
          </p>
          <Link
            href="/login"
            className="text-slate-300 bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg mr-2"
          >
            Login
          </Link>
          <Link
            href="/register"
            className="text-slate-300 border border-slate-600 hover:bg-blue-700 px-4 py-2 rounded-lg"
          >
            Register
          </Link>
        </div>
      )}
    </div>
  );
}
