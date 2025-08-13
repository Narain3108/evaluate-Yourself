import os
import sys
import json
import uuid
from typing import List, Dict, Any
from datetime import datetime
import chromadb
from chromadb.config import Settings
import google.generativeai as genai
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

class RAGProcessor:
    def __init__(self, collection_name: str = "documents", persist_directory: str = "./chroma_db"):
        """
        Initialize the RAG processor with ChromaDB and specialized Gemini clients.
        """
        self.collection_name = collection_name
        self.persist_directory = persist_directory
        
        # Load the three separate API keys from environment variables
        self.chunker_api_key = os.getenv('GEMINI_CHUNKER_API_KEY')
        self.quiz_api_key = os.getenv('GEMINI_QUIZ_API_KEY')
        self.qa_api_key = os.getenv('GEMINI_QA_API_KEY')

        if not all([self.chunker_api_key, self.quiz_api_key, self.qa_api_key]):
            raise ValueError("All three API keys (GEMINI_CHUNKER_API_KEY, GEMINI_QUIZ_API_KEY, GEMINI_QA_API_KEY) must be set.")
        
        # Initialize ChromaDB client
        self.client = chromadb.PersistentClient(
            path=persist_directory,
            settings=Settings(anonymized_telemetry=False)
        )
        
        # Get or create collection
        try:
            self.collection = self.client.get_collection(name=collection_name)
            print(f"Connected to existing collection: {collection_name}", file=sys.stderr)
        except Exception:
            self.collection = self.client.create_collection(
                name=collection_name,
                metadata={"hnsw:space": "cosine"}
            )
            print(f"Created new collection: {collection_name}", file=sys.stderr)

    def chunk_text_with_gemini(self, text: str) -> List[str]:
        """Splits text into semantic chunks using Gemini."""
        if not text or not text.strip():
            return []
        
        prompt = f"""
        Please split the following text into semantic chunks of approximately 800-1200 characters each.
        Return the chunks as a JSON array of strings. Only return the JSON array.
        Text to chunk:
        {text}
        """
        try:
            # FIX: Configure the specific API key for this task
            genai.configure(api_key=self.chunker_api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            chunks_json = response.text.strip().replace("```json", "").replace("```", "")
            return json.loads(chunks_json)
        except Exception as e:
            print(f"Error chunking with Gemini, using fallback: {e}", file=sys.stderr)
            return [text[i:i + 1000] for i in range(0, len(text), 1000)]

    def create_embeddings_with_gemini(self, texts: List[str]) -> List[List[float]]:
        """Creates embeddings for a list of texts using Gemini."""
        if not texts:
            return []
        print(f"Creating embeddings for {len(texts)} chunks...", file=sys.stderr)
        try:
            # FIX: Configure the key for embeddings (can be any of them, chunker is fine)
            genai.configure(api_key=self.chunker_api_key)
            result = genai.embed_content(
                model="models/embedding-001",
                content=texts,
                task_type="retrieval_document"
            )
            return result['embedding']
        except Exception as e:
            print(f"Error creating embeddings: {e}", file=sys.stderr)
            return []

    def store_in_chromadb(self, chunks: List[str], embeddings: List[List[float]], metadata: Dict[str, Any]) -> str:
        """Stores chunks and embeddings in ChromaDB."""
        doc_id = str(uuid.uuid4())
        chunk_ids = [f"{doc_id}_chunk_{i}" for i in range(len(chunks))]
        
        chunk_metadata = []
        for i in range(len(chunks)):
            meta = metadata.copy()
            meta.update({"doc_id": doc_id, "chunk_index": i})
            chunk_metadata.append(meta)
        
        self.collection.add(
            documents=chunks,
            embeddings=embeddings,
            metadatas=chunk_metadata,
            ids=chunk_ids
        )
        return doc_id

    def process_document(self, text: str, filename: str = "unknown", 
                        doc_type: str = "unknown") -> Dict[str, Any]:
        """
        Complete RAG processing pipeline for a document using Gemini.
        """
        try:
            # Step 1: Chunk the text using Gemini
            chunks = self.chunk_text_with_gemini(text)
            print(f"Text split into {len(chunks)} chunks using Gemini", file=sys.stderr)
            
            if not chunks:
                return {"success": False, "error": "No chunks were created from the document."}
            
            # Step 2: Create embeddings using Gemini
            embeddings = self.create_embeddings_with_gemini(chunks)
            if not embeddings:
                 return {"success": False, "error": "Failed to create embeddings."}

            # Step 3: Prepare metadata
            metadata = {
                "filename": filename,
                "doc_type": doc_type,
                "processed_at": datetime.now().isoformat()
            }
            
            # Step 4: Store in ChromaDB
            doc_id = self.store_in_chromadb(chunks, embeddings, metadata)
            print(f"Stored {len(chunks)} chunks in ChromaDB with document ID: {doc_id}", file=sys.stderr)
            
            return {
                "success": True,
                "doc_id": doc_id,
                "chunks_count": len(chunks),
                "message": f"Successfully processed and stored {len(chunks)} chunks."
            }
            
        except Exception as e:
            print(f"Error in process_document: {e}", file=sys.stderr)
            return {"success": False, "error": str(e)}

    def generate_quiz(self, doc_id: str, num_questions: int, level: str) -> Dict[str, Any]:
        """
        Generates a quiz from the document context stored in ChromaDB.
        """
        print(f"Generating quiz for doc_id: {doc_id}", file=sys.stderr)
        
        # 1. Retrieve context from ChromaDB
        try:
            # Retrieve all chunks associated with the doc_id
            results = self.collection.get(where={"doc_id": doc_id}, include=["documents"])
            context = " ".join(results['documents'])
            if not context:
                raise ValueError("No content found for the given document ID.")
        except Exception as e:
            print(f"Error retrieving context from ChromaDB: {e}", file=sys.stderr)
            return {"success": False, "error": str(e)}

        # 2. Create a prompt for the LLM
        prompt = f"""
        Based on the following text, generate a quiz with {num_questions} questions at a {level} difficulty level.
        The text is:
        ---
        {context}
        ---
        Format the output as a single JSON object with a key "questions".
        "questions" should be an array of objects, where each object has:
        - "question": The question text (string).
        - "options": An array of 4 strings, where one is the correct answer.
        - "answer": The correct answer text (string), which must be one of the options.
        - "explanation": A string that first explains why the correct answer is right, and then explains why each of the other options is wrong. This should be a detailed, educational explanation.

        Do not include any text or formatting outside of this JSON object.
        """

        print("Generating quiz with explanations from LLM...", file=sys.stderr)
        try:
            # FIX: Configure the specific API key for this task
            genai.configure(api_key=self.quiz_api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            raw_text = response.text

            # Make JSON parsing more robust by finding the start and end
            # of the JSON object within the model's raw response.
            json_start_index = raw_text.find('{')
            json_end_index = raw_text.rfind('}') + 1

            if json_start_index == -1 or json_end_index == 0:
                raise json.JSONDecodeError("Could not find a JSON object in the LLM's response.", raw_text, 0)

            quiz_json_text = raw_text[json_start_index:json_end_index]
            quiz_data = json.loads(quiz_json_text)
            
            print("Successfully generated quiz from LLM.", file=sys.stderr)
            return {"success": True, "quiz": quiz_data}
        except json.JSONDecodeError as e:
            # Add more detailed logging to see what the model returned when parsing fails
            print(f"JSONDecodeError: {e}. Failed to parse LLM response.", file=sys.stderr)
            print(f"--- LLM Raw Response --- \n{response.text}\n--- End of Raw Response ---", file=sys.stderr)
            return {"success": False, "error": f"Failed to parse JSON from LLM response: {e}"}
        except Exception as e:
            print(f"An unexpected error occurred while generating quiz: {e}", file=sys.stderr)
            return {"success": False, "error": f"An unexpected error occurred: {e}"}

    def generate_summary(self, doc_id: str, length: str) -> Dict[str, Any]:
        """
        Generates a summary from the document context stored in ChromaDB.
        """
        print(f"Generating summary for doc_id: {doc_id} with length: {length}", file=sys.stderr)

        # 1. Retrieve context from ChromaDB
        try:
            results = self.collection.get(where={"doc_id": doc_id}, include=["documents"])
            context = " ".join(results['documents'])
            if not context:
                raise ValueError("No content found for the given document ID.")
        except Exception as e:
            print(f"Error retrieving context from ChromaDB: {e}", file=sys.stderr)
            return {"success": False, "error": str(e)}

        # 2. Create a prompt for the LLM based on desired length
        length_instructions = {
            "short": "a concise, one-paragraph summary",
            "medium": "a medium-length summary of about 3-4 paragraphs",
            "detailed": "a detailed summary with key points broken down into a list or bullet points"
        }
        instruction = length_instructions.get(length, "a standard summary")

        prompt = f"""
        Based on the following context, please provide {instruction}.
        The output should be only the text of the summary, with no extra titles, headers, or conversational text.

        Context:
        ---
        {context}
        ---
        """

        # 3. Call Gemini to generate the summary
        try:
            # FIX: Configure the specific API key for this task
            genai.configure(api_key=self.quiz_api_key) # Reusing quiz key
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            summary_text = response.text.strip()
            print("Successfully generated summary from LLM.", file=sys.stderr)
            return {"success": True, "summary": {"content": summary_text}}
        except Exception as e:
            print(f"Error generating summary with Gemini: {e}", file=sys.stderr)
            return {"success": False, "error": f"Failed to generate summary from LLM: {e}"}

    def ask_question(self, doc_id: str, question: str, history: list) -> Dict[str, Any]:
        """
        Answers a question based on document context and chat history.
        """
        print(f"Answering question for doc_id: {doc_id}", file=sys.stderr)
        
        # 1. Retrieve context from ChromaDB
        try:
            results = self.collection.get(where={"doc_id": doc_id}, include=["documents"])
            context = " ".join(results['documents'])
            if not context:
                raise ValueError("No content found for the given document ID.")
        except Exception as e:
            return {"success": False, "error": f"Error retrieving context: {e}"}

        # 2. Format chat history for the prompt
        formatted_history = ""
        for message in history:
            role = "User" if message.get("role") == "user" else "AI"
            formatted_history += f"{role}: {message.get('content')}\n"

        # 3. Create a prompt that includes history and context
        # FIX: The prompt is updated to give the AI a more analytical and conversational persona.
        # It's now instructed to use its reasoning abilities, not just retrieve facts.
        prompt = f"""You are an expert AI assistant. Your task is to answer questions about a document, but also to provide analysis, opinions, and insights when asked.

**Instructions:**
1.  **Prioritize Document Context:** Base your primary answer on the provided "Document Context".
2.  **Use General Knowledge for Analysis:** For questions that require analysis, evaluation, or opinions (e.g., "Is this a good resume?", "What are the weaknesses?"), use your general knowledge to form a thoughtful response, but always ground it in the facts from the document.
3.  **Be Conversational:** Engage with the user in a helpful, chatbot-like manner. Do not act like a simple database.
4.  **Distinguish Fact from Opinion:** When you provide an opinion or analysis, make it clear that it is an interpretation based on the document's contents. For example, start with phrases like "Based on the resume, my analysis is...", "From a software engineering hiring perspective...", or "While the document doesn't explicitly state this, the projects listed suggest...".

**Conversation History:**
---
{formatted_history}
---
**Document Context:**
---
{context}
---

**User's Question:** {question}

**Your Answer:**"""

        # 4. Call Gemini to generate the answer
        try:
            # FIX: Configure the specific API key for this task
            genai.configure(api_key=self.qa_api_key)
            model = genai.GenerativeModel('gemini-1.5-flash')
            response = model.generate_content(prompt)
            answer_text = response.text.strip()
            
            # 5. Save the new Q&A pair to the history log
            self.save_chat_history(doc_id, {"role": "user", "content": question})
            self.save_chat_history(doc_id, {"role": "ai", "content": answer_text})

            return {"success": True, "answer": answer_text}
        except Exception as e:
            return {"success": False, "error": f"Failed to generate answer from LLM: {e}"}

    def save_chat_history(self, doc_id: str, message: Dict[str, str]):
        """Saves a message to a file-based chat log."""
        log_dir = "chat_logs"
        os.makedirs(log_dir, exist_ok=True)
        log_file = os.path.join(log_dir, f"{doc_id}.jsonl")
        try:
            with open(log_file, "a") as f:
                f.write(json.dumps(message) + "\n")
        except Exception as e:
            print(f"Warning: Could not save chat history for {doc_id}: {e}", file=sys.stderr)

def main():
    """
    Main function to handle command line arguments for processing or quiz generation.
    """
    if len(sys.argv) < 2:
        print(json.dumps({"success": False, "error": "No command provided. Use 'process' or 'generate_quiz'."}))
        sys.exit(1)

    command = sys.argv[1]
    rag = RAGProcessor()

    if command == "process":
        if len(sys.argv) < 5:
            print(json.dumps({"success": False, "error": "Usage: python main.py process <text_content> <filename> <doc_type>"}))
            sys.exit(1)
        text_content, filename, doc_type = sys.argv[2], sys.argv[3], sys.argv[4]
        result = rag.process_document(text_content, filename, doc_type)
        print(json.dumps(result, indent=2))

    elif command == "generate_quiz":
        if len(sys.argv) < 5:
            print(json.dumps({"success": False, "error": "Usage: python main.py generate_quiz <doc_id> <num_questions> <level>"}))
            sys.exit(1)
        doc_id, num_questions, level = sys.argv[2], int(sys.argv[3]), sys.argv[4]
        result = rag.generate_quiz(doc_id, num_questions, level)
        print(json.dumps(result, indent=2))

    elif command == "summarize":
        if len(sys.argv) < 4:
            print(json.dumps({"success": False, "error": "Usage: python main.py summarize <doc_id> <length>"}))
            sys.exit(1)
        doc_id, length = sys.argv[2], sys.argv[3]
        result = rag.generate_summary(doc_id, length)
        print(json.dumps(result, indent=2))

    elif command == "ask_question":
        if len(sys.argv) < 5:
            print(json.dumps({"success": False, "error": "Usage: python main.py ask_question <doc_id> <question> <history_json>"}))
            sys.exit(1)
        doc_id, question, history_str = sys.argv[2], sys.argv[3], sys.argv[4]
        try:
            history = json.loads(history_str)
        except json.JSONDecodeError:
            history = []
        result = rag.ask_question(doc_id, question, history)
        print(json.dumps(result, indent=2))

    else:
        print(json.dumps({"success": False, "error": f"Unknown command: {command}"}))
        sys.exit(1)


if __name__ == "__main__":
    main()