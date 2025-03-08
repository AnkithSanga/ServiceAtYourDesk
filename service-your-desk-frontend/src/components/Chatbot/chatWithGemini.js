import { GoogleGenerativeAI } from "@google/generative-ai";
import { API_KEY } from "./key";

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chatWithGemini = async (userText, callback) => {
  try {
    const result = await model.generateContent({
      contents: [
        {
          role: 'user',
          parts: [
            {
              text: userText,
            }
          ],
        }
      ],
      generationConfig: {
        maxOutputTokens: 1000,
        temperature: 0.1,
      }
    });

    const responseText = result.response.text();
    callback(null, responseText);
  } catch (error) {
    console.error("Error chatting with Gemini:", error);
    callback(error, null);
  }
};

export default chatWithGemini;