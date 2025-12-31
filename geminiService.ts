import { GoogleGenAI } from "@google/genai";

export const optimizeDescription = async (title: string, currentDesc: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `你是一位专业的电商文案专家。请优化以下商品的文案，使其更具吸引力和专业感。
      要求：简洁、有力、突出卖点，字数在50字以内。
      
      商品标题：${title}
      当前描述：${currentDesc}
      
      请直接输出优化后的描述文本，不要带任何开场白或解释语。`,
    });

    return response.text || currentDesc;
  } catch (error) {
    console.error("AI 优化请求失败:", error);
    return currentDesc;
  }
};