import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import UserInfoPage from "./pages/UserInfoPage";
import JobInfoPage from "./pages/JobInfoPage";
import GeneratePage from "./pages/GeneratePage";

function App() {
  return (
    <Router>
      <div
        className="min-h-screen bg-gray-50"
        style={{ backgroundColor: "#f9fafb", minHeight: "100vh" }}
      >
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-4xl mx-auto px-4 py-6">
            <div className="text-center">
              <h1 className="text-3xl font-bold text-gray-900">
                AI Cover Letter Buddy
              </h1>
              <p className="mt-2 text-gray-600">
                Create personalized cover letters with AI assistance
              </p>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="page-container">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/user-info" element={<UserInfoPage />} />
            <Route path="/job-info" element={<JobInfoPage />} />
            <Route path="/generate" element={<GeneratePage />} />
          </Routes>
        </main>

        {/* Footer */}
        <footer className="bg-white border-t border-gray-200 mt-16">
          <div className="max-w-4xl mx-auto px-4 py-6 text-center">
            <p className="text-gray-500 text-sm">
              Built with coffie&love • © 2025 AI Cover Letter Buddy
            </p>
          </div>
        </footer>
      </div>
    </Router>
  );
}

export default App;
