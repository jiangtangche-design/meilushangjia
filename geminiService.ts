
import { GoogleGenAI } from "@google/genai";

export const optimizeDescription = async (title: string, currentDesc: string): Promise<string> => {
  try {
    // 确保 API_KEY 存在，否则不执行 AI 请求
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.warn("API_KEY is not defined. Skipping optimization.");
      return currentDesc;
    }

    const ai = new GoogleGenAI({ apiKey: apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位专业的电商文案专家。请优化以下商品的文案，使其更具吸引力和专业感。
      要求：简洁、有力、突出卖点。
      
      商品标题：${title}
      当前描述：${currentDesc}
      
      请仅返回优化后的描述文本，不要包含其他解释。`,
    });

    return response.text || currentDesc;
  } catch (error) {
    console.error("Gemini optimization error:", error);
    return currentDesc;
  }
};
