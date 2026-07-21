import DashboardShell from "@/components/DashboardShell";
import InputManagement from "@/components/input-management/InputManagement";

export default function InputManagementPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            Input Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Upload masters, upload master type files, and view the master list.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <InputManagement />
      </div>
    </DashboardShell>
  );
} 