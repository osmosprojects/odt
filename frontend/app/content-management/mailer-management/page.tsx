import DashboardShell from "@/components/DashboardShell";
import MailerManagement from "@/components/mailer-management/MailerManagement";

export default function MailerManagementPage() {
  return (
    <DashboardShell>
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
            Mailer Management
          </h1>
          <p className="text-xs sm:text-sm text-brand-gray">
            Create, review, and schedule automated mailers under Content
            Management.
          </p>
        </div>
      </div>

      <div className="mt-4 sm:mt-6">
        <MailerManagement />
      </div>
    </DashboardShell>
  );
}