import { getDocument } from 'pdfjs-dist/legacy/build/pdf.mjs';

export const parsePdf = async (buffer) => {
  try {
    // Load the PDF document from buffer
    const loadingTask = getDocument({
      data: new Uint8Array(buffer),
      verbosity: 0, // Suppress console logs
      useWorkerFetch: false, // Disable worker for Node.js
      isEvalSupported: false, // Disable eval for security
      useSystemFonts: false // Don't use system fonts
    });
    
    const pdf = await loadingTask.promise;
    let fullText = '';
    
    // Extract text from each page
    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const textContent = await page.getTextContent();
      
      // Combine all text items from the page
      const pageText = textContent.items
        .map(item => item.str)
        .join(' ');
      
      fullText += pageText + '\n\n';
    }
    
    return fullText.trim();
    
  } catch (error) {
    console.error('Error parsing PDF:', error);
    throw new Error('Failed to parse PDF file.');
  }
};