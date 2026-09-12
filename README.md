# 🧭 roadmap.ai — Interactive Tech Roadmap Platform

An interactive, full-stack visual roadmap platform designed for DevOps Engineers, Cloud Architects, and Developers. Track your engineering learning paths with node graphs, progress checklists, daily streaks, and admin curriculum management.

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=for-the-badge&logo=typescript)
![React Flow](https://img.shields.io/badge/React_Flow-xyflow-purple?style=for-the-badge)
![Drizzle](https://img.shields.io/badge/Drizzle-ORM-green?style=for-the-badge)
![SQLite/Turso](https://img.shields.io/badge/Database-SQLite%20%7C%20Turso-cyan?style=for-the-badge)

---

## 🌟 Key Features

- **Interactive Node Graph (`@xyflow/react`)**: Serpentine animated graph with milestone nodes, real-time status rings, zoom/pan controls, and celebratory confetti.
- **Pre-Seeded Engineering Tracks**:
  - **DevOps Engineering**: Python → Linux → Git → Docker → Jenkins → Kubernetes → Terraform.
  - **Cloud Engineering (AWS)**: AWS Fundamentals & IAM → EC2 → S3 → RDS → VPC.
- **Study Guides & Curated Resources**: Dedicated markdown guides for each topic with documentation and video resources.
- **Learner Dashboard**: Real-time progress percentages, daily streak counters, and resume shortcuts.
- **Admin Studio**: Dedicated studio to create new subjects, customize color themes, and attach milestones.
- **Authentication**: Role-based access control (`admin` vs `learner`) powered by NextAuth.js v5.
- **Parallel Dev Sub-Agents (`.agents/`)**: Automated parallel runner executing ESLint, TypeScript verification, and security audit in ~3.5 seconds.
- **CI/CD Pipelines**: GitHub Actions workflows for automated verification and Vercel cloud deployment.

---

## 🛠️ Tech Stack

| Layer | Tech |
|---|---|
| **Framework** | Next.js 15 (App Router, Turbopack) |
| **Language** | TypeScript |
| **Styling** | Vanilla CSS with custom properties & glassmorphism |
| **Node Graph** | `@xyflow/react` |
| **ORM & DB** | Drizzle ORM + `@libsql/client` (SQLite locally, Turso in cloud) |
| **Auth** | NextAuth.js v5 (Auth.js) |
| **CI/CD** | GitHub Actions (`.github/workflows/ci.yml`, `deploy.yml`) |

---

## 🚀 Getting Started

### 1. Clone & Install
```bash
git clone https://github.com/rtx5090sss/roadmap.ai.git
cd roadmap.ai
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

### 3. Initialize & Seed Database
```bash
npm run seed
```

### 4. Start Development Server
```bash
npm run dev
```
Open **[http://localhost:3000](http://localhost:3000)** in your browser.

---

## 🔑 Demo Accounts

- **Admin Portal**: `admin@roadmap.dev` / `adminpassword123`
- **Learner Demo**: `learner@roadmap.dev` / `learner123`

---

## ⚡ Parallel Sub-Agent Quality Check

Run all quality checks in parallel:
```bash
node .agents/scripts/parallel-check.mjs
```
