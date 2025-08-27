import * as dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import { Content, GoogleGenAI } from '@google/genai';
import express from "express";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages";
import fs from 'fs';
import { basePrompt as NodeBasePrompt } from "./defaults/node";
import { basePrompt as ReactBasePrompt } from "./defaults/react";
import { getSystemPrompt,BASE_PROMPT } from "./prompts";
import cors from 'cors';
import { GoogleGenerativeAI,GenerativeModel, ChatSession } from '@google/generative-ai';


dotenv.config();
const anthropic = new Anthropic();
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
const app = express();
app.use(express.json());
// Update your CORS configuration at the top of the file
app.use(cors({
    origin: ['http://localhost:5173', 'https://boltme.site'],
    methods: ['GET', 'POST'],
    credentials: true
}));

app.get('/api', (req, res) => {
    res.send('API is working');
  });

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'healthy', timestamp: new Date().toISOString() });
});

app.post("/api/template", async (req, res) => {
    const { prompt } = req.body;

    /**
     * For Anthropic API
     */
    const response = await anthropic.messages.create({
        messages: [{role: 'user', content: prompt}],
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        system: "Return either node or react based on what you think this project should be. Return only the word 'node' or 'react'. Do not return anything extra.",
    })

    const ans=(response.content[0] as TextBlock).text;
    if (ans === 'node' || ans==="node/n") {
            res.status(200).json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [NodeBasePrompt]
            });
            return;
        }
        if (ans === 'react'|| ans==="react/n") {
            res.status(200).json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [ReactBasePrompt]
            });
            return;
        }
        // Include the actual response in the error for debugging
        res.status(400).json({error: `Wrong type of project or unexpected response from AI: "${ans}"`});
        return;
});

app.post("/api/geminiTemplate", async (req, res) => {
    const { prompt } = req.body;
        /**
         * For Gemini API
         */
        //const models = await ai.models.list(); //view all available models
        // console.log('Available models:', models);
    try {
        const response = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: [{
                role: 'user',
                parts: [{ text:`You are a project type analyzer. You determine if a project should be Node.js or React based on the given prompt. Determine if this should be a Node.js or React project. Respond with ONLY the word 'node' or 'react', nothing else: ${prompt}`}]
            }] as Content[],
        });
        // The response structure has candidates that contain the generated content
        console.log('Full Gemini API response:', JSON.stringify(response));

        // Extract the text from the response correctly
        let ans:string|undefined = '';
        if (response.candidates &&
            response.candidates.length > 0 &&
            response.candidates[0].content &&
            response.candidates[0].content.parts &&
            response.candidates[0].content.parts.length > 0) {

            ans = response.candidates[0].content.parts[0].text?.trim().toLowerCase(); // Trim whitespace and convert to lowercase for robust matching
            console.log('Parsed answer from Gemini:', ans);
        }

        if (ans === 'node' || ans==="node/n") {
            res.status(200).json({
                prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [NodeBasePrompt]
            });
            return;
        }
        if (ans === 'react'|| ans==="react/n") {
            res.status(200).json({
                prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
                uiPrompts: [ReactBasePrompt]
            });
            return;
        }
        // Include the actual response in the error for debugging
        res.status(400).json({error: `Wrong type of project or unexpected response from AI: "${ans}"`});
        return;

    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ error: 'Failed to generate content', details: error }); // Include error details
    }

    /**
     * For Anthropic API
     */
    // const response = await anthropic.messages.create({
    //     messages: [{role: 'user', content: prompt}],
    //     model: 'claude-3-haiku-20240307',
    //     max_tokens: 100,
    //     system: "Return either node or react based on what you think this project should be. Return only the word 'node' or 'react'. Do not return anything extra.",
    // })

    // const ans=(response.content[0] as TextBlock).text;

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

app.post("/api/geminichat", async (req, res) => {
// Initialize Gemini API client
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

    try {
        // Get the generative model
        const model: GenerativeModel = genAI.getGenerativeModel({
        model: "gemini-2.5-pro",
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
            role: 'system' | 'user';
            content: string;
        }
        // console.log(req.body.messages);
        if (!Array.isArray(req.body.messages)) {
            throw new Error('Messages must be an array');
        }
        const messages: AnthropicMessage[] = req.body.messages.map((msg: IncomingMessage) => ({
            role: msg.role === 'system' ? 'assistant' : 'user',
            content: msg.content
        }));
        const geminiMessages: GeminiMessage[] = convertMessages(messages);

        // Generate content
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

        console.log(result);

        res.json({
        response: result.response.text(),
        });
    } catch (error) {
        console.error('Error with Gemini API:', error);
        res.status(500).json({
            error: 'Failed to generate response',
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

app.post("/api/gemini", async (req, res) => {
    const { prompt } = req.body;
    try {
        const models = await ai.models.list();
        // console.log('Available models:', models);
        
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash-preview-04-17',
            contents: "You are a project type analyzer. Based on the following prompt, determine if this should be a Node.js or React project. Respond with ONLY the word 'node' or 'react', nothing else: " + prompt,
            config: {
                maxOutputTokens: 100,
            },
        });
        res.json({
            response: response.text
        });
    } catch (error) {
        console.error('Gemini API error:', error);
        res.status(500).json({ error: 'Failed to generate content' });
    }
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
})