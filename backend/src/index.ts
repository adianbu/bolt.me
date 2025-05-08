import * as dotenv from "dotenv";
// import express from "express";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();
const anthropic = new Anthropic();

async function main() {
    const msg = await anthropic.messages.create({
        model: "claude-3-5-sonnet-20241022",
        max_tokens: 1000,
        temperature: 0,
        messages: [{
            role: "user",
            content: "Hello Claude!"
        }]
      });
      console.log(msg);
}

main();

