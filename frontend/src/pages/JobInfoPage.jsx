import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function JobInfoPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: "",
    jobTitle: "",
    jobDescription: "",
    requirements: "",
    applicationUrl: "",
    contactPerson: "",
  });

  // בדיקה אם המשתמש מילא את הפרטים האישיים
  useEffect(() => {
    const userInfo = localStorage.getItem("userInfo");
    if (!userInfo) {
      navigate("/user-info");
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // שמירת נתוני המשרה
    localStorage.setItem("jobInfo", JSON.stringify(formData));
    navigate("/generate");
  };

  const handlePasteJobPosting = async () => {
    try {
      const text = await navigator.clipboard.readText();

      // זיהוי אוטומטי חכם של פרטי המשרה
      const parsedData = parseJobPosting(text);

      // מילוי תיאור המשרה (ללא URLs)
      const cleanJobDescription = parsedData.cleanJobDescription || text;

      const updatedData = {
        jobDescription: cleanJobDescription,
        ...parsedData.extractedData,
      };

      setFormData((prev) => ({
        ...prev,
        ...updatedData,
      }));

      // הודעת משוב מפורטת
      const filledFields = [];
      if (parsedData.extractedData.companyName) filledFields.push("Company");
      if (parsedData.extractedData.jobTitle) filledFields.push("Job Title");
      if (parsedData.extractedData.applicationUrl) filledFields.push("URL");

      if (filledFields.length > 0) {
        showNotification(
          `Job posting pasted! Auto-filled: ${filledFields.join(", ")}`
        );
      } else {
        showNotification("Job posting pasted successfully!");
      }
    } catch (err) {
      console.error("Failed to read clipboard: ", err);
      showNotification(
        "Unable to access clipboard. Please paste manually.",
        "error"
      );
    }
  };

  const parseJobPosting = (text) => {
    const extractedData = {};

    // זיהוי וחילוץ URLs
    const urlPattern = /(https?:\/\/[^\s]+)/gi;
    const urls = text.match(urlPattern) || [];

    // ניקוי הטקסט מ-URLs לתיאור המשרה
    let cleanText = text;
    urls.forEach((url) => {
      cleanText = cleanText.replace(url, "").replace(/\s+/g, " ").trim();
    });

    // זיהוי שם חברה (דפוסים נפוצים)
    const companyPatterns = [
      /(?:at |@|company:|employer:|join )\s*([A-Za-z0-9\s&.,'-]{2,50})/i,
      /([A-Za-z0-9\s&.,'-]{2,30})\s+(?:is hiring|seeks|looking for)/i,
    ];

    // זיהוי תפקיד
    const titlePatterns = [
      /(?:position:|role:|title:|job:|hiring:)\s*([A-Za-z0-9\s&.,'-]{2,50})/i,
      /(?:we are looking for|seeking|hiring)\s+(?:a |an )?([A-Za-z0-9\s&.,'-]{2,50})/i,
    ];

    // חיפוש שם חברה
    for (const pattern of companyPatterns) {
      const match = text.match(pattern);
      if (match && !formData.companyName) {
        extractedData.companyName = match[1].trim();
        break;
      }
    }

    // חיפוש תפקיד
    for (const pattern of titlePatterns) {
      const match = text.match(pattern);
      if (match && !formData.jobTitle) {
        extractedData.jobTitle = match[1].trim();
        break;
      }
    }

    // שימוש ב-URL הראשון שנמצא (בדרך כלל זה קישור המשרה)
    if (urls.length > 0 && !formData.applicationUrl) {
      extractedData.applicationUrl = urls[0];
    }

    return {
      extractedData,
      cleanJobDescription: cleanText,
    };
  };

  const showNotification = (message, type = "success") => {
    // יצירת הודעה זמנית
    const notification = document.createElement("div");
    notification.textContent = message;
    notification.className = `fixed top-4 right-4 px-4 py-2 rounded-lg text-white text-sm z-50 ${
      type === "success" ? "bg-green-500" : "bg-red-500"
    }`;

    document.body.appendChild(notification);

    setTimeout(() => {
      document.body.removeChild(notification);
    }, 3000);
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="card">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Job Information
          </h2>
          <p className="text-gray-600">
            Tell us about the job you're applying for so we can tailor your
            cover letter.
          </p>
        </div>

        {/* Quick Paste Section */}
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-gray-900 mb-1">
                Quick Fill from Job Posting
              </h3>
              <p className="text-sm text-gray-600">
                Copy the entire job posting and paste it here to auto-fill all
                fields
              </p>
            </div>
            <button
              type="button"
              onClick={handlePasteJobPosting}
              className="btn-primary flex items-center gap-2"
            >
              📋 Paste Job Posting
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Company Name */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              name="companyName"
              value={formData.companyName}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g. Google, Microsoft, Startup Inc."
              required
            />
          </div>

          {/* Job Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Title *
            </label>
            <input
              type="text"
              name="jobTitle"
              value={formData.jobTitle}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g. Frontend Developer, Marketing Manager"
              required
            />
          </div>

          {/* Job Description */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              name="jobDescription"
              value={formData.jobDescription}
              onChange={handleInputChange}
              className="input-field"
              rows="5"
              placeholder="Job description will be auto-filled when you paste above, or type manually here..."
              required
            />
          </div>

          {/* Requirements */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Key Requirements *
            </label>
            <textarea
              name="requirements"
              value={formData.requirements}
              onChange={handleInputChange}
              className="input-field"
              rows="4"
              placeholder="List the main requirements, skills, and qualifications mentioned in the job posting..."
              required
            />
          </div>

          {/* Contact Person */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Hiring Manager / Contact Person
            </label>
            <input
              type="text"
              name="contactPerson"
              value={formData.contactPerson}
              onChange={handleInputChange}
              className="input-field"
              placeholder="e.g. Sarah Johnson, HR Manager"
            />
          </div>

          {/* Application URL */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Job Posting URL
            </label>
            <input
              type="url"
              name="applicationUrl"
              value={formData.applicationUrl}
              onChange={handleInputChange}
              className="input-field"
              placeholder="Will be auto-filled from job posting, or enter manually"
            />
          </div>

          {/* Navigation */}
          <div className="flex justify-between pt-4">
            <Link to="/user-info" className="btn-secondary">
              Back: Personal Info
            </Link>
            <button type="submit" className="btn-primary">
              Generate Cover Letter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default JobInfoPage;
