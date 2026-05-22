import { Breadcrumb } from "@/components/layout/Breadcrumb";

export function Dashboard() {
  return (
    <div className="flex-1 overflow-auto bg-gray-50">
      <div className="p-6">
        <div className="mb-4">
          <Breadcrumb items={["Dashboard"]} />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-6">Dashboard</h1>
        <div className="bg-white rounded-lg border border-gray-200 p-8 text-center text-gray-400">
          Dashboard content coming soon
        </div>
      </div>
    </div>
  );
}
