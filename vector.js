import dotenv from "dotenv";
dotenv.config();
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { MongoClient } from "mongodb";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

async function processDocuments() {
  try {
    // Load document
    const documentLoader = new TextLoader("data.txt");
    const document = await documentLoader.load();

    // Split document into chunks
    const documentSplitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 100,
    });
    const splitDocument = await documentSplitter.splitDocuments(document);

    // Initialize embeddings

    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: process.env.GOOGLE_API_KEY,
      model: "text-embedding-004",
    });
    // Connect to MongoDB
    const client = new MongoClient(process.env.MONGODB_ATLAS_URI || "");
    await client.connect(); // Ensure connection is established
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

    // Add documents to vector store
    await vectorStore.addDocuments(splitDocument);
    console.log("Documents successfully added to vector store");

    // Close MongoDB connection
    await client.close();
  } catch (error) {
    console.error("Error occurred:", error);
  }
}

processDocuments();
