import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function UserInfoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    experience: "",
    skills: "",
    education: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // שמירת הנתונים ב-localStorage לעת עתה
    localStorage.setItem("userInfo", JSON.stringify(formData));
    navigate("/job-info");
  };

  return (
    <div className="container section-padding">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="heading-xl mb-4">Personal Information</h1>
          <p className="text-lg max-w-xl mx-auto">
            Tell us about yourself so we can create a personalized cover letter
            that highlights your unique strengths and experience.
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span
                className="text-lg font-bold"
                style={{ color: "var(--primary-600)" }}
              >
                1
              </span>
              <span
                className="ml-2 text-sm font-medium"
                style={{ color: "var(--primary-600)" }}
              >
                Your Info
              </span>
            </div>
            <div
              className="w-8 h-px"
              style={{ background: "var(--gray-300)" }}
            ></div>
            <div className="flex items-center">
              <span
                className="text-lg font-bold"
                style={{ color: "var(--gray-400)" }}
              >
                2
              </span>
              <span
                className="ml-2 text-sm"
                style={{ color: "var(--gray-400)" }}
              >
                Job Details
              </span>
            </div>
            <div
              className="w-8 h-px"
              style={{ background: "var(--gray-300)" }}
            ></div>
            <div className="flex items-center">
              <span
                className="text-lg font-bold"
                style={{ color: "var(--gray-400)" }}
              >
                3
              </span>
              <span
                className="ml-2 text-sm"
                style={{ color: "var(--gray-400)" }}
              >
                Generate
              </span>
            </div>
          </div>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Full Name *
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Enter your full name"
                required
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="input-field"
                placeholder="your.email@example.com"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="input-field"
                placeholder="Your phone number"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Professional Experience *
              </label>
              <textarea
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="input-field"
                rows="4"
                placeholder="Describe your relevant work experience, achievements, and responsibilities..."
                required
              />
            </div>

            {/* Skills */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Key Skills *
              </label>
              <textarea
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                className="input-field"
                rows="3"
                placeholder="List your relevant skills, technologies, certifications..."
                required
              />
            </div>

            {/* Education */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Education
              </label>
              <textarea
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="input-field"
                rows="2"
                placeholder="Your educational background, degrees, relevant courses..."
              />
            </div>

            {/* Navigation */}
            <div
              className="flex flex-col sm:flex-row justify-between gap-4 pt-6 border-t"
              style={{ borderColor: "var(--gray-200)" }}
            >
              <Link to="/" className="btn btn-secondary">
                ← Back to Home
              </Link>
              <button type="submit" className="btn btn-primary">
                Next: Job Information →
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default UserInfoPage;
