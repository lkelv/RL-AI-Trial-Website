import { Navigate, Route, Routes } from "react-router-dom";
import { Background } from "./components/layout/Background";
import { RequireAuth } from "./components/layout/RequireAuth";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import StudentHome from "./pages/student/StudentHome";
import AiFeaturesHub from "./pages/student/AiFeaturesHub";
import PracticeWizard from "./pages/student/practice/PracticeWizard";
import AiMarking from "./pages/student/AiMarking";
import AskAi from "./pages/student/AskAi";
import ClassroomList from "./pages/student/classroom/ClassroomList";
import ClassroomDetail from "./pages/student/classroom/ClassroomDetail";
import ParentDashboard from "./pages/parent/ParentDashboard";
import ComingSoon from "./pages/placeholder/ComingSoon";

function StudentRoute({ children }: { children: React.ReactNode }) {
  return <RequireAuth role="student">{children}</RequireAuth>;
}

export default function App() {
  return (
    <>
      <Background />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />

        {/* Student portal */}
        <Route path="/student" element={<StudentRoute><StudentHome /></StudentRoute>} />
        <Route path="/student/ai" element={<StudentRoute><AiFeaturesHub /></StudentRoute>} />
        <Route path="/student/ai/practice" element={<StudentRoute><PracticeWizard /></StudentRoute>} />
        <Route path="/student/ai/marking" element={<StudentRoute><AiMarking /></StudentRoute>} />
        <Route path="/student/ai/ask" element={<StudentRoute><AskAi /></StudentRoute>} />
        <Route path="/student/classroom" element={<StudentRoute><ClassroomList /></StudentRoute>} />
        <Route
          path="/student/classroom/:classId"
          element={<StudentRoute><ClassroomDetail /></StudentRoute>}
        />

        {/* Parent portal */}
        <Route
          path="/parent"
          element={
            <RequireAuth role="parent">
              <ParentDashboard />
            </RequireAuth>
          }
        />

        {/* Coming soon (public) */}
        <Route path="/teacher" element={<ComingSoon variant="teacher" />} />
        <Route path="/admin" element={<ComingSoon variant="admin" />} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
