---
name: devops-pipeline
description: >-
  DevOps engineer workflow for GitHub Actions CI/CD, linting, type-checking,
  automated build gates, and Vercel cloud deployment.
---

# DevOps CI/CD & Cloud Deployment

Derived from `vercel-labs/agent-skills/deploy-to-vercel` on skills.sh:
1. **Continuous Integration**:
   - Automated workflow `.github/workflows/ci.yml` runs on every push and PR.
   - Runs linting, type-checking, and next build in parallel steps.
2. **Continuous Delivery**:
   - Vercel preview environments on Pull Requests.
   - Production deployment on merge to `main`.
3. **Phase 2 Containerization**:
   - Multi-stage `Dockerfile` with minimal node Alpine base image.
   - `docker-compose.yml` for local container testing and EC2 Terraform deployment.
