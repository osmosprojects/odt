import DashboardShell from "@/components/DashboardShell";
import GreetingBar from "@/components/GreetingBar";
import StatCards from "@/components/StatCards";
import MostUsedApps from "@/components/MostUsedApps";
import RecentActivities from "@/components/RecentActivities";
import MyToDoList from "@/components/MyToDoList";
import Announcements from "@/components/Announcements";
import QuickActions from "@/components/QuickActions";

export default function DashboardPage() {
  return (
    <DashboardShell>
      {/* Mobile view layout */}
      <div className="space-y-4 lg:hidden">
        <GreetingBar />
        <StatCards />
        <MostUsedApps />
        <MyToDoList />
        <QuickActions />
        <RecentActivities />
        <Announcements />
      </div>

      {/* Desktop & Tablet grid layout */}
      <div className="hidden lg:grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          <GreetingBar />
          <StatCards />
          <MostUsedApps />
          <RecentActivities />
        </div>

        <div className="space-y-4 sm:space-y-6">
          <MyToDoList />
          <QuickActions />
          <Announcements />
        </div>
      </div>
    </DashboardShell>
  );
}
