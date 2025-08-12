import express from 'express';
import cors from 'cors';
import multer from 'multer';
import { spawn } from 'child_process';
import { parsePdf } from './parsers/pdfp.js';
import { parseDocx } from './parsers/docxp.js';
import { parseImage } from './parsers/imagep.js';

const app = express();
const port = 8000;

app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// Helper to determine docType from the file's mimetype
const getDocType = (mimetype) => {
  if (mimetype === 'application/pdf') return 'pdf';
  if (mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return 'docx';
  if (mimetype.startsWith('image/')) return 'photo';
  return null;
};

const runPythonScript = (args) => {
  return new Promise((resolve, reject) => {
    const python = spawn('python3', ['main.py', ...args]);
    let stdout = '';
    let stderr = '';

    python.stdout.on('data', (data) => { stdout += data.toString(); });
    python.stderr.on('data', (data) => { stderr += data.toString(); console.error(`Python stderr: ${data}`); });

    python.on('close', (code) => {
      if (code !== 0) {
        return reject(new Error(`Python script failed with code ${code}. Stderr: ${stderr}`));
      }
      try {
        const result = JSON.parse(stdout);
        if (result.success === false) { // Check for explicit false
          return reject(new Error(`Python script returned an error: ${result.error}`));
        }
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse Python script output. Output: ${stdout}`));
      }
    });
  });
};

// Renamed to /api/generate-quiz to match frontend and added robust docType detection
app.post('/api/generate-quiz', upload.single('file'), async (req, res) => {
  const { numQuestions, level } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const docType = getDocType(file.mimetype);
  if (!docType) {
    return res.status(400).json({ error: 'Unsupported file type.' });
  }

  console.log(`Received a '${docType}' file for quiz: ${file.originalname}`);
  
  try {
    let text = '';
    switch (docType) {
      case 'pdf': text = await parsePdf(file.buffer); break;
      case 'docx': text = await parseDocx(file.buffer); break;
      case 'photo': text = await parseImage(file.buffer); break;
    }
    
    console.log('Processing document...');
    const processResult = await runPythonScript(['process', text, file.originalname, docType]);
    const doc_id = processResult.doc_id;
    console.log(`Document processed. Doc ID: ${doc_id}`);

    console.log('Generating quiz...');
    const quizResult = await runPythonScript(['generate_quiz', doc_id, numQuestions, level]);
    console.log('Quiz generated.');

    res.status(200).json({ message: 'Quiz generated successfully!', quiz: quizResult.quiz });

  } catch (error) {
    console.error('Processing error:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
});

// New endpoint for summarization
app.post('/api/summarize', upload.single('file'), async (req, res) => {
  const { length } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const docType = getDocType(file.mimetype);
  if (!docType) {
    return res.status(400).json({ error: 'Unsupported file type.' });
  }

  console.log(`Received a '${docType}' file for summarization: ${file.originalname}`);

  try {
    let text = '';
    switch (docType) {
      case 'pdf': text = await parsePdf(file.buffer); break;
      case 'docx': text = await parseDocx(file.buffer); break;
      case 'photo': text = await parseImage(file.buffer); break;
    }

    console.log('Processing document for summarization...');
    const processResult = await runPythonScript(['process', text, file.originalname, docType]);
    const doc_id = processResult.doc_id;
    console.log(`Document processed. Doc ID: ${doc_id}`);

    console.log(`Generating ${length} summary...`);
    const summaryResult = await runPythonScript(['summarize', doc_id, length]);
    console.log('Summary generated.');

    res.status(200).json({ message: 'Summary generated successfully!', content: summaryResult.summary.content });

  } catch (error) {
    console.error('Summarization error:', error.message);
    res.status(500).json({ error: error.message || 'An unexpected error occurred.' });
  }
});

// FIX: Create a dedicated endpoint to process a document and return its ID.
// This is cleaner than piggybacking on the quiz/summary endpoints.
app.post('/api/process-document', upload.single('file'), async (req, res) => {
  const file = req.file;
  if (!file) {
    return res.status(400).json({ error: 'No file uploaded.' });
  }

  const docType = getDocType(file.mimetype);
  if (!docType) {
    return res.status(400).json({ error: 'Unsupported file type.' });
  }

  console.log(`Processing '${docType}' for Q&A: ${file.originalname}`);

  try {
    let text = '';
    switch (docType) {
      case 'pdf': text = await parsePdf(file.buffer); break;
      case 'docx': text = await parseDocx(file.buffer); break;
      case 'photo': text = await parseImage(file.buffer); break;
    }

    const result = await runPythonScript(['process', text, file.originalname, docType]);
    console.log(`Document processed successfully. Doc ID: ${result.doc_id}`);
    res.status(200).json({ doc_id: result.doc_id, fileName: file.originalname });

  } catch (error) {
    console.error('Error processing document:', error.message);
    res.status(500).json({ error: error.message || 'Failed to process document.' });
  }
});

// FIX: Create the new endpoint for handling Q&A.
app.post('/api/ask-question', async (req, res) => {
  const { doc_id, question, history } = req.body;

  if (!doc_id || !question) {
    return res.status(400).json({ error: 'doc_id and question are required.' });
  }

  try {
    console.log(`Asking question for doc_id: ${doc_id}`);
    // The history is stringified to be passed as a single command-line argument.
    const historyString = JSON.stringify(history || []);
    
    const result = await runPythonScript(['ask_question', doc_id, question, historyString]);
    
    console.log('Answer generated successfully.');
    res.status(200).json(result);

  } catch (error) {
    console.error('Error in /api/ask-question:', error.message);
    res.status(500).json({ error: error.message || 'Failed to get answer.' });
  }
});


app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});