
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import OpenAI from "openai";
import path from "path";
import { fileURLToPath } from "url";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;

// Get __dirname equivalent for ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Initialize OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from the frontend build
app.use(express.static(path.join(__dirname, "frontend/dist")));

// Routes
app.get("/api/health", (req, res) => {
  res.json({
    status: "OK",
    message: "AI Cover Letter Backend is running",
    timestamp: new Date().toISOString(),
  });
});

// Generate cover letter endpoint
app.post("/api/generate-cover-letter", async (req, res) => {
  try {
    const { userInfo, jobInfo, letterOptions = {} } = req.body;

    // Validation
    if (!userInfo || !jobInfo) {
      return res.status(400).json({
        error: "Missing required data: userInfo and jobInfo are required",
      });
    }

    // Create the prompt for OpenAI
    const prompt = createCoverLetterPrompt(userInfo, jobInfo, letterOptions);

    console.log("🤖 Generating cover letter with OpenAI...");

    // Try OpenAI API first, fallback to mock if quota exceeded
    try {
      const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: letterOptions.trustMode
              ? "You are an expert cover letter writer with full creative control. Write the BEST possible cover letter using your professional expertise. Choose the optimal length, structure, and focus areas based on the job requirements and candidate profile. Be impactful, professional, and tailored."
              : letterOptions.length === "short"
              ? "You are an expert cover letter writer. CRITICAL REQUIREMENT: Write EXACTLY 4-5 lines total (including greeting and closing). STRUCTURE: 1) Greeting line 2) ONE sentence about relevant experience 3) ONE sentence about specific skills match 4) Closing line. NO additional content. Maximum 60 words total."
              : letterOptions.length === "medium"
              ? "You are an expert cover letter writer. Write a concise 6-8 lines cover letter. Include greeting, 2-3 focused sentences about qualifications, and closing. Maximum 100 words total. Be direct and impactful."
              : letterOptions.length === "long"
              ? "You are an expert cover letter writer. Write a comprehensive 3-4 paragraph cover letter. Include introduction, experience/achievements, skills/value proposition, and closing. Maximum 200 words total. Be detailed but professional."
              : "You are an expert cover letter writer. Choose the optimal length and structure based on the job requirements and candidate profile. Write the most effective cover letter possible.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: letterOptions.trustMode
          ? 400
          : letterOptions.length === "short"
          ? 100
          : letterOptions.length === "medium"
          ? 200
          : letterOptions.length === "long"
          ? 300
          : 150,
        temperature: letterOptions.trustMode ? 0.8 : 0.3,
      });

      const coverLetter = completion.choices[0].message.content;
      console.log("✅ Cover letter generated successfully");

      res.json({
        success: true,
        coverLetter: coverLetter,
        usage: completion.usage,
      });
    } catch (openaiError) {
      // If quota exceeded, use mock response for development
      if (openaiError.status === 429) {
        console.log(
          "⚠️ OpenAI quota exceeded, using mock response for development"
        );

        const mockCoverLetter = `Dear Hiring Manager,
My ${userInfo.experience || "relevant experience"} perfectly matches your ${
          jobInfo.jobTitle || "position"
        } requirements at ${jobInfo.companyName || "your company"}.
My expertise in ${
          userInfo.skills || "key skills"
        } aligns directly with your needs.
Best regards,
${userInfo.fullName || "Your Name"}

---
🚨 DEMO MODE: Micro cover letter (OpenAI quota exceeded).`;

        res.json({
          success: true,
          coverLetter: mockCoverLetter,
          usage: { total_tokens: 0, prompt_tokens: 0, completion_tokens: 0 },
          demo_mode: true,
        });
      } else {
        throw openaiError; // Re-throw other errors
      }
    }
  } catch (error) {
    console.error("❌ Error generating cover letter:", error);

    if (error.code === "insufficient_quota") {
      return res.status(402).json({
        error: "OpenAI API quota exceeded. Please check your billing details.",
      });
    }

    if (error.code === "invalid_api_key") {
      return res.status(401).json({
        error: "Invalid OpenAI API key. Please check your configuration.",
      });
    }

    res.status(500).json({
      error: "Failed to generate cover letter. Please try again.",
      details:
        process.env.NODE_ENV === "development" ? error.message : undefined,
    });
  }
});

// Create prompt for OpenAI
function createCoverLetterPrompt(userInfo, jobInfo, letterOptions = {}) {
  const { length = "short", focus = [], trustMode = false } = letterOptions;

  // Define length specifications
  const lengthSpecs = {
    short: "EXACTLY 4-5 lines, MAXIMUM 60 words",
    medium: "6-8 lines, MAXIMUM 100 words",
    long: "3-4 paragraphs, MAXIMUM 200 words",
    auto: "optimal length based on job requirements (AI decides)",
  };

  const currentLengthSpec = lengthSpecs[length] || lengthSpecs.short;

  return `
${
  trustMode
    ? "TRUST MODE: You have full creative control. Write the BEST possible cover letter using your expertise. Choose optimal length, focus areas, and approach based on the job requirements."
    : `URGENT: Write a cover letter - ${currentLengthSpec}.`
}

Please write a professional cover letter based on the following information:

CANDIDATE INFORMATION:
- Name: ${userInfo.fullName}
- Email: ${userInfo.email}
- Phone: ${userInfo.phone || "Not provided"}
- Experience: ${userInfo.experience}
- Skills: ${userInfo.skills}
- Education: ${userInfo.education || "Not provided"}

JOB INFORMATION:
- Company: ${jobInfo.companyName}
- Position: ${jobInfo.jobTitle}
- Job Description: ${jobInfo.jobDescription}
- Key Requirements: ${jobInfo.requirements}
- Hiring Manager: ${jobInfo.contactPerson || "Hiring Manager"}

${
  trustMode
    ? `TRUST MODE INSTRUCTIONS:
- Use your full expertise to write the BEST cover letter possible
- Choose the optimal length and structure based on the job requirements
- Focus on what will make the strongest impression
- Be creative, professional, and impactful
- No restrictions - write what works best`
    : `CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:
${
  length === "short"
    ? `1. Write EXACTLY 4-5 lines total. NO MORE.
2. Line 1: "Dear Hiring Manager," or "Dear [Name],"
3. Line 2: ONE sentence about relevant experience that matches the job
4. Line 3: ONE sentence about specific skills that align with requirements
5. Line 4: "Best regards," or "Sincerely,"
6. Line 5: Candidate name
7. MAXIMUM 60 words total`
    : length === "medium"
    ? `1. Write 6-8 lines total
2. Include greeting and closing
3. 2-3 sentences focusing on key qualifications
4. MAXIMUM 100 words total
5. Keep it concise but slightly more detailed than short format`
    : length === "long"
    ? `1. Write 3-4 paragraphs
2. Paragraph 1: Introduction and interest
3. Paragraph 2: Relevant experience and achievements
4. Paragraph 3: Skills and value proposition
5. Paragraph 4: Closing and call to action
6. MAXIMUM 200 words total`
    : `1. Choose optimal length based on job complexity and requirements
2. Use your judgment for best format and structure
3. Focus on most impactful content`
}

${
  focus.length > 0
    ? `
FOCUS AREAS (prioritize these):
${focus
  .map((f) => {
    const focusMap = {
      experience:
        "- Emphasize relevant professional experience and career progression",
      skills:
        "- Highlight technical skills and expertise that match job requirements",
      education: "- Mention educational background and relevant qualifications",
      achievements: "- Include specific achievements and measurable results",
      passion: "- Show enthusiasm and passion for the field/company",
      "culture-fit": "- Demonstrate cultural alignment and soft skills",
    };
    return focusMap[f] || `- Focus on ${f}`;
  })
  .join("\n")}`
    : ""
}

8. NO additional paragraphs, explanations, or content beyond specified format`
}

Format the cover letter as a complete, ready-to-send document.
`;
}

// Error handling middleware
app.use((error, req, res, next) => {
  console.error("💥 Unhandled error:", error);
  res.status(500).json({
    error: "Internal server error",
    details: process.env.NODE_ENV === "development" ? error.message : undefined,
  });
});

// Catch all handler - serve React app for non-API routes
app.get("*", (req, res) => {
  // If it's an API route that doesn't exist, return 404 JSON
  if (req.path.startsWith("/api/")) {
    return res.status(404).json({
      error: "Route not found",
      availableRoutes: ["GET /api/health", "POST /api/generate-cover-letter"],
    });
  }

  // Otherwise, serve the React app
  res.sendFile(path.join(__dirname, "frontend/dist/index.html"));
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  const apiKey = process.env.OPENAI_API_KEY;
  console.log(`🤖 OpenAI API Key: ${apiKey ? "✅ Configured" : "❌ Missing"}`);
});
