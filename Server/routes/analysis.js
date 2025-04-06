// // analysis.js
// import dotenv from "dotenv";
// dotenv.config();
// import OpenAI from 'openai';

// const openaiClient = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY
// });

// /**
//  * generateCallSummary:
//  *  Creates a structured summary (TL;DR, bullet points, etc.)
//  */
// export async function generateCallSummary(callText) {
//   const prompt = `
// You are an assistant that reads customer support call transcripts.
// Please summarize the following call text. Provide:
// 1) A brief "TL;DR" (1-2 sentences).
// 2) Key points in bullet form.
// 3) A short structured summary of:
//    - Customer's main concern
//    - Agent's response
//    - Outcome or next steps

// The call transcript is below:

// ---
// ${callText}
// ---

// Return your summary in JSON format with the shape:
// {
//   "tldr": "...",
//   "keyPoints": [...],
//   "structuredSummary": {
//     "customerConcern": "...",
//     "agentResponse": "...",
//     "outcomeOrNextSteps": "..."
//   }
// }
// Only return valid JSON, with no extra text or commentary.
// `;

//   const response = await openaiClient.completions.create({
//     model: "gpt-3.5-turbo-instruct",
//     prompt: prompt,
//     max_tokens: 300,
//     temperature: 0.7
//   });

//   const raw = response.choices[0].text.trim();
//   let parsed;
//   try {
//     parsed = JSON.parse(raw);
//   } catch (err) {
//     console.error("Error parsing JSON from summary:", raw);
//     parsed = { tldr: raw }; // fallback
//   }
//   return parsed;
// }

// /**
//  * extractObjections:
//  * Extracts customer complaints, objections, and requests from the transcript.
//  */
// export async function extractObjections(callText) {
//   const prompt = `
// You are an assistant that extracts customer complaints, objections, and requests from a call transcript.
// Please return them as a JSON array, where each element has:
// {
//   "issue": "<short description>",
//   "category": "<billing, product, delay, etc.>"
// }

// The call transcript is below:
// ---
// ${callText}
// ---

// Only return valid JSON, with no extra commentary.
// If none found, return [].
// `;

//   const response = await openaiClient.completions.create({
//     model: "gpt-3.5-turbo-instruct",
//     prompt: prompt,
//     max_tokens: 250,
//     temperature: 0.7
//   });

//   const raw = response.choices[0].text.trim();
//   let parsed;
//   try {
//     parsed = JSON.parse(raw);
//   } catch (err) {
//     console.error("Error parsing JSON from objections:", raw);
//     parsed = [];
//   }
//   return parsed;
// }

// /**
//  * extractActions:
//  * Lists all follow-up tasks with responsible party and deadline if stated.
//  */
// export async function extractActions(callText) {
//   const prompt = `
// You are an assistant that extracts follow-up tasks mentioned in a call transcript.
// Return them as JSON array, where each item is:
// {
//   "task": "description of the task",
//   "owner": "Agent/Customer/unknown",
//   "deadline": "if any date or time was mentioned, else null"
// }

// Call Transcript:
// ---
// ${callText}
// ---

// Only return valid JSON, with no extra commentary.
// If none found, return [].
// `;

//   const response = await openaiClient.completions.create({
//     model: "gpt-3.5-turbo-instruct",
//     prompt: prompt,
//     max_tokens: 200,
//     temperature: 0.7
//   });

//   const raw = response.choices[0].text.trim();
//   let parsed;
//   try {
//     parsed = JSON.parse(raw);
//   } catch (err) {
//     console.error("Error parsing JSON from action items:", raw);
//     parsed = [];
//   }
//   return parsed;
// }

// Exports
// module.exports = {
//   generateCallSummary,
//   extractObjections,
//   extractActions
// };






// ************************************************************************************

// analysis.js
import dotenv from "dotenv";
dotenv.config();

import { Mistral } from '@mistralai/mistralai';


const apiKey = process.env.MISTRAL_API_KEY;

const client = new Mistral({apiKey: apiKey});


// const chatResponse = await client.chat.complete({
//     model: 'mistral-tiny',
//     messages: [{role: 'user', content: 'What is the best French cheese?'}],
//   });
  
//   console.log('Chat:', chatResponse.choices[0].message.content);



// Use your provided Hugging Face API token
// const HF_API_TOKEN = "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";

// Endpoints for the Hugging Face Inference API
// const HF_SUMMARY_URL = "https://api-inference.huggingface.co/models/facebook/bart-large-cnn";
// const HF_TEXTGEN_URL = "https://api-inference.huggingface.co/models/teapotai/teapotllm";





/**
 * generateCallSummary uses the bart-large-cnn model to summarize the transcript.
 */
export async function generateCallSummary(transcript) {
    const prompt = `
    You are a helpful assistant that reads customer support call transcripts.
    Extract customer concerns, complaints, objections and requests.
    List all follow-up tasks mentioned in the call transcript.
    Please summarize the following transcript and return ONLY a valid JSON object with the following format (and no extra text):
    
    {
      "tldr": "A brief summary of the call not more than 2-3 lines",
      "issue": "short description of customer concerns, complaints, objections. separate issue by a semicolon",
      "category": "e.g. billing;product;delay, etc. separate each category by a semicolon",
      "request": "description of requests made by customer. separate each request by a semicolon"
      "task": "description of follow up tasks. separate each task by semicolon", 

    }
    
    Transcript:
    ---
    ${transcript}
    ---
    `;
//   const payload = { inputs: transcript };
  try {
        const response = await client.chat.complete({
        model: 'mistral-tiny',
        messages: [{role: 'user', content: prompt}],
      });
        const outputText = response.choices[0].message.content;
    // const response = await axios.post(HF_SUMMARY_URL, payload, {
    //   headers: { Authorization: `Bearer ${HF_API_TOKEN}` }
    // });
    // The bart-large-cnn model returns an array of summary objects.
    // const summaryText = response.data[0]?.summary_text;
    if (!outputText) {
      throw new Error("No summary returned");
    }
    // You can customize this output structure as needed.
    return JSON.parse(outputText);
  } catch (error) {
    console.error("Error in generateCallSummary:", error.response?.data || error.message);
    throw error;
  }
}

/**
 * extractObjections uses an instruct model to extract customer objections.
 */
// export async function extractObjections(transcript) {

// const prompt = `
// Extract customer concerns, complaints, and objections from the following call transcript.
// Return ONLY a valid JSON array of objects in this exact format (with no additional text or commentary):

// [
//   { "issue": "short description", "category": "e.g. billing, product, delay, etc." }
// ]

// Transcript:
// ---
// ${transcript}
// ---
// `;
// //   const payload = { inputs: prompt };
//   try {
//     // const response = await axios.post(HF_TEXTGEN_URL, payload, {
//     //   headers: { Authorization: `Bearer ${HF_API_TOKEN}` }
//     // });
//     // Expecting a field 'generated_text' in the response.

//     const response = await client.chat.complete({
//         model: 'mistral-tiny',
//         messages: [{role: 'user', content: prompt}],
//       });

//     // const outputText = response.data.generated_text || (Array.isArray(response.data) && response.data[0].generated_text);
//     const outputText = response.choices[0].message.content;
//     try {
//       return JSON.parse(outputText);
//     } catch (err) {
//       console.error("Error parsing objections JSON:", outputText);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error in extractObjections:", error.response?.data || error.message);
//     throw error;
//   }
// }

// /**
//  * extractActions uses an instruct model to list follow-up tasks from the transcript.
//  */
// export async function extractActions(transcript) {
// const prompt = `
// List all follow-up tasks mentioned in the call transcript, including the responsible party and any deadlines.
// Return ONLY a valid JSON array of objects in this exact format (with no additional text or commentary):

// [
//   { "task": "description", "owner": "Agent/Customer", "deadline": "if any, else null" }
// ]

// Transcript:
// ---
// ${transcript}
// ---
// `;
  
// //   const payload = { inputs: prompt };
//   try {
//     // const response = await axios.post(HF_TEXTGEN_URL, payload, {
//     //   headers: { Authorization: `Bearer ${HF_API_TOKEN}` }
//     // });
//     const response = await client.chat.complete({
//         model: 'mistral-tiny',
//         messages: [{role: 'user', content: prompt}],
//       });
//     const outputText = response.choices[0].message.content;
//     // const outputText = response.data.generated_text || (Array.isArray(response.data) && response.data[0].generated_text);
//     try {
//       return JSON.parse(outputText);
//     } catch (err) {
//       console.error("Error parsing actions JSON:", outputText);
//       return [];
//     }
//   } catch (error) {
//     console.error("Error in extractActions:", error.response?.data || error.message);
//     throw error;
//   }
// }
