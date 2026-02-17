
import { GoogleGenAI, Type } from "@google/genai";
import { DeviceCategory, Brand, AIAnalysis } from "../types";

export const getSmartDiagnosis = async (category: DeviceCategory, brand: Brand, issue: string): Promise<AIAnalysis> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Saya adalah pengguna aplikasi servis perangkat. Saya memiliki ${category} merk ${brand} dengan masalah: "${issue}". Tolong berikan analisis singkat.`,
    config: {
      systemInstruction: "Anda adalah asisten teknisi hardware profesional. Berikan analisis dalam format JSON. Bahasa: Indonesia.",
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          possibleCause: { type: Type.STRING, description: "Kemungkinan penyebab masalah." },
          estimatedFixTime: { type: Type.STRING, description: "Estimasi waktu pengerjaan (misal: 1-2 jam)." },
          advice: { type: Type.STRING, description: "Saran tindakan sementara bagi pengguna." },
        },
        required: ["possibleCause", "estimatedFixTime", "advice"]
      }
    }
  });

  return JSON.parse(response.text || '{}') as AIAnalysis;
};
