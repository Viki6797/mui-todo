# 🚀 MyTodo — A Modern SaaS-Style Todo Application

A beautiful, fast, and secure SaaS-style Todo application built with **React**, **Material UI**, and **Firebase**, featuring real-time sync, Google Sign-In, glossy UI, keyboard shortcuts, dark/light themes, animations, and more.

## ✨ Features

### Core Todo Features

- Add new tasks instantly
- Edit tasks inline
- Delete tasks individually
- Mark tasks as completed
- Clear all completed tasks
- Real-time database sync
- Task counter showing remaining tasks
- Filters:
  - All
  - Active
  - Completed

## 🔐 Authentication

- Google Sign-In via Firebase Auth
- Full UI gate (app locked until user logs in)
- Secure Firestore rules
- User avatar + logout button

## 🎨 User Interface

- SaaS-style glassmorphism design
- Smooth UI transitions
- Fully responsive layout
- Clean AppBar with shortcuts, theme toggle, and profile

## 🌓 Theme & Animations

- Light and dark mode
- Soft transitions
- Smooth hover interactions
- Animated todo hover pop-out effect

## 🖱️ Advanced Hover Effect

When hovering over a todo:

- The hovered todo enlarges slightly (scale + shadow)
- Other todos blur and dim
- Effect reverses when the mouse leaves

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |

|---------|--------|
| Enter | Add todo |
| Ctrl + / | Focus input |
| Ctrl + D | Toggle theme |
| Esc | Clear input |

## ☁️ Firestore Security Rules

```groovy
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /todos/{docId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

These rules ensure that only authenticated users can access the Firestore data.

## 🚀 Deployment (CI/CD Ready)

This project uses **Vercel** for deployment:

- Automatic deployments from GitHub (CI/CD)
- Preview URLs for pull requests
- Environment variables managed via Vercel dashboard
- Fully compatible with Vite

## 🛠 Tech Stack

- React (Vite)
- Material UI
- Firebase Authentication
- Firebase Firestore
- Vercel CI/CD
- GitHub Integration

## 📦 Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-username/your-repo.git
cd your-repo
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create:

src/firebase.js

Add:

```javascript
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  storageBucket: "...",
  messagingSenderId: "...",
  appId: "..."
};

const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);
export const auth = getAuth(app);
```

### 4. Start the development server

```bash
npm run dev
```

## 📁 Suggested Screenshot Structure

screenshots/
  login.png
  dashboard-light.png
  dashboard-dark.png
  hover-effect.png
  edit-feature.png

## ❤️ Acknowledgements

Built using:

- React
- Material UI
- Firebase
- Vercel
