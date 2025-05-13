import * as dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";
import express from "express";
import { TextBlock } from "@anthropic-ai/sdk/resources/messages";
import fs from 'fs';
import { basePrompt as NodeBasePrompt } from "./defaults/node";
import { basePrompt as ReactBasePrompt } from "./defaults/react";
import { getSystemPrompt,BASE_PROMPT } from "./prompts";
import cors from 'cors';

dotenv.config();
const anthropic = new Anthropic();
const app = express();
app.use(express.json());
app.use(cors());

app.get('/api/', (req, res) => {
    res.send('API is working');
  });
  
app.post("/template", async (req, res) => {
    const { prompt } = req.body;
    const response = await anthropic.messages.create({
        messages: [{role: 'user', content: prompt}],
        model: 'claude-3-haiku-20240307',
        max_tokens: 100,
        system: "Return either node or react based on what you think this project should be. Return only the word 'node' or 'react'. Do not return anything extra.",
    })

    const ans=(response.content[0] as TextBlock).text;
    if (ans=='node') {
        res.status(200).json({
            prompts: [`Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [NodeBasePrompt]
        });
        return;
    }
    if (ans=='react') {
        res.status(200).json({
            prompts: [BASE_PROMPT, `Here is an artifact that contains all files of the project visible to you.\nConsider the contents of ALL files in the project.\n\n${ReactBasePrompt}\n\nHere is a list of files that exist on the file system but are not being shown to you:\n\n  - .gitignore\n  - package-lock.json\n`],
            uiPrompts: [ReactBasePrompt]
        });
        return;
    }
    res.status(400).json({error: "Wrong type of project"});
    return;
});


app.post("/chat", async (req, res) => {
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
})

app.post("/test", async (req, res) => {
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