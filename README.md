# Evaluate-Yourself: AI Quiz Generator

`Evaluate-Yourself` is a full-stack web application that leverages the power of Google's Gemini AI to automatically generate quizzes from your documents. Simply upload a PDF, DOCX, or image file, and the system will process the content and create a custom quiz to help you test your knowledge.

## Tech Stack

- **Frontend:** React, TypeScript, Vite
- **Backend:** Node.js, Express.js
- **AI & ML:** Python, Google Gemini API
- **Vector Database:** ChromaDB

---

## Getting Started

This guide will walk you through setting up and running the project on your local machine.

### Prerequisites

Make sure you have the following installed:
- [Node.js](https://nodejs.org/) (v18 or later recommended)
- [Python](https://www.python.org/) (v3.10 or later recommended)
- `pip` and `venv` for Python package management

---

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/Narain3108/evaluate-Yourself.git
    cd evaluate-Yourself
    ```

2.  **Setup the Backend:**
    - Navigate to the backend directory:
      ```bash
      cd backend
      ```
    - Create and activate a Python virtual environment:
      ```bash
      # For Linux/macOS
      python3 -m venv venv
      source venv/bin/activate

      # For Windows
      python -m venv venv
      .\venv\Scripts\activate
      ```
    - Create a `.env` file in the `backend` directory for your API key:
      ```
      GEMINI_API_KEY="YOUR_GEMINI_API_KEY_HERE"
      ```
    - Install the required Python packages:
      ```bash
      pip install -r req.txt
      ```

3.  **Setup the Frontend:**
    - Navigate back to the root project directory:
      ```bash
      cd ..
      ```
    - Install the required npm packages:
      ```bash
      npm install
      ```

---

### Running the Application

You need to have both the backend and frontend servers running simultaneously.

1.  **Start the Backend Server:**
    - Open a terminal and navigate to the `backend` directory.
    - Make sure your virtual environment is activated.
    - Run the Node.js server:
      ```bash
      node server.js
      ```
    - The backend will be running on `http://localhost:8000`.

2.  **Start the Frontend Application:**
    - Open a **new** terminal and navigate to the root project directory.
    - Run the Vite development server:
      ```bash
      npm run dev
      ```
    - The frontend will be available at `http://localhost:5173` (or another port if 5173 is busy).

You can now open your browser and start using the application!