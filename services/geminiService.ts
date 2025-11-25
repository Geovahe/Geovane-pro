import { GoogleGenAI } from "@google/genai";
import { AIAnalysisResult, LotteryType, GroundingSource } from "../types";
import { LOTTERIES } from "../constants";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const analyzeAndGenerate = async (
  lotteryType: LotteryType,
  strategy: string = "balanced"
): Promise<AIAnalysisResult> => {
  const config = LOTTERIES[lotteryType];
  
  const prompt = `
    Atue como um especialista em estatística de loterias brasileiras.
    
    Tarefa:
    1. Pesquise os resultados mais recentes da ${config.name} (últimos 10 a 20 concursos).
    2. Identifique os números "quentes" (mais frequentes) e "frios" (menos frequentes) recentemente.
    3. Com base na estratégia "${strategy}" (ex: equilibrado, arriscado, conservador), gere 3 palpites de jogos válidos.
    
    Regras do Jogo ${config.name}:
    - Escolha ${config.drawCount} números.
    - Intervalo: ${config.minNumber} a ${config.maxNumber}.
    
    Formato de Saída Obrigatório:
    - Comece com uma breve análise estatística em texto (máximo 2 parágrafos).
    - Liste os jogos sugeridos explicitamente no seguinte formato exato para que eu possa extrair via Regex:
      JOGO_SUGERIDO: [n1, n2, n3, ...]
      JOGO_SUGERIDO: [n1, n2, n3, ...]
      JOGO_SUGERIDO: [n1, n2, n3, ...]
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
        // responseMimeType: "application/json" is NOT allowed with tools
      },
    });

    const text = response.text || "Não foi possível gerar a análise no momento.";
    
    // Extract Grounding Metadata (Sources)
    const sources: GroundingSource[] = [];
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web) {
          sources.push({
            title: chunk.web.title || "Fonte Web",
            uri: chunk.web.uri || "#",
          });
        }
      });
    }

    // Extract Games using Regex
    const suggestedGames: number[][] = [];
    // Regex matches "JOGO_SUGERIDO: [1, 2, 3]" or similar variations
    const gameRegex = /JOGO_SUGERIDO:\s*\[([\d,\s]+)\]/g;
    let match;

    while ((match = gameRegex.exec(text)) !== null) {
      if (match[1]) {
        const numbers = match[1]
          .split(',')
          .map((n) => parseInt(n.trim(), 10))
          .filter((n) => !isNaN(n));
        
        // Validate count and range
        if (numbers.length === config.drawCount && 
            numbers.every(n => n >= config.minNumber && n <= config.maxNumber)) {
             suggestedGames.push(numbers);
        } else {
             // Basic attempt to fix length if AI generated too many/few (fallback)
             const unique: number[] = Array.from(new Set(numbers));
             if (unique.length >= config.drawCount) {
                 suggestedGames.push(unique.slice(0, config.drawCount).sort((a: number, b: number) => a - b));
             }
        }
      }
    }

    // Clean up the text to remove the raw game arrays if desired, 
    // but usually keeping the full explanation is fine. 
    // We might want to remove the specific JOGO_SUGERIDO lines to avoid duplication in UI, 
    // but having it in text is also a good fallback.

    return {
      text,
      suggestedGames,
      sources
    };

  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Falha ao consultar a IA. Verifique sua conexão ou tente novamente.");
  }
};
