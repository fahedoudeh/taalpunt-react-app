import { Routes, Route } from "react-router-dom";
import Login from "./pages/login/Login";
import Register from "./pages/register/Register";
import Dashboard from "./pages/dashboard/Dashboard";
import Lessons from "./pages/lessons/Lessons.jsx";
import LessonDetail from "./pages/lessonDetail/LessonDetail.jsx";
import Homework from "./pages/homework/Homework.jsx";
import HomeworkDetail from "./pages/homeworkDetail/HomeworkDetail.jsx";
import Activities from "./pages/activities/Activities.jsx";
import ActivityDetail from "./pages/activityDetail/ActivityDetail.jsx";
import Board from "./pages/board/Board.jsx";
import MessageDetail from "./pages/messageDetail/MessageDetail.jsx";
import TeachersRoom from "./pages/teachersRoom/TeachersRoom.jsx";
import Profile from "./pages/profile/Profile.jsx";
import NotFound from "./pages/notFound/NotFound.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";
import Layout from "./components/layout/layout/Layout.jsx";
import RoleRoute from "./routes/RoleRoute.jsx";
import TeachersBoard from "./pages/teachersBoard/TeachersBoard";

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
          <Route path="/homework" element={<Homework />} />
          <Route path="homework/:id" element={<HomeworkDetail />} />
          <Route path="/activities" element={<Activities />} />
          <Route path="/activities/:id" element={<ActivityDetail />} />
          <Route path="/board" element={<Board />} />
          <Route path="/board/:id" element={<MessageDetail />} />
          <Route
            path="/teachers-room"
            element={
              <RoleRoute allow={["teacher", "admin"]}>
                <TeachersRoom />
              </RoleRoute>
            }
          />
          <Route
            path="/teachers-board"
            element={
              <RoleRoute allow={["teacher", "admin"]}>
                <TeachersBoard />
              </RoleRoute>
            }
          />
          <Route path="/profile" element={<Profile />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
