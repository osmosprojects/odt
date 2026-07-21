import { recentActivities } from "@/lib/data";

const statusStyles: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-600",
  Pending: "bg-orange-50 text-orange-600",
  Failed: "bg-red-50 text-red-600",
};

export default function RecentActivities() {
  return (
    <div className="bg-white rounded-card shadow-card border border-gray-100 p-4 sm:p-5">
      <div className="flex items-center justify-between mb-3">
        <h2 className="font-semibold text-brand-dark">Recent Activities</h2>
        <button className="text-xs font-medium text-primary hover:underline">
          View All
        </button>
      </div>

      <div className="overflow-x-auto -mx-1">
        <table className="w-full text-sm min-w-[560px]">
          <thead>
            <tr className="text-left text-xs text-brand-gray border-b border-gray-100">
              <th className="py-2 px-1 font-medium">Activity</th>
              <th className="py-2 px-1 font-medium">Module</th>
              <th className="py-2 px-1 font-medium">User</th>
              <th className="py-2 px-1 font-medium">Time</th>
              <th className="py-2 px-1 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {recentActivities.map((row, i) => (
              <tr
                key={i}
                className="border-b border-gray-50 last:border-0 hover:bg-gray-50/60"
              >
                <td className="py-2.5 px-1 text-brand-dark font-medium">
                  {row.activity}
                </td>
                <td className="py-2.5 px-1 text-brand-gray">{row.module}</td>
                <td className="py-2.5 px-1 text-brand-gray">{row.user}</td>
                <td className="py-2.5 px-1 text-brand-gray whitespace-nowrap">
                  {row.time}
                </td>
                <td className="py-2.5 px-1">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[row.status]}`}
                  >
                    {row.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
