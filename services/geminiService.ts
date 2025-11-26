import { GoogleGenAI, Type, Schema } from "@google/genai";
import { AstroSpot } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const spotSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    spots: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          name: { type: Type.STRING },
          region: { type: Type.STRING },
          bortleClass: { type: Type.NUMBER, description: "Bortle scale 1-9 estimate" },
          coordinates: {
            type: Type.OBJECT,
            properties: {
              lat: { type: Type.NUMBER },
              lng: { type: Type.NUMBER }
            }
          },
          description: { type: Type.STRING },
          bestFeatures: {
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["id", "name", "region", "bortleClass", "coordinates", "description", "bestFeatures"]
      }
    }
  }
};

export const findAstroSpots = async (queryLocation: string = "Germany", radius: number = 100): Promise<AstroSpot[]> => {
  try {
    const prompt = `
      Act as an expert astrophotographer and geographer.
      Identify 6-8 of the best locations for astrophotography within a ${radius} km radius of ${queryLocation}.
      
      Constraint Checklist & Confidence Score:
      1. Analyze ${queryLocation}.
      2. If ${queryLocation} is a specific city/town, strictly find spots within ${radius} km.
      3. If ${queryLocation} is a large country/region (e.g., "Germany"), focus on the best spots in that region regardless of strict radius if the radius is small (<100km), otherwise respect the radius from the region's center.
      4. Prioritize "Sternenparks" (Dark Sky Parks) and remote areas with low light pollution (Low Bortle Class).
      
      Ensure the coordinates are accurate for mapping.
      Provide a brief, inspiring description for each.
    `;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: spotSchema,
        systemInstruction: "You are a helpful assistant specialized in astronomy and dark sky preservation.",
      }
    });

    const jsonText = response.text;
    if (!jsonText) return [];

    const data = JSON.parse(jsonText);
    return data.spots || [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to fetch astronomy spots.");
  }
};