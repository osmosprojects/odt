import DashboardShell from "@/components/DashboardShell";
import MyToDoList from "@/components/MyToDoList";

export default function ToDoListPage() {
  return (
    <DashboardShell>
      <div>
        <h1 className="text-lg sm:text-xl font-bold text-brand-dark">
          To Do List
        </h1>
        <p className="text-xs sm:text-sm text-brand-gray">
          Track and manage all your pending tasks.
        </p>
      </div>

      <MyToDoList />
    </DashboardShell>
  );
}
