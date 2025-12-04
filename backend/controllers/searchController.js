import Course from "../models/courseModel.js";
import { GoogleGenerativeAI } from "@google/generative-ai";  // ✅ correct import
import dotenv from "dotenv";
dotenv.config();

export const searchWithAi = async (req, res) => {
    try {
        const { input } = req.body;

        // 🔹 Check for empty input
        if (!input || input.trim() === "") {
            return res.status(400).json({ message: "Search query is required" });
        }

        // 🔹 Initialize Gemini AI
        const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

        const prompt = `
      You are an intelligent assistant for an LMS platform.
      A user will type any query about what they want to learn.
      Your job: return **only one most relevant keyword** from the following list:
      - App Development
      - AI/ML
      - AI Tools
      - Data Science
      - Data Analytics
      - Ethical Hacking
      - UI UX Designing
      - Web Development
      - Others
      - Beginner
      - Intermediate
      - Advanced
      Do not explain anything. Only return one keyword.
      Query: ${input}
    `;

        // 🔹 Generate response using Gemini
        const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });
        const result = await model.generateContent(prompt);
        const keyword = result.response.text().trim();
        console.log("🧠 AI Keyword:", keyword);

        // 🔹 Try matching courses using user's actual input first
        let courses = await Course.find({
            isPublished: true,
            $or: [
                { title: { $regex: input, $options: "i" } },
                { subTitle: { $regex: input, $options: "i" } },
                { description: { $regex: input, $options: "i" } },
                { category: { $regex: input, $options: "i" } },
                { level: { $regex: input, $options: "i" } },
            ],
        });

        // 🔹 If no direct matches, use the AI-generated keyword
        if (courses.length === 0 && keyword) {
            courses = await Course.find({
                isPublished: true,
                $or: [
                    { title: { $regex: keyword, $options: "i" } },
                    { subTitle: { $regex: keyword, $options: "i" } },
                    { description: { $regex: keyword, $options: "i" } },
                    { category: { $regex: keyword, $options: "i" } },
                    { level: { $regex: keyword, $options: "i" } },
                ],
            });
        }

        // 🔹 Return the found courses (could be empty array)
        return res.status(200).json(courses);
    } catch (error) {
        console.error("❌ SearchWithAI Error:", error);
        return res
            .status(500)
            .json({ message: "Failed to search with AI", error: error.message });
    }
};
