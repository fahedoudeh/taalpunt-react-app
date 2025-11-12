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
import "./App.css";

function App() {
  return (
    <>
      <Routes>
        {/* Public */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Private */}
        <Route
          path="/"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/lessons"
          element={
            <PrivateRoute>
              <Lessons />
            </PrivateRoute>
          }
        />
        <Route
          path="/lessons/:id"
          element={
            <PrivateRoute>
              <LessonDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/activities"
          element={
            <PrivateRoute>
              <Activities />
            </PrivateRoute>
          }
        />
        <Route
          path="/activities/:id"
          element={
            <PrivateRoute>
              <ActivityDetail />
            </PrivateRoute>
          }
        />
        <Route
          path="/board"
          element={
            <PrivateRoute>
              <Board />
            </PrivateRoute>
          }
        />
        <Route
          path="/teachers"
          element={
            <PrivateRoute>
              <TeachersRoom />
            </PrivateRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <Profile />
            </PrivateRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
