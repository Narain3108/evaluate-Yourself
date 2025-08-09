import { createWorker } from 'tesseract.js';

export const parseImage = async (buffer) => {
  const worker = await createWorker();
  try {
    await worker.load();
    await worker.loadLanguage('eng');
    await worker.initialize('eng');
    const { data: { text } } = await worker.recognize(buffer);
    return text;
  } catch (error) {
    console.error('Error parsing image with OCR:', error);
    throw new Error('Failed to parse image file.');
  } finally {
    await worker.terminate();
  }
};