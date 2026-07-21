import ReportStatCards from "./ReportStatCards";
import OfferPerformanceOverview from "./OfferPerformanceOverview";

export default function ReportsAnalyticsCard() {
  return (
    <div className="space-y-4 sm:space-y-5">
      <h2 className="font-semibold text-brand-dark">Reports &amp; Analytics</h2>
      <ReportStatCards />
      <OfferPerformanceOverview />
    </div>
  );
}
