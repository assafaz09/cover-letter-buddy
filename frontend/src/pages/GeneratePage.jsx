import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function GeneratePage() {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [jobInfo, setJobInfo] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [letterOptions, setLetterOptions] = useState({
    length: "short", // short, medium, long, auto
    focus: [], // array of focus areas
    trustMode: false, // "סומך עליי" mode
  });

  useEffect(() => {
    // בדיקה שכל הנתונים קיימים
    const userInfoData = localStorage.getItem("userInfo");
    const jobInfoData = localStorage.getItem("jobInfo");

    if (!userInfoData || !jobInfoData) {
      navigate("/user-info");
      return;
    }

    setUserInfo(JSON.parse(userInfoData));
    setJobInfo(JSON.parse(jobInfoData));
  }, [navigate]);

  const generateCoverLetter = async () => {
    setIsGenerating(true);

    try {
      console.log("🚀 Calling OpenAI API...");

      const API_URL =
        import.meta.env.VITE_API_URL ||
        "https://cover-letter-buddy-production.up.railway.app";

      const response = await fetch(`${API_URL}/api/generate-cover-letter`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userInfo,
          jobInfo,
          letterOptions,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate cover letter");
      }

      console.log("✅ Cover letter generated successfully");
      setCoverLetter(data.coverLetter);
      localStorage.setItem("generatedCoverLetter", data.coverLetter);
    } catch (error) {
      console.error("❌ Error generating cover letter:", error);

      // Show error to user
      setCoverLetter(
        `Error: ${error.message}\n\nPlease check that:\n1. Backend server is running (https://cover-letter-buddy-production.up.railway.app)\n2. OpenAI API key is configured\n3. You have sufficient OpenAI credits`
      );
    } finally {
      setIsGenerating(false);
    }
  };

  if (!userInfo || !jobInfo) {
    return <div className="text-center">Loading...</div>;
  }

  return (
    <div className="container section-padding">
      <div className="max-w-6xl mx-auto">
        {/* Progress Indicator */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center space-x-6">
            <div className="flex items-center">
              <span
                className="text-lg font-bold"
                style={{ color: "var(--gray-400)" }}
              >
                1
              </span>
              <span
                className="ml-2 text-sm"
                style={{ color: "var(--gray-400)" }}
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
                style={{ color: "var(--primary-600)" }}
              >
                3
              </span>
              <span
                className="ml-2 text-sm font-medium"
                style={{ color: "var(--primary-600)" }}
              >
                Generate
              </span>
            </div>
          </div>
        </div>

        <div className="grid gap-12 lg:grid-cols-2">
          {/* Left: Summary */}
          <div className="card">
            <h2 className="heading-lg mb-6">Application Summary</h2>

            <div className="space-y-6">
              <div>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: "var(--gray-800)" }}
                >
                  Personal Info
                </h3>
                <p className="text-gray-600">{userInfo.fullName}</p>
                <p className="text-gray-600">{userInfo.email}</p>
              </div>

              <div>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: "var(--gray-800)" }}
                >
                  Position
                </h3>
                <p className="text-gray-600">{jobInfo.jobTitle}</p>
                <p className="text-gray-600">{jobInfo.companyName}</p>
              </div>

              <div>
                <h3
                  className="font-semibold mb-3"
                  style={{ color: "var(--gray-800)" }}
                >
                  Key Skills
                </h3>
                <p className="text-gray-600 text-sm">{userInfo.skills}</p>
              </div>
            </div>

            <div
              className="mt-8 pt-6 border-t"
              style={{ borderColor: "var(--gray-200)" }}
            >
              <Link to="/job-info" className="btn btn-secondary">
                ← Edit Information
              </Link>
            </div>
          </div>

          {/* Right: Generation */}
          <div className="card">
            <h2 className="heading-lg mb-6">Generate Cover Letter</h2>

            {!coverLetter && !isGenerating && (
              <div className="py-10">
                <div className="space-y-8">
                  {/* Letter Options */}
                  <div className="space-y-6">
                    <h3
                      className="font-semibold text-lg mb-2"
                      style={{ color: "var(--gray-800)" }}
                    >
                      Customize Your Cover Letter
                    </h3>

                    {/* Trust Mode Toggle */}
                    <div
                      className="p-5 rounded-lg border"
                      style={{
                        backgroundColor: letterOptions.trustMode
                          ? "var(--primary-50)"
                          : "var(--gray-50)",
                        borderColor: letterOptions.trustMode
                          ? "var(--primary-200)"
                          : "var(--gray-200)",
                      }}
                    >
                      <label className="flex items-center space-x-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={letterOptions.trustMode}
                          onChange={(e) =>
                            setLetterOptions((prev) => ({
                              ...prev,
                              trustMode: e.target.checked,
                              length: e.target.checked ? "auto" : prev.length,
                              focus: e.target.checked ? [] : prev.focus,
                            }))
                          }
                          className="w-4 h-4 text-primary-600"
                        />
                        <div>
                          <div
                            className="font-semibold"
                            style={{ color: "var(--primary-700)" }}
                          >
                            🎯 Trust Me - Let AI Decide
                          </div>
                          <div className="text-sm text-gray-600">
                            AI will choose the optimal length and focus areas
                            for you
                          </div>
                        </div>
                      </label>
                    </div>

                    {/* Manual Options - only show if not in trust mode */}
                    {!letterOptions.trustMode && (
                      <>
                        {/* Letter Length */}
                        <div className="mt-8">
                          <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Letter Length
                          </label>
                          <div className="grid grid-cols-3 gap-4">
                            {[
                              {
                                value: "short",
                                label: "Short",
                                desc: "4-5 lines",
                              },
                              {
                                value: "medium",
                                label: "Medium",
                                desc: "6-8 lines",
                              },
                              {
                                value: "long",
                                label: "Detailed",
                                desc: "3-4 paragraphs",
                              },
                            ].map((option) => (
                              <button
                                key={option.value}
                                type="button"
                                onClick={() =>
                                  setLetterOptions((prev) => ({
                                    ...prev,
                                    length: option.value,
                                  }))
                                }
                                className={`p-4 rounded-lg border text-center transition-all ${
                                  letterOptions.length === option.value
                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                }`}
                              >
                                <div className="font-semibold">
                                  {option.label}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {option.desc}
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Focus Areas */}
                        <div className="mt-8">
                          <label className="block text-sm font-semibold text-gray-700 mb-4">
                            Key Focus Areas (select up to 3)
                          </label>
                          <div className="grid grid-cols-2 gap-3">
                            {[
                              {
                                value: "experience",
                                label: "Professional Experience",
                              },
                              { value: "skills", label: "Technical Skills" },
                              { value: "education", label: "Education" },
                              { value: "achievements", label: "Achievements" },
                              { value: "passion", label: "Passion for Field" },
                              { value: "culture-fit", label: "Culture Fit" },
                            ].map((focus) => (
                              <label
                                key={focus.value}
                                className={`flex items-center space-x-2 p-3 rounded border cursor-pointer transition-all ${
                                  letterOptions.focus.includes(focus.value)
                                    ? "border-primary-500 bg-primary-50 text-primary-700"
                                    : "border-gray-300 bg-white text-gray-700 hover:border-gray-400"
                                }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={letterOptions.focus.includes(
                                    focus.value
                                  )}
                                  onChange={(e) => {
                                    if (
                                      e.target.checked &&
                                      letterOptions.focus.length < 3
                                    ) {
                                      setLetterOptions((prev) => ({
                                        ...prev,
                                        focus: [...prev.focus, focus.value],
                                      }));
                                    } else if (!e.target.checked) {
                                      setLetterOptions((prev) => ({
                                        ...prev,
                                        focus: prev.focus.filter(
                                          (f) => f !== focus.value
                                        ),
                                      }));
                                    }
                                  }}
                                  className="sr-only"
                                />
                                <span className="text-sm">{focus.label}</span>
                              </label>
                            ))}
                          </div>
                          {letterOptions.focus.length >= 3 && (
                            <p className="text-xs text-gray-500 mt-3">
                              You can select up to 3 key focus areas
                            </p>
                          )}
                        </div>
                      </>
                    )}
                  </div>

                  {/* Generate Button */}
                  <div
                    className="text-center pt-8 mt-8 border-t"
                    style={{ borderColor: "var(--gray-200)" }}
                  >
                    <p className="text-gray-600 mb-6">
                      {letterOptions.trustMode
                        ? "AI will create the best cover letter for you 🎯"
                        : "Ready to create your personalized cover letter?"}
                    </p>
                    <button
                      onClick={generateCoverLetter}
                      className="btn btn-primary btn-lg"
                    >
                      {letterOptions.trustMode
                        ? "Let AI Handle It ✨"
                        : "Generate Cover Letter"}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isGenerating && (
              <div className="text-center py-12">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-gray-600">
                  AI is crafting your personalized cover letter...
                </p>
              </div>
            )}

            {coverLetter && (
              <div className="space-y-6">
                <div
                  className="p-8 rounded-lg border cover-letter-container"
                  style={{
                    backgroundColor: "var(--gray-50)",
                    borderColor: "var(--gray-200)",
                  }}
                >
                  <div
                    className="text-gray-800 leading-relaxed"
                    style={{
                      fontSize: "0.95rem",
                      lineHeight: "1.6",
                      fontFamily: "inherit",
                      whiteSpace: "pre-wrap",
                    }}
                  >
                    {coverLetter}
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-4">
                  <button
                    onClick={generateCoverLetter}
                    className="btn btn-secondary"
                    disabled={isGenerating}
                  >
                    Regenerate
                  </button>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(coverLetter);
                      alert("Cover letter copied to clipboard!");
                    }}
                    className="btn btn-primary"
                  >
                    Copy to Clipboard
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default GeneratePage;
