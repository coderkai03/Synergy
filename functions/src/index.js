import * as functions from "firebase-functions";
// import {OpenAI} from "openai";
import * as admin from "firebase-admin";

// Initialize Firebase Admin SDK
admin.initializeApp();

// Set up OpenAI client
// const openai = new OpenAI({
//   apiKey: process.env.OPENAI_API || functions.config().openai.key,
// });

export const chatgptRequest = functions.https.onRequest(async (req, res) => {
  functions.logger.info("ChatGPT request received", {structuredData: true});
  res.send("Attempting to call ChatGPT!");
  // Enable CORS
  //   res.set("Access-Control-Allow-Origin", "*");

  //   if (req.method === "OPTIONS") {
  //     res.set("Access-Control-Allow-Methods", "GET, POST");
  //     res.set("Access-Control-Allow-Headers", "Content-Type");
  //     res.status(204).send("");
  //     return;
  //   }

  //   try {
  //     const userInput = req.body.userInput || "";
  //     const completion = await openai.chat.completions.create({
  //       model: "gpt-3.5-turbo",
  //       messages: [{role: "user", content: userInput}],
  //     });
  //     res.status(200).send(completion.choices[0].message.content);
  //   } catch (error) {
  //     console.error("Error:", error);
  //     res.status(500).send("Internal Server Error");
  //   }
});

export const helloWorld = functions.https.onRequest((request, response) => {
  functions.logger.info("Hello logs!", {structuredData: true});
  response.send("Redeployed from Firebase!");
  response.send("Request: " + request);
});
