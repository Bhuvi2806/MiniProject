const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

// Initialize OpenAI client configured for OpenRouter
const openai = new OpenAI({
  baseURL: 'https://openrouter.ai/api/v1',
  apiKey: process.env.OPENROUTER_API_KEY,
  // OpenRouter requires defaultHeaders for tracking/routing (optional but good practice)
  defaultHeaders: {
    'HTTP-Referer': 'http://localhost:5000', 
    'X-Title': 'Blood Donor Finder',
  },
});

router.post('/', async (req, res) => {
  try {
    const { messages } = req.body;

    if (!messages || !Array.isArray(messages)) {
      return res.status(400).json({ error: 'Messages array is required.' });
    }

    // Prepend a system message to guide the chatbot's behavior
    const systemPrompt = {
      role: 'system',
      content: `You are the BloodLink AI Assistant. You help users navigate the Blood Donor Finder platform, answer questions about blood donation eligibility, and guide them on how to request blood or find donors. Be concise, empathetic, and professional. 
      Important rules:
      - Never provide medical advice.
      - Keep responses short (1-2 paragraphs max).
      - If asked about live features, explain that this is currently a demo environment.`
    };

    const completion = await openai.chat.completions.create({
      model: 'google/gemini-2.5-flash', // Using a fast, standard model available on OpenRouter
      messages: [systemPrompt, ...messages],
    });

    const aiMessage = completion.choices[0].message;
    res.status(200).json({ message: aiMessage });

  } catch (error) {
    console.error('[chat] Error calling OpenRouter:', error);
    res.status(500).json({ error: 'Failed to communicate with AI service.' });
  }
});

module.exports = router;
