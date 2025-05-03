# 🎮 Mimir: Interactive Educational Platform for Learning

## 🧩 Project Description

Mimir is an interactive educational platform that leverages gamification to boost student engagement.  
Designed after a needs analysis at **SUPSI (Scuola Universitaria Professionale della Svizzera Italiana)**, it addresses accessibility, continuity, and cost-free requirements unmet by existing solutions (e.g., Kahoot, Wooclap).

The system is based on a **microservices architecture**:

- ⚙️ **Backend**: Java + Quarkus, optimized with GraalVM; MongoDB as database.
- 🌐 **Frontend**: React + TypeScript (via Vite), using OpenAPI-defined REST APIs.
- 📦 **Containerization & Hosting**: Docker + Google Cloud Run (serverless).
- 🔐 **Authentication**: Microsoft Azure Entra ID (OIDC SSO).

The current release enables course creation, folder organization, asynchronous quizzes, a shared question bank, question imports, and advanced statistics (true/false & multiple choice).

---

## 🔍 Features

- 🎓 **Course Management**: Create, edit, and organize courses in folders.
- ❓ **Asynchronous Quizzes**: Design, publish, and link quizzes to courses.
- 📚 **Shared Question Bank**: Reuse and organize questions across quizzes.
- 📥 **Import Questions**: Bulk import via JSON or CSV format.
- 📊 **Statistics Dashboard**: Aggregated and user-specific performance data.
- 🔒 **Secure Auth**: Azure Entra ID integration for seamless SSO.

---

## 🧱 Architecture

![Architecture Diagram](./screenshots/general-architecture.png)  
*Figure: High-level microservices architecture.*

![Cloud Native](./screenshots/general-architecture-cloud-native.png)  
*Figure: Cloud-native deployment on GCP Cloud Run.*

---

## ⚙️ Technologies

**Backend:**
- Java 21, Quarkus
- GraalVM native image
- MongoDB 6.x
- MicroProfile Config & SmallRye Health/OpenAPI

**Frontend:**
- React 18, TypeScript
- Vite
- Axios

**Infrastructure:**
- Docker & Docker Compose
- Google Cloud Run
- Artifact Registry
- Azure Entra ID (OIDC)

---

## 🛠️ Installation

### 🔧 Prerequisites
- Java 21 & Maven
- Node.js v18+ & npm

---

### 🧪 Development Setup

**Backend:**
```bash
cd backend
mvn clean package
cd target/backend-api-client
npm i
npm link
cd ../..
mvn quarkus:dev
```

**Frontend:**
```bash
npm i
npm link @dti-isin/backend-api-client
npm run dev
```

---

## 🧪 Testing

**Backend:**
```bash
mvn quarkus:test
```

**Frontend:**
```bash
npm run test
# Coverage report
npm run coverage
```

---

## 🚀 Usage

The application is available at:  
🔗 [https://frontend-service-1031980811194.europe-west12.run.app/](https://frontend-service-1031980811194.europe-west12.run.app/)

Users can:
- Create and manage courses and thematic folders
- Create, edit, and publish asynchronous quizzes
- Manage and reuse the shared question bank
- Import questions in bulk
- Track statistics per user and question
- Design both true/false and multiple choice questions

---

## 👥 Authors

**Antonio Marroffino**
- [GitHub](https://github.com/antoniomarroffino)
- [LinkedIn](https://www.linkedin.com/in/antoniomarroffino)

**Luca Fantò**

---

## 📜 License

This project was developed for educational purposes as part of the Bachelor's degree in Computer Engineering at SUPSI.
