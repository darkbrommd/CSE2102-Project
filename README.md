# Husky Adoption Website (Archived Repository)

This repository contains the **Husky Adoption Website**, an educational project developed during the Fall 2024 semester in the CSE2102 course at UConn. Originally hosted on the UConn school GitHub, it is now archived and preserved here for future reference. **No further updates or maintenance** will be performed.

### About the Project
The Husky Adoption website was created to simulate a pet adoption platform showcasing huskies available for adoption. The application allowed potential adopters to view adoptable pets, learn about their backgrounds, and even simulate making donations to support the cause. The project served as a hands-on introduction to full-stack development, Docker containerization, and software engineering best practices.

**Key Features:**
- **Pet Profiles & Adoption Flow:** Users could browse adoptable huskies and simulate an adoption request, exploring the logic behind user interactions, inventory management, and data persistence.
- **Donation Page:** A fictional donation system to learn about secure transactions, user authentication, and data handling.
- **User-Focused UX:** React-based frontend with an intuitive interface and logical navigation patterns.

### Technologies & Concepts Practiced
- **Backend:** Python, Flask, SQLAlchemy, JWT-based authentication.
- **Frontend:** React, React Router, Axios for API requests.
- **Containerization & Deployment:** Docker for packaging both backend and frontend.
- **CI/CD (Example Configurations):** GitHub Actions workflows (in `.github/workflows`) for CI.
- **Design & Documentation:** UML diagrams, ER diagrams, and other high-level design files included in `docs/`.

---

## Project Structure

Below is a partial directory structure to help you navigate the project:

```
.
├─ .github/
│  └─ workflows/             
│
├─ backend/                  
│  ├─ api_docs/              
│  │  ├─ adoption/             
│  │  ├─ donations/             
│  │  ├─ pets/                  
│  │  ├─ schedule/              
│  │  ├─ search/                
│  │  ├─ user/                
│  ├─ instance/
│  │  └─ database.db         # SQLite DB (local dev)
│  ├─ Dockerfile             # Backend Docker configuration
│  ├─ __init__.py
│  ├─ adopt.py
│  ├─ config.py
│  ├─ db.py
│  ├─ donate.py
│  ├─ initialize_data.py     # Initializes database with sample data
│  ├─ main.py                # Entry point for running the backend app
│  ├─ models.py
│  ├─ pets.py
│  ├─ requirements.txt       # Backend dependencies
│  ├─ schedule.py
│  ├─ search.py
│  └─ user.py
│
├─ docs/                     # Documentation and design files
│  ├─ Milestone #2.docx
│  ├─ Search.drawio
│  ├─ er-diagram.drawio
│  ├─ high-level-diagram.drawio
│  ├─ login-page.drawio
│  ├─ profile.drawio
│  ├─ sign-up-page.drawio
│  └─ use-case-diagram.drawio
│
├─ frontend/                 # Frontend source code (React)
│  ├─ build/                 # Production build output
│  ├─ images/
│  ├─ static/
│  ├─ public/
│  │  ├─ images/
│  │  ├─ favicon.ico
│  │  ├─ index.html
│  │  ├─ logo192.png
│  │  ├─ logo512.png
│  │  ├─ manifest.json
│  │  └─ robots.txt
│  ├─ src/
│  │  ├─ components/         # Reusable UI components
│  │  ├─ pages/              # Page-level views
│  │  ├─ App.js
│  │  ├─ App.css
│  │  ├─ App.test.js
│  │  ├─ index.js
│  │  ├─ index.css
│  │  ├─ logo.svg
│  │  ├─ reportWebVitals.js
│  │  └─ setupTests.js
│  ├─ Dockerfile             # Frontend Docker configuration
│  ├─ README.md
│  ├─ package-lock.json
│  └─ package.json
│
├─ tests/                    # Backend tests
│  ├─ __init__.py
│  ├─ test_adopt.py
│  ├─ test_donation.py
│  ├─ test_pets.py
│  └─ test_user.py
│
├─ .pylintrc                 # Linting configuration for Python code
├─ ci.yml                    # Additional CI config
├─ .gitignore
└─ README.md                 # This file
```

---

## Starting the Project Locally

**Note:** This repository is archived. The following instructions reflect the original development environment and may require adjustments if dependencies have changed over time.

### Prerequisites
- **Git:** To clone the repository.
- **Docker & Docker Compose:** To build and run the containers for backend and frontend.
- **(Optional) Python and Node.js:** If you wish to run the backend and frontend outside of Docker.

### Running with Docker

**Backend:**
1. Navigate to the `backend` directory:
   ```bash
   cd backend
   ```
2. Build the backend Docker image:
   ```bash
   docker build -t husky-backend:latest .
   ```
3. Run the backend container:
   ```bash
   docker run -p 5000:5000 husky-backend:latest
   ```
   The backend will now be accessible at `http://localhost:5000`.

**Frontend:**
1. Navigate to the `frontend` directory:
   ```bash
   cd ../frontend
   ```
2. Build the frontend Docker image:
   ```bash
   docker build -t husky-frontend:latest .
   ```
3. Run the frontend container:
   ```bash
   docker run -p 80:80 husky-frontend:latest
   ```
   The frontend will be accessible at `http://localhost`.

### Connecting Frontend and Backend
- The frontend expects the API to be at `http://localhost:5000` by default (or as configured in the React code). With both containers running, you can browse to `http://localhost` to interact with the frontend, which should communicate with the backend at `http://localhost:5000`.

### Running Without Docker (Optional)

**Backend (Python):**
1. Install Python 3.9+.
2. Install backend dependencies:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```
3. Initialize the database and start the backend:
   ```bash
   python initialize_data.py
   python main.py
   ```
   The backend will be accessible at `http://localhost:5000`.

**Frontend (Node.js & NPM):**
1. Install Node.js (16+ recommended).
2. From the `frontend` directory:
   ```bash
   npm install
   npm start
   ```
   The frontend development server will be accessible at `http://localhost:3000`.


---

## Archived Status & Disclaimer
This codebase is provided as-is and is not maintained. It serves as a historical reference for the Husky Adoption project. Feel free to fork it and experiment, but do not expect updates or support.

A special thanks to my amazing team members—Alper Tepebas, Dylan Wojteczko, and Shrivishnu Venkatesan—for their hard work, collaboration, and dedication throughout this project. Your contributions made this project possible!
---

# Below is the Original Readme.md. 

---

# cse2102-fall24-team36


## Group Members

**Supeng Yu**       - suy20005  
**Alper Tepebas**   - alt21028  
**Dylan Wojteczko** - dcw18002  
**Shrivishnu Venkatesan** - shv20006

## Trello Board
https://trello.com/b/pvWsZoYV/group-6-scrum-board

## Figma Prototype
[https://www.figma.com/design/CXFVGp0xjA3qPiNXCHrSzu/Pet-Adoption-Website](https://www.figma.com/design/1bcRqPeHS5d83vVffy2Wqg/Pet-Adoption-Website-Final?node-id=44-2&t=d5I1eijwVOoCc3h9-1)

## Updated Figa Prototype
https://www.figma.com/design/j7beBGUvMgYpflZzpbQRyA/Pet-Adoption-Application-Figma-Final?node-id=0-1&node-type=canvas&t=sRIrkre0qKIiDILG-0

## Preview
https://share.cleanshot.com/NjfkH8WY
