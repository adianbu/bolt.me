import * as dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { GoogleGenerativeAI, GenerativeModel, ChatSession, Content } from '@google/generative-ai';
import express, { Request, Response } from "express";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages";
import fs from 'fs';
import { basePrompt as NodeBasePrompt } from "./defaults/node";
import { basePrompt as ReactBasePrompt } from "./defaults/react";
import { getSystemPrompt, BASE_PROMPT } from "./prompts";
import cors from 'cors';


dotenv.config();
const anthropic = new Anthropic();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

if (!GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY not found in environment variables');
}

const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;
const app = express();
app.use(express.json());
// Update your CORS configuration at the top of the file
app.use(cors({
    origin: ['http://localhost:5173', 'https://boltme.site'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.get('/', (req, res) => {
    res.send('Bolt.me API Server is running');
});

app.get('/api', (req, res) => {
    res.send('API is working');
  });

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

// Simple test POST endpoint
app.post('/api/test-post', (req, res) => {
    console.log('=== TEST POST ENDPOINT ===');
    console.log('Request body:', req.body);
    console.log('Headers:', req.headers);
    res.json({ success: true, body: req.body, timestamp: new Date().toISOString() });
});

app.post("/api/template", async (req, res) => {
    console.log('=== CLAUDE TEMPLATE ENDPOINT START ===');
    const { prompt } = req.body;
    console.log('Incoming prompt:', prompt);

    try {
        console.log('Creating Anthropic API call...');
        /**
         * For Anthropic API
         */
        const response = await anthropic.messages.create({
            messages: [{role: 'user', content: prompt}],
            model: 'claude-3-haiku-20240307',
            max_tokens: 100,
            system: "Return either node or react based on what you think this project should be. Return only the word 'node' or 'react'. Do not return anything extra.",
        })
        console.log('Anthropic API response received');

        const ans=(response.content[0] as TextBlock).text;
        console.log('Parsed answer from Claude:', ans);
        
        if (ans === 'node' || ans==="node/n") {
                console.log('Returning node template');
                res.status(200).json({
                    prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                    uiPrompts: [NodeBasePrompt]
                });
                return;
            }
            if (ans === 'react'|| ans==="react/n") {
                console.log('Returning react template');
                res.status(200).json({
                    prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                    uiPrompts: [ReactBasePrompt]
                });
                return;
            }
            // Include the actual response in the error for debugging
            console.log('Unexpected response from Claude:', ans);
            res.status(400).json({error: `Wrong type of project or unexpected response from AI: "${ans}"`});
            return;
    } catch (error) {
        console.error('Claude API error:', error);
        res.status(500).json({ 
            error: 'Failed to generate content with Claude', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        });
        return;
    }
});

// Debug endpoint for Gemini API testing
// @ts-ignore
app.post("/api/debug-gemini", async (req, res) => {
    console.log('=== DEBUG GEMINI ENDPOINT START ===');
    const { prompt } = req.body;
    
    // Step 1: Log the incoming request
    console.log('1. Incoming prompt:', prompt);
    console.log('2. Request body:', req.body);
    
    // Step 2: Check environment variables
    console.log('3. GEMINI_API_KEY exists:', !!GEMINI_API_KEY);
    console.log('4. GEMINI_API_KEY length:', GEMINI_API_KEY ? GEMINI_API_KEY.length : 0);
    console.log('5. genAI instance exists:', !!genAI);
    
    // Step 3: Validate input
    if (!prompt || typeof prompt !== 'string') {
        console.log('6. INPUT VALIDATION FAILED: prompt missing or not string');
        return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }
    console.log('6. Input validation passed');
    
    // Step 4: Check API key
    if (!GEMINI_API_KEY || !genAI) {
        console.log('7. API KEY CHECK FAILED');
        return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    console.log('7. API key check passed');
    
    try {
        // Step 5: Initialize model
        console.log('8. Creating Gemini model...');
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        console.log('9. Model created successfully');
        
        // Step 6: Prepare prompt
        const fullPrompt = `You are a project type analyzer. You determine if a project should be Node.js or React based on the given prompt. Determine if this should be a Node.js or React project. Respond with ONLY the word 'node' or 'react', nothing else: ${prompt}`;
        console.log('10. Full prompt:', fullPrompt);
        
        // Step 7: Make API call
        console.log('11. Making Gemini API call...');
        const response = await model.generateContent(fullPrompt);
        console.log('12. Gemini API call completed');
        
        // Step 8: Log full response
        console.log('13. Full response object:');
        console.log(JSON.stringify(response, null, 2));
        
        // Step 9: Extract response text
        let ans: string | undefined = '';
        console.log('14. Checking response structure...');
        console.log('    response exists:', !!response);
        console.log('    response.response exists:', !!response.response);
        
        if (response.response) {
            console.log('    response.response.text exists:', typeof response.response.text === 'function');
            if (typeof response.response.text === 'function') {
                try {
                    ans = response.response.text().trim().toLowerCase();
                    console.log('15. Extracted answer:', ans);
                } catch (textError) {
                    console.log('15. Error extracting text:', textError);
                }
            } else {
                console.log('15. response.response.text is not a function');
            }
        } else {
            console.log('15. response.response does not exist');
        }
        
        // Step 10: Return debug info
        console.log('=== DEBUG GEMINI ENDPOINT END ===');
        return res.json({
            success: true,
            debug: {
                prompt: prompt,
                fullPrompt: fullPrompt,
                extractedAnswer: ans,
                responseExists: !!response,
                responseResponseExists: !!response.response,
                apiKeyExists: !!GEMINI_API_KEY,
                genAIExists: !!genAI
            },
            response: response
        });
        
    } catch (error) {
        console.log('ERROR in Gemini API call:', error);
        console.log('Error name:', error instanceof Error ? error.name : 'Unknown');
        console.log('Error message:', error instanceof Error ? error.message : 'Unknown');
        console.log('Error stack:', error instanceof Error ? error.stack : 'Unknown');
        console.log('=== DEBUG GEMINI ENDPOINT END (ERROR) ===');
        
        return res.status(500).json({ 
            error: 'Failed to generate content', 
            details: {
                name: error instanceof Error ? error.name : 'Unknown',
                message: error instanceof Error ? error.message : 'Unknown error',
                stack: error instanceof Error ? error.stack : 'Unknown'
            }
        });
    }
});

// @ts-ignore
app.post("/api/geminiTemplate", async (req, res) => {
    const { prompt } = req.body;
    
    // Validate input
    if (!prompt || typeof prompt !== 'string') {
        return res.status(400).json({ error: 'Prompt is required and must be a string' });
    }
    
    // Check if API key is available
    if (!GEMINI_API_KEY || !genAI) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    
    try {
        const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
        const response = await model.generateContent(`You are a project type analyzer. You determine if a project should be Node.js or React based on the given prompt. Determine if this should be a Node.js or React project. Respond with ONLY the word 'node' or 'react', nothing else: ${prompt}`);
        
        console.log('Full Gemini API response:', JSON.stringify(response));

        // Extract the text from the response correctly
        let ans: string | undefined = '';
        if (response.response && response.response.text) {
            ans = response.response.text().trim().toLowerCase();
            console.log('Parsed answer from Gemini:', ans);
        }

        if (ans === 'node' || ans === "node\n") {
            return res.status(200).json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${NodeBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [NodeBasePrompt]
            });
        }
        if (ans === 'react' || ans === "react\n") {
            return res.status(200).json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [ReactBasePrompt]
            });
        }
        
        // Include the actual response in the error for debugging
        return res.status(400).json({error: `Wrong type of project or unexpected response from AI: "${ans}"`});

    } catch (error) {
        console.error('Gemini API error:', error);
        return res.status(500).json({ 
            error: 'Failed to generate content', 
            details: error instanceof Error ? error.message : 'Unknown error' 
        });
    }
});

// Type definitions
interface AnthropicMessage {
    role: 'user' | 'assistant';
    content: string;
}

interface GeminiMessage {
    role: 'user' | 'model';
    parts: { text: string }[];
}

interface RequestBody {
    messages: AnthropicMessage[];
}

app.post("/api/chat", async (req, res) => {
    // const authToken = req.headers.authorization;
    // if (!authToken || !authToken.startsWith('Bearer ')) {
    //     res.status(401).json({ error: 'Missing or invalid authorization token' });
    //     return;
    // }

    // const messages = req.body.messages; // Assuming messages is an array of { role: string, content: string }
    
    /**
     * For Anthropic API (commented out)
     */
    const messages = req.body.messages;
    const response = await anthropic.messages.create({
        messages: messages,
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 8000,
        system: getSystemPrompt()
    })

    console.log(response);

    res.json({
        response: (response.content[0] as TextBlock)?.text
    });
});

// @ts-ignore
app.post("/api/geminichat", async (req, res) => {
    // Check if API key is available
    if (!GEMINI_API_KEY) {
        return res.status(500).json({ error: 'Gemini API key not configured' });
    }
    
    // Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);

    try {
        // Get the generative model
        const model: GenerativeModel = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            systemInstruction: getSystemPrompt(),
        });

        // Convert Anthropic message format to Gemini format
        const convertMessages = (messages: AnthropicMessage[]): GeminiMessage[] => {
            return messages.map((msg) => ({
                role: msg.role === "assistant" ? "model" : "user",
                parts: [{ text: msg.content }],
            }));
        };

        interface IncomingMessage {
            role: 'system' | 'user' | 'assistant';
            content: string;
        }
        
        // Validate input
        if (!Array.isArray(req.body.messages)) {
            return res.status(400).json({ error: 'Messages must be an array' });
        }
        
        // Convert messages format
        const messages: AnthropicMessage[] = req.body.messages.map((msg: IncomingMessage) => ({
            role: msg.role === 'system' ? 'assistant' : (msg.role as 'user' | 'assistant'),
            content: msg.content
        }));
        
        const geminiMessages: GeminiMessage[] = convertMessages(messages);

        // Generate content using chat session
        const chat: ChatSession = model.startChat({
            history: geminiMessages.slice(0, -1), // All messages except the last one go to history
            generationConfig: {
                maxOutputTokens: 8000,
                temperature: 0.7,
            },
        });

        const result = await chat.sendMessage(
            geminiMessages[geminiMessages.length - 1].parts[0].text
        );

        console.log('Gemini chat result:', result);

        return res.json({
            response: result.response.text(),
        });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        return res.status(500).json({
            error: 'Failed to generate response',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
});

app.post("/api/test", async (req, res) => {
    const authToken = req.headers.authorization;
    if (!authToken || !authToken.startsWith('Bearer ')) {
        res.status(401).json({ error: 'Missing or invalid authorization token' });
        return;
    }
    const messages = req.body.messages;
    const response = await anthropic.messages.create({
        messages: messages,
        model: 'claude-3-5-sonnet-20241022',
        max_tokens: 10,
        system: "You are a helpful assistant."
    })

    console.log(response);

    res.json({
        response: (response.content[0] as TextBlock)?.text
    });
})

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})