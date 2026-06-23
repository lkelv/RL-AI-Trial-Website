import { PARENT_DASHBOARD } from "../../data";
import { AppShell } from "../../components/layout/AppShell";
import { PerformanceDashboard } from "../../components/dashboard/PerformanceDashboard";

/** Student's own Performance view - same data the parent sees. */
export default function StudentPerformance() {
  return (
    <AppShell fill back={{ to: "/student", label: "Student home" }}>
      <PerformanceDashboard data={PARENT_DASHBOARD} eyebrow="Your live progress" />
    </AppShell>
  );
}
