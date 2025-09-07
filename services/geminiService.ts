import { GoogleGenAI, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY as string });

const getPromptForStyle = (style: string, userNote: string): string => {
  const basePrompt = "You are a creative AI image editor. Your task is to transform the provided user image based on a specific theme. If the user provides a text note, you MUST creatively and seamlessly integrate that text into the image. The text should look like a natural part of the scene (e.g., graffiti, a neon sign, text on a t-shirt, a computer screen message), fitting the chosen theme. If no text note is provided, just transform the image. Do not add any text if none is provided. Only return the modified image as your response.";
  
  const stylePrompts: { [key: string]: string } = {
    fun: "Theme: Fun. Make the image funnier and more exaggerated, in the style of a classic internet meme. Amplify expressions, add playful elements, or use a vibrant, comical color palette.",
    tech: "Theme: Tech. Re-imagine the image with a high-tech, cyberpunk aesthetic. Integrate glowing neon circuits, digital grids, a futuristic color palette (deep blues, purples, electric pinks), and holographic elements.",
    power: "Theme: Power. Make the image look powerful and epic. Use dramatic lighting, intense shadows, a bold color grade (perhaps with reds and golds), and add subtle energy effects like sparks or a faint glow to emphasize strength.",
    curiosity: "Theme: Curiosity. Infuse the image with a sense of wonder and curiosity. Add whimsical, magical elements like glowing particles, swirling nebulae, or mysterious symbols. Use a dreamy, ethereal color palette.",
    vintage: "Theme: Vintage. Give the image a retro look. Apply a faded, sepia or black-and-white tone, add film grain, light leaks, and subtle scratches to simulate an old photograph from the 1920s-1950s.",
    futuristic: "Theme: Futuristic. Transform the image into a vision of the distant future. Think clean lines, minimalist design, advanced technology subtly integrated, and a sleek, almost sterile, color palette, like a scene from a utopian sci-fi movie."
  };

  const specificPrompt = stylePrompts[style] || stylePrompts.fun; // Default to 'fun' if style is unknown
  
  let finalPrompt = `${basePrompt}\n\n${specificPrompt}`;
  
  if (userNote.trim()) {
    finalPrompt += `\n\nUser's text note to integrate: "${userNote.trim()}"`;
  }
  
  return finalPrompt;
}


export async function createMeme(
  imageData: { base64: string; mimeType: string },
  style: string,
  userNote: string
): Promise<string> {
  const model = 'gemini-2.5-flash-image-preview';

  const prompt = getPromptForStyle(style, userNote);

  const imagePart = {
    inlineData: {
      data: imageData.base64,
      mimeType: imageData.mimeType,
    },
  };

  const textPart = {
    text: prompt,
  };

  const response = await ai.models.generateContent({
    model: model,
    contents: {
      parts: [imagePart, textPart],
    },
    config: {
      responseModalities: [Modality.IMAGE, Modality.TEXT],
    },
  });

  // Find the image part in the response
  for (const part of response.candidates[0].content.parts) {
    if (part.inlineData) {
      return part.inlineData.data;
    }
  }

  // Fallback if the model replies with text about why it failed.
  const textResponse = response.text;
  if (textResponse) {
    throw new Error(`The AI responded with text instead of an image: "${textResponse}"`);
  }

  throw new Error("The AI did not return an image. Please try a different image or prompt.");
}