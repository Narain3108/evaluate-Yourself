const API_URL = 'http://localhost:8000';

export const uploadFile = async (
  file: File, 
  docType: string, 
  numQuestions: number, 
  level: string
) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('docType', docType);
  formData.append('numQuestions', String(numQuestions));
  formData.append('level', level);

  // FIX: Prepend the API_URL to the fetch path
  const response = await fetch(`${API_URL}/api/generate-quiz`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate quiz.');
  }

  return response.json();
};

export async function generateSummary(file: File, length: string) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('length', length);

  // FIX: Prepend the API_URL to the fetch path
  const response = await fetch(`${API_URL}/api/summarize`, {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Failed to generate summary.');
  }

  const result = await response.json();
  return { ...result, fileName: file.name }; // Add fileName for display
}