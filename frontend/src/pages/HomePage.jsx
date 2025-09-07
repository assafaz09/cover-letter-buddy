import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="container section-padding">
      <div className="space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="heading-xl mb-6">
            Create Professional Cover Letters with{" "}
            <span
              style={{
                background:
                  "linear-gradient(135deg, var(--primary-600), var(--primary-700))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              AI Power
            </span>
          </h1>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Transform your job applications with personalized, professional
            cover letters generated in seconds. Stand out from the competition
            with AI-crafted content tailored to your experience and the job
            requirements.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Link to="/user-info" className="btn btn-primary btn-lg">
              Start Creating Now
            </Link>
            <Link to="/user-info" className="btn btn-ghost">
              See How It Works
            </Link>
          </div>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-3 gap-6">
          <div className="card text-center">
            <h3
              className="heading-lg mb-3"
              style={{ color: "var(--primary-600)" }}
            >
              AI-Powered Generation
            </h3>
            <p className="text-gray-600">
              Advanced AI technology creates personalized cover letters tailored
              to your specific job applications and experience.
            </p>
          </div>

          <div className="card text-center">
            <h3
              className="heading-lg mb-3"
              style={{ color: "var(--success-600)" }}
            >
              Professional Quality
            </h3>
            <p className="text-gray-600">
              Generate professional, well-structured cover letters that make a
              great first impression with employers.
            </p>
          </div>

          <div className="card text-center">
            <h3
              className="heading-lg mb-3"
              style={{ color: "var(--gray-800)" }}
            >
              Quick & Easy
            </h3>
            <p className="text-gray-600">
              Save time with our streamlined process. Create multiple cover
              letters in minutes, not hours.
            </p>
          </div>
        </div>

        {/* How It Works Section */}
        <div className="card text-center">
          <h2 className="heading-lg mb-6">How It Works</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="mb-4">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--primary-600)" }}
                >
                  1
                </span>
              </div>
              <h4 className="font-semibold mb-2">Enter Your Info</h4>
              <p className="text-sm text-gray-600">
                Fill in your personal details and experience
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--primary-600)" }}
                >
                  2
                </span>
              </div>
              <h4 className="font-semibold mb-2">Add Job Details</h4>
              <p className="text-sm text-gray-600">
                Paste the job description or enter manually
              </p>
            </div>
            <div className="text-center">
              <div className="mb-4">
                <span
                  className="text-2xl font-bold"
                  style={{ color: "var(--primary-600)" }}
                >
                  3
                </span>
              </div>
              <h4 className="font-semibold mb-2">Get Your Letter</h4>
              <p className="text-sm text-gray-600">
                AI generates a personalized cover letter instantly
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
