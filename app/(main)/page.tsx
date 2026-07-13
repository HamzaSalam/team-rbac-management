import { featureNames, roleNames } from "../const";

export default function Home() {
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
                <strong>{role.role}</strong> {role.name}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
