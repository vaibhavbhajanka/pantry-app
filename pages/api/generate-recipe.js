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
        const { pantryItems } = req.body;
        if (!pantryItems || pantryItems.length === 0) {
            return res.status(400).json({ message: "No pantry items provided" });
        }
        const prompt = `Create a simple recipe using these ingredients: ${pantryItems.join(
            ", "
        )}. Provide step-by-step instructions.`;

        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: [
                        {
                            type: "text",
                            text: prompt,
                        },
                    ],
                },
            ],
        });

        const recipe = response.choices[0].message.content.trim();

        return res.status(200).json({ recipe });
    } catch (error) {
        console.error("Error generating recipe:", error.message);
        return res
            .status(500)
            .json({ message: "Failed to generate recipe", error: error.message });
    }

}