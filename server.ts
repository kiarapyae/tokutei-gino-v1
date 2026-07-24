import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // AI Tutor endpoint using @google/genai
  app.post('/api/ai-tutor', async (req, res) => {
    try {
      const apiKey = process.env.GEMINI_API_KEY;
      if (!apiKey) {
        return res.status(500).json({
          error: 'GEMINI_API_KEY is not configured in environment variables.',
        });
      }

      const { prompt, topic, context } = req.body;
      if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
      }

      const ai = new GoogleGenAI({ apiKey });

      const systemInstruction = `You are an expert Japanese SSW (Specified Skilled Worker No. 1 / 特定技能1号) Food & Beverage Manufacturing Exam Tutor.
Your goal is to help candidates pass the exam by explaining terms, hygiene rules, workplace safety, 5S, HACCP, bacteria, norovirus, storage temperatures, and accident prevention from the official textbook (第4版).
Rules:
1. Provide accurate explanations strictly based on Japanese SSW Food Manufacturing guidelines.
2. Structure your answer with clear Japanese (with furigana in parentheses where helpful), English translation, and brief Myanmar/key takeaways if applicable.
3. Be encouraging, concise, clear, and professional. Use bullet points for key numbers or temperature rules.`;

      const userPrompt = context
        ? `Topic: ${topic || 'General SSW Food Manufacturing'}\nContext: ${context}\nQuestion: ${prompt}`
        : `Topic: ${topic || 'General SSW Food Manufacturing'}\nQuestion: ${prompt}`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: userPrompt,
        config: {
          systemInstruction,
          temperature: 0.3,
        },
      });

      res.json({ text: response.text });
    } catch (err: any) {
      console.error('AI Tutor error:', err);
      res.status(500).json({
        error: err.message || 'Failed to generate response from AI Tutor.',
      });
    }
  });

  // Vite middleware setup
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
