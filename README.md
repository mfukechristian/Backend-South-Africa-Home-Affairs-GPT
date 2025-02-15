### **South African Visa Advisor - AI-Powered RAG System**
**An AI-powered chatbot providing accurate South African visa and immigration guidance using Retrieval-Augmented Generation (RAG).**  

![homeaffairs](https://github.com/user-attachments/assets/7d2f4240-3587-4d03-89c9-48a0158b7a57)


![image](https://github.com/user-attachments/assets/99b00ec8-8d44-480c-9b16-36762f2d5480)



## **📌 Features**
✅ AI-driven responses based on official immigration regulations  
✅ Uses **Retrieval-Augmented Generation (RAG)** for accurate answers  
✅ **MongoDB Atlas Vector Search** for document retrieval  
✅ **Google Generative AI embeddings** for semantic search  
✅ **Streaming responses** for a real-time chat experience  
✅ **Deployed on Render** for free-tier hosting  

## **🛠️ Tech Stack**
- **Frontend**: React.js, Vite, CSS  
- **Backend**: Node.js, Express.js  
- **AI Models**: Mistral AI (Chat), Google Generative AI (Embeddings)  
- **Database**: MongoDB Atlas (Vector Search)  
- **Deployment**: Render  

## **📦 Installation & Setup**
### **1️⃣ Clone the Repository**
```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

### **2️⃣ Install Dependencies**
```bash
npm install
```

### **3️⃣ Set Up Environment Variables**
Create a **.env** file in the root directory and add:
```
MISTRAL_API_KEY=your_mistral_api_key
GOOGLE_API_KEY=your_google_api_key
MONGODB_ATLAS_URI=your_mongodb_uri
MONGODB_ATLAS_DB_NAME=your_db_name
MONGODB_ATLAS_COLLECTION_NAME=your_collection_name
PORT=5000
```

### **4️⃣ Start the Backend Server**
```bash
npm start
```

### **5️⃣ Start the Frontend**
```bash
cd frontend
npm install
npm run dev
```
*(Make sure the backend is running before launching the frontend.)*

## **🌍 Deployment**
This project is deployed using **Render**. To deploy:  
1. Push your changes to GitHub  
2. Connect Render to your repository  
3. Set up **Environment Variables** in Render  
4. Deploy & enjoy your AI chatbot!  

## **💡 How It Works**
1. **User enters a visa-related query**  
2. **MongoDB Atlas Vector Search** retrieves the most relevant documents  
3. **Mistral AI processes the question with retrieved documents**  
4. **AI generates a response** in Markdown format  
5. **Response is streamed in real-time** for a better experience  

---
