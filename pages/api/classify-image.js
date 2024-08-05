import { OpenAI } from "openai";

const openai = new OpenAI({
  dangerouslyAllowBrowser: true,
  apiKey: process.env.OPENAI_API_KEY,
});

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res
      .setHeader("Allow", ["POST"])
      .status(405)
      .end(`Method ${req.method} Not Allowed`);
  }

  try {
    const { imageBase64 } = req.body;
    if (!imageBase64) {
      return res.status(400).json({ message: "Image data not provided" });
    }

    const label = await classifyImageWithOpenAI(imageBase64);

    return res.status(200).json({ label });
  } catch (error) {
    console.error("Error classifying image:", error.message);
    return res
      .status(500)
      .json({ message: "Image classification failed", error: error.message });
  }
}

async function classifyImageWithOpenAI(base64Image) {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "text",
              text: "Please provide a one-word label for the main item in this image.",
            },
            {
              type: "image_url",
              image_url: {
                url: `data:image/jpeg;base64,${base64Image}`,
              },
            },
          ],
        },
      ],
    });

    const label = response.choices[0].message.content.trim();
    return label;
  } catch (error) {
    console.error("Error classifying image: ", error);
    throw new Error("Image classification failed");
  }
}
