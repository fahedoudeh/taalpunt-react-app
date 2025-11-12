import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Lessons from "./pages/lessons/Lessons.jsx";
import LessonDetail from "./pages/lessonDetail/LessonDetail.jsx";
import Activities from "./pages/activities/Activities.jsx";
import ActivityDetail from "./pages/activityDetail/ActivityDetail.jsx";
import Board from "./pages/board/Board.jsx";
import TeachersRoom from "./pages/teachersRoom/TeachersRoom.jsx";
import Profile from "./pages/profile/Profile.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Layout from "./components/layout/layout/Layout.jsx";

import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* Public routes without layout */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private + layout */}
        <Route
          element={
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          }
        >
          <Route path="/" element={<Dashboard />} />
          <Route path="/lessons" element={<Lessons />} />
          <Route path="/lessons/:id" element={<LessonDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/board" element={<Board />} />
          <Route path="/teachers" element={<TeachersRoom />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
