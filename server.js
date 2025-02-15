import dotenv from "dotenv";
dotenv.config();
import express from "express";
import cors from "cors";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { ChatMistralAI } from "@langchain/mistralai";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { formatDocumentsAsString } from "langchain/util/document";

// Initialize Express
const app = express();
app.use(express.json());
app.use(cors());

// AI Model Setup
const model = new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  model: "mistral-large-latest",
});

const embeddings = new GoogleGenerativeAIEmbeddings({
  apiKey: process.env.GOOGLE_API_KEY,
  model: "text-embedding-004",
});

// Connect to MongoDB
const client = new MongoClient(process.env.MONGODB_ATLAS_URI, {
  tls: true,
  tlsAllowInvalidCertificates: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: { version: "1" },
});

await client.connect();
console.log("Connected to MongoDB Atlas");

const collection = client
  .db(process.env.MONGODB_ATLAS_DB_NAME)
  .collection(process.env.MONGODB_ATLAS_COLLECTION_NAME);

// Initialize vector store
const vectorStore = new MongoDBAtlasVectorSearch(embeddings, {
  collection: collection,
  indexName: "vector_index",
  textKey: "text",
  embeddingKey: "embedding",
});

const retriever = vectorStore.asRetriever({ k: 10 });

// Updated Immigration Consultant Prompt
const prompt = PromptTemplate.fromTemplate(`
## Immigration Consultant Response

You are an expert **South African Immigration Consultant** providing professional and legally accurate visa advice.  
Answer the user's query **strictly based on the given context** from South Africa Home Affairs regulations.

**Guidelines:**
- **Do NOT make up information.** If the answer is not in the context, state:  
  "_I'm sorry, but I don't have that information. Please check the official South Africa Home Affairs website._"
- **Format your response in Markdown** for readability.
- **Be concise, structured, and professional** in your tone.
-NEVER START YOUR ANSWER WITH " BASED ON THE PROVIDED CONTEXT" THE USER SHOULD NEVER KNOW THAT YOU WERE PROVIDED CONTEXT TO ANSWER HIM/HER

---

{question}

{context}

---
If additional documents or steps are required, advise the user accordingly.  
For the latest updates, recommend visiting the [official South Africa Home Affairs website](https://www.dha.gov.za).
`);

const chain = RunnableSequence.from([
  {
    context: retriever.pipe(formatDocumentsAsString),
    question: new RunnablePassthrough(),
  },
  prompt,
  model,
  new StringOutputParser(),
]);

// Express Endpoint for Streaming AI Response
app.post("/api/query", async (req, res) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({ error: "Query is required" });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const result = await chain.stream(query);

    for await (const chunk of result) {
      res.write(chunk);
    }

    res.end();
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
