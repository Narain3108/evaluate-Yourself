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

  const response = await fetch(`${API_URL}/upload`, {
    method: 'POST',
    body: formData,
  });

  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message || 'Failed to upload file.');
  }

  return result;
};