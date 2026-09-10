import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import ProjectsPage from "./pages/ProjectsPage";
import ProjectDetailPage from "./pages/ProjectDetailPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/projects" />} />
        <Route path="/login" element={<LoginPage />}/>
        <Route path="/projects" element={<ProjectsPage />}/>
        <Route path="/projects/:id" element={<ProjectDetailPage />}/>
        <Route path="*" element={<div className="p-8">Page introuvable.</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App
