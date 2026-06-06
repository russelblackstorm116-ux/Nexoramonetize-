import express from 'express';
import path from 'path';
import { GoogleGenAI } from "@google/genai";
import { createServer as createViteServer } from 'vite';

// Lazy loader for GoogleGenAI to prevent start-up crashes if key is initially empty
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const key = process.env.GEMINI_API_KEY;
    if (!key) {
      throw new Error("GEMINI_API_KEY environment variable is required to access the AI Monetization Advisor. Please register your key in Settings > Secrets.");
    }
    aiClient = new GoogleGenAI({
      apiKey: key,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  }
  return aiClient;
}

// Resilient wrapper to retry and fallback in case of high demand / 503 errors
async function generateContentWithFallback(client: GoogleGenAI, params: {
  contents: any[];
  config: {
    systemInstruction: string;
    temperature: number;
  };
}) {
  const modelsToTry = [
    "gemini-3.5-flash",
    "gemini-3.1-flash-lite",
    "gemini-flash-latest",
    "gemini-3.1-pro-preview"
  ];

  let lastError: any = null;

  for (const model of modelsToTry) {
    // Retry up to 2 attempts for each model
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        console.log(`[Advisor Proxy] Attempting text generation with model: "${model}" (attempt ${attempt}/2)`);
        
        const response = await client.models.generateContent({
          model,
          contents: params.contents,
          config: params.config,
        });
        
        if (response && response.text) {
          console.log(`[Advisor Proxy] Generation succeeded using model: "${model}"`);
          return {
            text: response.text,
            modelUsed: model
          };
        }
      } catch (err: any) {
        lastError = err;
        const errMsg = String(err?.message || err).toLowerCase();
        console.warn(`[Advisor Proxy] Model "${model}" failed (attempt ${attempt}/2). Error: ${errMsg}`);
        
        // Determine if error is transient (rate limit, high demand, server overloaded, 503, etc.)
        const isTransient = errMsg.includes("503") || 
                            errMsg.includes("555") ||
                            errMsg.includes("500") ||
                            errMsg.includes("unavailable") || 
                            errMsg.includes("experiencing high demand") || 
                            errMsg.includes("rate limit") || 
                            errMsg.includes("429");
                            
        if (!isTransient) {
          // If it is another kind of validation or permission error, throw it immediately 
          throw err;
        }

        // Delay briefly before retrying same model
        if (attempt < 2) {
          const delay = attempt * 1000;
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }
  }

  throw lastError || new Error("All fallback models failed to respond due to connection/capacity issues.");
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Route: Health Check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'active',
      timestamp: new Date().toISOString(),
      service: 'Nexora Monetize full-stack application'
    });
  });

  // API Route: AI Monetization Advisor (Protected server-side proxy)
  app.post('/api/gemini/advisor', async (req, res) => {
    try {
      const { prompt, chatHistory, customContext } = req.body;
      const client = getGeminiClient();

      if (!prompt) {
        res.status(400).json({ error: "Prompt parameter is required." });
        return;
      }

      const systemPrompt = `You are Nexora Monetize AI, the ultimate expert on passive-income streams, SaaS, content channels, and digital monetization models.
Your target is to assist users in building structured income strategies for channels like YouTube, TikTok, Google Play Apps, Music Streaming, film, Blogging, and high-ticket Freelancing.
Be metrics-driven, crisp, practical, and direct. Use rich text formatting, bullet lists, markdown tables of expected metrics, and steps for first monetization.
Always align suggestions with their monthly income targets and chosen resources. Keep responses highly encouraging yet rigorously realistic.

Context:
${customContext ? JSON.stringify(customContext) : 'Default monetization query.'}`;

      // Reconstruct content history for google/genai SDK format
      const formattedContents: any[] = [];
      if (chatHistory && Array.isArray(chatHistory)) {
        chatHistory.forEach((msg: any) => {
          formattedContents.push({
            role: msg.role === 'model' ? 'model' : 'user',
            parts: [{ text: msg.text }]
          });
        });
      }

      // Push latest user prompt
      formattedContents.push({
        role: 'user',
        parts: [{ text: prompt }]
      });

      const result = await generateContentWithFallback(client, {
        contents: formattedContents,
        config: {
          systemInstruction: systemPrompt,
          temperature: 0.7,
        },
      });

      res.json({
        text: result.text || "No response generated by Nexora AI.",
        modelUsed: result.modelUsed
      });
    } catch (err: any) {
      console.error("Error in AI Monetization Advisor API:", err);
      res.status(500).json({
        error: err.message || "An exception occurred while generating advice. Ensure your GEMINI_API_KEY is configured in the workspace settings."
      });
    }
  });

  // API Route: Payments simulated checkout session (Stripe integration ready)
  app.post('/api/stripe/create-checkout-session', (req, res) => {
    try {
      const { planId, email } = req.body;
      if (!planId) {
        res.status(400).json({ error: "planId parameter is required." });
        return;
      }

      const sessionToken = `session_mock_stripe_${Math.random().toString(36).substring(2, 10)}`;
      
      // Simulate redirection to Stripe payment processor page
      // It points directly back to our simulated checkout success handler
      const checkoutUrl = `/checkout-success?plan=${planId}&session_id=${sessionToken}&email=${encodeURIComponent(email || 'user@nexora.com')}`;

      res.json({
        sessionId: sessionToken,
        url: checkoutUrl
      });
    } catch (err: any) {
      res.status(500).json({ error: err.message || "Failed to create checkout session." });
    }
  });

  // Vite Integration: Handle Asset Serving & hot reload fallback
  if (process.env.NODE_ENV !== "production") {
    console.log("Starting server in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting server in production mode with static direct serving...");
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Nexora Monetize is running on host 0.0.0.0, port ${PORT}`);
  });
}

startServer().catch((error) => {
  console.error("Fatal exception during server boot:", error);
});
