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
        if (!result.success) {
          return reject(new Error(`Python script returned an error: ${result.error}`));
        }
        resolve(result);
      } catch (e) {
        reject(new Error(`Failed to parse Python script output. Output: ${stdout}`));
      }
    });
  });
};

app.post('/upload', upload.single('file'), async (req, res) => {
  const { docType, numQuestions, level } = req.body;
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: 'No file uploaded.' });
  }

  console.log(`Received a '${docType}' file: ${file.originalname}`);
  
  try {
    let text = '';
    switch (docType) {
      case 'pdf': text = await parsePdf(file.buffer); break;
      case 'docx': text = await parseDocx(file.buffer); break;
      case 'photo': text = await parseImage(file.buffer); break;
      default: return res.status(400).json({ message: 'Unsupported document type.' });
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
    res.status(500).json({ message: error.message || 'An unexpected error occurred.' });
  }
});

app.listen(port, () => {
  console.log(`Backend server is running on http://localhost:${port}`);
});