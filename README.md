# Agnel CyberCell - Official Website

![Agnel CyberCell](https://your-image-host.com/hero-screenshot.png) <!-- Optional: Add a screenshot of your hero section -->

Welcome to the official website repository for the Agnel CyberCell of Fr. C Rodrigues Institute of Technology. This is a modern, dynamic web application built with React and Vite, featuring a secure members-only area and a full-featured admin panel for content management.

**Live Demo:** [https://yourbroisacoder.github.io/ACC/](https://yourbroisacoder.github.io/ACC/)

---

## ✨ Features

*   **Cinematic Hero Section:** An immersive, auto-playing background carousel showcasing club events and a video clip.
*   **Dynamic, State-Based Routing:** A custom front-end router that uses the browser's History API for a smooth, single-page application experience without a full router library.
*   **Members-Only Newsletter:** A secure section accessible only to members via a 12-digit club number, powered by Firebase Anonymous Authentication.
*   **Dynamic Content:** Newsletter articles are fetched in real-time from a Firestore database.
*   **In-App PDF Viewer:** An embedded, view-only PDF viewer for newsletters with zoom and pagination controls.
*   **Secure Admin Panel:** A separate, protected admin dashboard with:
    *   Email & Password authentication for administrators.
    *   Role-based permissions managed through Firestore.
    *   Functionality to add/manage club members.
    *   A full CMS to publish and manage newsletter articles.
*   **External PDF Hosting:** Newsletter PDFs are hosted for free on a separate public GitHub repository for scalability and cost-effectiveness.
*   **Fully Responsive:** Designed with Tailwind CSS to be fully functional and beautiful on all devices, from mobile phones to desktops.

---

## 🛠️ Tech Stack

*   **Frontend:** [React](https://reactjs.org/), [Vite](https://vitejs.dev/), [TypeScript](https://www.typescriptlang.org/)
*   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
*   **Animation:** [Framer Motion](https://www.framer.com/motion/)
*   **Backend & Database:** [Firebase](https://firebase.google.com/) (Firestore, Authentication)
*   **Icons:** [Lucide React](https://lucide.dev/)
*   **Deployment:** [GitHub Pages](https://pages.github.com/) & [Docker](https://www.docker.com/)

---

## 🚀 Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing purposes.

### Prerequisites

*   [Node.js](https://nodejs.org/) (v18 or later)
*   [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
*   A Firebase project with **Firestore** and **Authentication** enabled.

### Installation & Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/YourBroIsACoder/ACC.git
    ```

2.  **Navigate to the project directory:**
    ```bash
    cd ACC
    ```

3.  **Install dependencies:**
    ```bash
    npm install
    ```

4.  **Set up your environment variables:**
    *   Create a file named `.env.local` in the root of the project.
    *   Add your Firebase public configuration keys to this file. Vite requires the `VITE_` prefix.

    ```
    # .env.local

    VITE_FIREBASE_API_KEY="AIzaSy..."
    VITE_FIREBASE_AUTH_DOMAIN="your-project.firebaseapp.com"
    VITE_FIREBASE_PROJECT_ID="your-project-id"
    VITE_FIREBASE_STORAGE_BUCKET="your-project.appspot.com"
    VITE_FIREBASE_MESSAGING_SENDER_ID="..."
    VITE_FIREBASE_APP_ID="..."
    ```
    *   Update your `src/firebase/firebase.ts` file to read these variables.

5.  **Run the development server:**
    ```bash
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

---

## 📦 Build & Deployment

This project is configured for two deployment targets: GitHub Pages (staging/demo) and Docker (production).

### For GitHub Pages

This build is configured for deployment to a sub-folder (e.g., `/ACC/`).

1.  **Run the deployment script:**
    ```bash
    npm run deploy:github
    ```
    This command automatically builds the project with the correct base path (`/ACC/`) and deploys the `dist` folder to the `gh-pages` branch.

### For Docker

This build is configured for a production server running at the root of a domain.

1.  **Build the project for Docker:**
    ```bash
    npm run build:docker
    ```

2.  **Build the Docker image:**
    ```bash
    docker build -t your-docker-id/acc-website .
    ```

3.  **Run the container:**
    ```bash
    docker run -p 8080:80 your-docker-id/acc-website
    ```
    The site will be available at `http://localhost:8080`.

---

## 👥 Contributors

*   **[Akshath Narvekar]** 
*   **[Yash Patil]**
*  

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE.md` file for details.
