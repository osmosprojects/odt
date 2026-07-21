export const statCards = [
  { label: "My To Do", value: 12, sub: "Pending Tasks", color: "bg-emerald-600", icon: "todo" },
  { label: "Approvals", value: 8, sub: "Pending Approvals", color: "bg-orange-500", icon: "approvals" },
  { label: "Alerts", value: 5, sub: "Important Alerts", color: "bg-sky-500", icon: "alerts" },
  { label: "My Team", value: 24, sub: "Active Members", color: "bg-violet-500", icon: "team" },
];

export const mostUsedApps: {
  label: string;
  icon: string;
  color: string;
  href?: string;
}[] = [
  {
    label: "Add DOFA Flow",
    icon: "dofa-add",
    color: "green",
    href: "/offer-management/dofa-approval-flow?tab=add",
  },
  {
    label: "View DOFA Approval List",
    icon: "dofa-view",
    color: "blue",
    href: "/offer-management/dofa-approval-flow?tab=view",
  },
  {
    label: "Edit DOFA Matrix",
    icon: "dofa-edit",
    color: "orange",
    href: "/offer-management/dofa-approval-flow?tab=edit",
  },
  {
    label: "New Dollar",
    icon: "dollar-new",
    color: "green",
    href: "/offer-management/dollar-update?tab=new",
  },
  {
    label: "Dollar List",
    icon: "dollar-list",
    color: "blue",
    href: "/offer-management/dollar-update?tab=list",
  },
];

export const teamPerformance = [
  { region: "North", achievement: 78, target: 100 },
  { region: "West", achievement: 65, target: 100 },
  { region: "East", achievement: 82, target: 100 },
  { region: "South", achievement: 55, target: 100 },
  { region: "Central", achievement: 70, target: 100 },
];

export const offersOverview = [
  { name: "Active", value: 68, color: "#0A7D3E" },
  { name: "Pending", value: 25, color: "#FF6B00" },
  { name: "Expired", value: 16, color: "#DC3545" },
  { name: "Draft", value: 12, color: "#6C757D" },
];

export const totalOffers = offersOverview.reduce((s, o) => s + o.value, 0);

export const recentActivities = [
  {
    activity: "WBC Offer Created",
    module: "WBC & Offers",
    user: "John Doe",
    time: "21 May 2024, 09:15 AM",
    status: "Completed",
  },
  {
    activity: "User Role Updated",
    module: "User Management",
    user: "Jane Smith",
    time: "21 May 2024, 08:47 AM",
    status: "Completed",
  },
  {
    activity: "ROI Calculated",
    module: "ROI Calculator",
    user: "Mike Wilson",
    time: "21 May 2024, 08:30 AM",
    status: "Pending",
  },
];

export const announcements = [
  {
    title: "System Maintenance on 29th May 2024 from 01:00 AM to 03:00 AM",
    date: "20 May 2024",
  },
  {
    title: "New ROI Calculator is now available. Check it out!",
    date: "18 May 2024",
  },
];

export const quickActions: { label: string; href?: string }[] = [
  { label: "Create E-Claim" },
  { label: "Create WBC Offer", href: "/offer-creation" },
  { label: "ROI Calculator" },
  { label: "Add New User" },
  { label: "Raise a Request" },
];

export type NavItem = {
  label: string;
  icon?: string;
  href?: string;
  badge?: number;
  items?: NavItem[];
};

export const sidebarNav: NavItem[] = [
  { label: "Dashboard", icon: "dashboard", href: "/dashboard" },
  { label: "Content Management", icon: "crm", href: "/content-management/mailer-management" },
  { label: "Offer Letter Management", icon: "offers", href: "/offer-letters" },
  { label: "Input Management", icon: "users", href: "/input-management" },
  { label: "Reports", icon: "reports", href: "/reports-analytics" },
  { label: "Tools & Calculators", icon: "tools" },
  {
    label: "Offer Creation",
    icon: "offers",
    items: [
      { label: "Offer Creation - Customer Data", href: "/offer-creation/customer-data" },
      { label: "Offer Creation - Investment & Financials", href: "/offer-creation/investment" },
      { label: "Offer Creation - SKU & Incentive", href: "/offer-creation/sku-incentive" },
    ],
  },
  {
    label: "Offer Operations",
    icon: "offers",
    items: [
      { label: "Bulk Offer Approval", href: "/offers/bulk-approval" },
      { label: "Pipeline Stage 2 (DOFA)", href: "/offers/pipeline-s2" },
      { label: "Pipeline Stage 3 (Release)", href: "/offers/pipeline-s3" },
      { label: "Extend Offer", href: "/offers/extend" },
      { label: "Cancel / Recall Offer", href: "/offers/cancel" },
    ],
  },
  { label: "To Do List", icon: "todo", href: "/to-do-list" },
  { label: "Administration", icon: "admin" },
];

export const quickLinks = ["E-Claim", "WBC Offer", "ROI Calculator", "My Team Performance"];
