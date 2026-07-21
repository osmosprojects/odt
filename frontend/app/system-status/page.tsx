import DashboardShell from "@/components/DashboardShell";
import DatabaseModuleTracker from "@/components/DatabaseModuleTracker";

export default function SystemStatusPage() {
  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold text-brand-dark">System & Database Status</h1>
          <p className="text-xs text-brand-gray">Internal technical status & MySQL 6-database module sync tracker</p>
        </div>
        <DatabaseModuleTracker />
      </div>
    </DashboardShell>
  );
}
