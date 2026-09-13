# ELYVEX — Echo Hub

A full-stack superhero help portal for the TechAscent Machine Test.

## Features
- Cinematic Elyvex landing page
- Interactive superhero chatbot
- Conversational collection of name, age, location and email
- Grievance/request submission
- Automatic email notification through SMTP/Nodemailer
- Responsive futuristic UI
- Elyvex powers, story and mission sections
- Local fallback when email is not configured

## Run

### Backend
```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

The frontend expects the API at `http://localhost:5000/api`.

For real email notifications, configure SMTP values in `backend/.env`.
