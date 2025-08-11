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
        Initialize the RAG processor with ChromaDB and Gemini.
        """
        self.collection_name = collection_name
        self.persist_directory = persist_directory
        
        # Initialize Gemini API
        api_key = os.getenv('GEMINI_API_KEY')
        if not api_key:
            raise ValueError("GEMINI_API_KEY environment variable is required")
        
        genai.configure(api_key=api_key)
        self.model = genai.GenerativeModel('gemini-1.5-flash')
        
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
            response = self.model.generate_content(prompt)
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
        Based on the following context, please generate a quiz with {num_questions} multiple-choice questions.
        The difficulty level of the questions should be '{level}'.
        Each question must have exactly 4 options.

        Context:
        ---
        {context}
        ---

        Return the quiz as a single JSON object. The object should have a key "questions" which is an array.
        Each element in the array should be an object with three keys:
        1. "question": The question text (string).
        2. "options": An array of 4 strings representing the choices.
        3. "correctAnswer": The index (0-3) of the correct answer in the "options" array.

        Do not include any other text, explanations, or markdown formatting in your response. Only the JSON object.
        """

        # 3. Call Gemini to generate the quiz
        try:
            response = self.model.generate_content(prompt)
            quiz_json_text = response.text.strip().replace("```json", "").replace("```", "")
            quiz_data = json.loads(quiz_json_text)
            print("Successfully generated quiz from LLM.", file=sys.stderr)
            return {"success": True, "quiz": quiz_data}
        except Exception as e:
            print(f"Error generating quiz with Gemini: {e}", file=sys.stderr)
            return {"success": False, "error": f"Failed to generate or parse quiz from LLM: {e}"}

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
            response = self.model.generate_content(prompt)
            summary_text = response.text.strip()
            print("Successfully generated summary from LLM.", file=sys.stderr)
            return {"success": True, "summary": {"content": summary_text}}
        except Exception as e:
            print(f"Error generating summary with Gemini: {e}", file=sys.stderr)
            return {"success": False, "error": f"Failed to generate summary from LLM: {e}"}


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

    else:
        print(json.dumps({"success": False, "error": f"Unknown command: {command}"}))
        sys.exit(1)

if __name__ == "__main__":
    main()