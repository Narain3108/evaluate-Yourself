# Evaluate-Yourself: AI Quiz Generator

`Evaluate-Yourself` is a full-stack web application that leverages Google's Gemini AI to automatically generate quizzes from your documents. Upload a PDF, DOCX, or image file, and the system processes the content to create a custom quiz for self-assessment.

---

## Tech Stack & Infrastructure

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js (Express.js), Python (AI/ML logic)
- **AI & ML:** Google Gemini API, Python scripts
- **Vector Database:** ChromaDB
- **Containerization:** Docker (multi-stage build for frontend & backend)
- **Orchestration:** Kubernetes (with Helm charts for deployment)
- **CI/CD Ready:** Easily integrable with ArgoCD or other GitOps tools

---

## Core Architecture & Workflow

1. **Frontend**  
   Users interact via a modern React interface. File uploads and quiz configuration are sent to the backend API.

2. **Backend**  
   - **Express.js** handles API requests and file uploads.
   - Uploaded files are parsed (PDF, DOCX, or image) using specialized Node.js modules.
   - Extracted text is passed to Python scripts (via `child_process.spawn`) for AI processing.
   - Python scripts use the Gemini API to generate quiz questions and summaries.
   - Results are returned to the frontend for display.

3. **Infrastructure**  
   - **Docker:** The app is fully containerized. The Dockerfile builds the frontend, then packages it with the backend and Python environment.
   - **Kubernetes:** Helm charts are provided for easy deployment and scaling in any K8s cluster.
   - **ArgoCD (optional):** For GitOps-based continuous deployment.

---

## Quick Start (Local)

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [Python](https://www.python.org/) (v3.10+)
- [Docker](https://www.docker.com/)
- [Helm](https://helm.sh/) & [kubectl](https://kubernetes.io/docs/tasks/tools/) (for K8s deployment)

### Local Development

1. **Clone the repository:**
    ```bash
    git clone https://github.com/Narain3108/evaluate-Yourself.git
    cd evaluate-Yourself
    ```

2. **Backend Setup:**
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate
    pip install -r requirements.txt
    # Add your Gemini API key to backend/.env
    ```

3. **Frontend Setup:**
    ```bash
    cd ../frontend
    npm install
    ```

4. **Run Servers:**
    - Backend:  
      ```bash
      cd ../backend
      node server.js
      ```
    - Frontend:  
      ```bash
      cd ../frontend
      npm run dev
      ```

---

## Containerized Deployment

1. **Build & Run with Docker:**
    ```bash
    docker build -t evaluate-yourself-app .
    docker run -p 8000:8000 evaluate-yourself-app
    ```

2. **Kubernetes Deployment (with Helm):**
    - Build and push your Docker image to a registry.
    - Edit `values.yaml` in the Helm chart with your image name.
    - Deploy:
      ```bash
      helm install evaluate-yourself ./evaluate-yourself
      ```
    - Access the app via the configured NodePort or LoadBalancer.

---

## Core Features

- Upload documents (PDF, DOCX, images)
- Automatic text extraction and AI-powered quiz generation
- Summarization endpoint
- Scalable, cloud-native deployment

---

## Contributing

PRs and issues welcome!

---

## License

MIT