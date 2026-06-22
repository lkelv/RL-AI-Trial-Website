import { PARENT_DASHBOARD } from "../../data";
import { AppShell } from "../../components/layout/AppShell";
import { PerformanceDashboard } from "../../components/dashboard/PerformanceDashboard";

export default function ParentDashboard() {
  return (
    <AppShell fill>
      <PerformanceDashboard data={PARENT_DASHBOARD} />
    </AppShell>
  );
}
