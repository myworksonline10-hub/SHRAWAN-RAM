
import { GoogleGenAI, Type } from "@google/genai";
import { Question } from "../types";

export const generateCustomQuestions = async (
  subject: string, 
  classLevel: string,
  count: number = 5, 
  difficulty: string = 'Intermediate'
): Promise<Question[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  // Determine if the subject is a language subject to adjust instruction
  const isLanguageSubject = subject.toLowerCase().includes('hindi') || 
                            subject.toLowerCase().includes('sanskrit') || 
                            subject.toLowerCase().includes('maithili') || 
                            subject.toLowerCase().includes('english');

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `बिहार स्कूल परीक्षा बोर्ड (BSEB) के पाठ्यक्रम (Syllabus) के अनुसार कक्षा ${classLevel} के लिए ${subject} विषय पर ${count} प्रश्न तैयार करें। 
      कठिनाई का स्तर: ${difficulty}. 
      ${isLanguageSubject 
        ? `चूंकि यह एक भाषा विषय (${subject}) है, इसलिए प्रश्न और विकल्प उसी भाषा की व्याकरण और साहित्य पर आधारित होने चाहिए।` 
        : `प्रश्न और विकल्प पूरी तरह से हिंदी में होने चाहिए।`}
      प्रश्न बिहार बोर्ड की पाठ्यपुस्तकों (SCERT/NCERT) के अनुरूप होने चाहिए।`,
      config: {
        systemInstruction: "You are a professional teacher specialized in the Bihar School Examination Board (BSEB) curriculum. You create high-quality, exam-oriented multiple-choice questions for students of classes 6 to 10. Respond ONLY with valid JSON.",
        responseMimeType: "application/json",
        temperature: 0.4,
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              id: { type: Type.STRING },
              questionText: { type: Type.STRING },
              options: { 
                type: Type.ARRAY,
                items: { type: Type.STRING },
                description: "Exactly 4 options"
              },
              correctAnswer: { 
                type: Type.INTEGER,
                description: "Index of the correct option (0-3)"
              },
              explanation: { type: Type.STRING }
            },
            required: ["id", "questionText", "options", "correctAnswer", "explanation"]
          }
        }
      }
    });

    const resultText = response.text;
    if (!resultText) throw new Error("Empty response from AI");
    
    return JSON.parse(resultText.trim());
  } catch (error) {
    console.error("Error generating BSEB questions:", error);
    
    return [
      {
        id: 'fallback-1',
        questionText: `सर्वर त्रुटि के कारण कक्षा ${classLevel} ${subject} के प्रश्न लोड नहीं हो सके। कृपया फिर से प्रयास करें।`,
        options: ['विकल्प 1', 'विकल्प 2', 'विकल्प 3', 'विकल्प 4'],
        correctAnswer: 0,
        explanation: 'यह एक अस्थाई त्रुटि है।'
      }
    ];
  }
};
