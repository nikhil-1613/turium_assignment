import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import DashboardPage from "./pages/Dashboard";
import ServiceDetailPage from "./pages/ServiceDetailPage";


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<DashboardPage />} />
        <Route path="/service/:name" element={<ServiceDetailPage />} />
      </Routes>
    </Router>
  );
}

export default App;
