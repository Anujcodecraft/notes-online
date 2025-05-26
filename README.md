# 🎓 AcademicHub - College Study Portal

AcademicHub is a MERN-based web application designed specifically for our college students. It allows verified students to upload and share study materials including notes, previous year questions (PYQs), and assignments. Other students can browse, upvote, and access these resources securely using Google Authentication via Firebase.

![AcademicHub Screenshot](./assets/academic-analytics-main.png)

## 🚀 Features

- 🔐 **Google Login** via Firebase Authentication
- 📤 Upload **notes**, **PYQs**, and **assignments** (only permitted users)
- 📥 Students can **view and download** resources
- 👍 Upvote helpful content to push it to the top
- 🧑‍🏫 Visit uploader profiles to see their contributions
- ☁️ File storage using **Cloudinary**
- 📊 Real-time analytics using **Google Analytics**
- 📦 Built with the robust **MERN** stack + **Supabase**

---

## 📈 Analytics Overview (Last 28 Days)

### Engagement Summary

![User Overview](./assets/analytics-overview-1.png)

- **Active Users**: 376  
- **Engagement Rate**: 86.4%  
- **Total Views**: 14,000  
- **Event Count**: 20,000  

---

### Page Views & Stickiness

![Page Views](./assets/analytics-overview-2.png)

- **Page Views**: 14K for `AcademicHub - Notes`
- **User Stickiness**:
  - DAU/WAU: **20.8%** ⬆️ 308.3%
  - WAU/MAU: **6.4%** ⬇️ 76.0%

---

## 🧱 Tech Stack

| Technology | Role |
|------------|------|
| **MongoDB** | Database |
| **Express.js** | Backend API |
| **React.js** | Frontend UI |
| **Node.js** | Runtime |
| **Firebase** | Authentication |
| **Cloudinary** | File uploads |
| **Supabase** | Backend services |
| **Google Analytics** | Tracking & insights |

---

## 🛠️ Local Setup

### Prerequisites

- Node.js & npm
- MongoDB Atlas or local MongoDB
- Firebase, Cloudinary, Supabase accounts

### Clone and Run

```bash
git clone https://github.com/your-username/AcademicHub.git
cd AcademicHub

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm start
