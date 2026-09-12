-- RoadmapEngine Seed Data SQL Script

-- Admin & Demo Learner Users (password: adminpassword123 / learner123 hashed with bcrypt)
INSERT OR IGNORE INTO users (id, name, email, password, role, created_at, updated_at)
VALUES 
  ('usr-admin-01', 'System Administrator', 'admin@roadmap.dev', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'admin', strftime('%s', 'now'), strftime('%s', 'now')),
  ('usr-learner-01', 'Alex Learner', 'learner@roadmap.dev', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'learner', strftime('%s', 'now'), strftime('%s', 'now'));

-- Subjects / Tracks
INSERT OR IGNORE INTO subjects (id, title, slug, description, icon, color, order_index, created_at)
VALUES 
  ('sub-devops-01', 'DevOps Engineering', 'devops', 'Master the complete modern DevOps lifecycle: Linux, Git, Containers, CI/CD, Kubernetes, and Infrastructure as Code.', 'Terminal', '#38bdf8', 0, strftime('%s', 'now')),
  ('sub-cloud-02', 'Cloud Engineering (AWS)', 'cloud-engineering', 'Design highly available, fault-tolerant, and scalable architectures on Amazon Web Services (AWS).', 'Cloud', '#f59e0b', 1, strftime('%s', 'now'));

-- DevOps Milestones
INSERT OR IGNORE INTO topics (id, subject_id, title, slug, description, content, resource_links, order_index, estimated_minutes, created_at)
VALUES
  ('top-devops-01', 'sub-devops-01', 'Python for DevOps & Scripting', 'python', 'Automate systems tasks, manipulate JSON/YAML configs, and write CLI tooling using Python.', '# Python for DevOps\n\nAutomate systems and infrastructure tasks with Python.', '[{"label":"Python Docs","url":"https://docs.python.org/3/tutorial/","type":"docs"}]', 0, 60, strftime('%s', 'now')),
  ('top-devops-02', 'sub-devops-01', 'Linux Fundamentals & Shell Scripting', 'linux', 'Linux file hierarchy, permissions, systemd services, process monitoring, and Bash scripting.', '# Linux Fundamentals\n\nMaster the core OS powering the cloud.', '[{"label":"Linux Journey","url":"https://linuxjourney.com","type":"guide"}]', 1, 90, strftime('%s', 'now')),
  ('top-devops-03', 'sub-devops-01', 'Git & Version Control Workflows', 'git', 'Branching models, Git Flow, merge strategies, and interactive rebasing.', '# Git Workflows\n\nGitOps and version control standards.', '[{"label":"Pro Git","url":"https://git-scm.com/book/en/v2","type":"book"}]', 2, 45, strftime('%s', 'now')),
  ('top-devops-04', 'sub-devops-01', 'Docker & Containerization', 'docker', 'Container architecture, multi-stage Dockerfiles, image optimization, and Docker Compose.', '# Docker & Containers\n\nPackage and isolate applications.', '[{"label":"Docker Docs","url":"https://docs.docker.com","type":"docs"}]', 3, 90, strftime('%s', 'now')),
  ('top-devops-05', 'sub-devops-01', 'Jenkins & CI/CD Automation', 'jenkins', 'Declarative pipelines, Jenkinsfile syntax, automated testing triggers, and artifacts storage.', '# Jenkins CI/CD\n\nAutomate build, test, and delivery.', '[{"label":"Jenkins Pipeline","url":"https://www.jenkins.io/doc/book/pipeline/","type":"docs"}]', 4, 75, strftime('%s', 'now')),
  ('top-devops-06', 'sub-devops-01', 'Kubernetes & Container Orchestration', 'kubernetes', 'Pods, Deployments, Services, Ingress, ConfigMaps, Secrets, and Helm Charts.', '# Kubernetes Orchestration\n\nManage containerized clusters at scale.', '[{"label":"K8s Docs","url":"https://kubernetes.io/docs/home/","type":"docs"}]', 5, 120, strftime('%s', 'now')),
  ('top-devops-07', 'sub-devops-01', 'Terraform & Infrastructure as Code (IaC)', 'terraform', 'HCL syntax, providers, state management, modules, and plan/apply workflows.', '# Terraform IaC\n\nDeclarative cloud provisioning.', '[{"label":"Terraform Docs","url":"https://developer.hashicorp.com/terraform/docs","type":"docs"}]', 6, 90, strftime('%s', 'now'));

-- Cloud Engineering Milestones
INSERT OR IGNORE INTO topics (id, subject_id, title, slug, description, content, resource_links, order_index, estimated_minutes, created_at)
VALUES
  ('top-cloud-01', 'sub-cloud-02', 'AWS Fundamentals & IAM', 'aws-fundamentals', 'Global infrastructure, IAM users, roles, policies, and least-privilege security.', '# AWS & IAM\n\nCore security and AWS architecture.', '[{"label":"AWS IAM Guide","url":"https://docs.aws.amazon.com/IAM/latest/UserGuide/","type":"docs"}]', 0, 60, strftime('%s', 'now')),
  ('top-cloud-02', 'sub-cloud-02', 'Amazon EC2 & Compute Services', 'ec2', 'Instance types, AMIs, EBS volumes, Security Groups, and User Data scripts.', '# Amazon EC2\n\nElastic compute capacity in the cloud.', '[{"label":"EC2 Docs","url":"https://docs.aws.amazon.com/ec2/","type":"docs"}]', 1, 75, strftime('%s', 'now')),
  ('top-cloud-03', 'sub-cloud-02', 'Amazon S3 & Storage Architecture', 's3', 'Object storage, bucket policies, lifecycle rules, CORS, and versioning.', '# Amazon S3\n\nHighly durable object storage.', '[{"label":"S3 Docs","url":"https://docs.aws.amazon.com/s3/","type":"docs"}]', 2, 45, strftime('%s', 'now')),
  ('top-cloud-04', 'sub-cloud-02', 'Amazon RDS & Database Management', 'rds', 'Managed relational databases, Multi-AZ deployments, read replicas, and backups.', '# Amazon RDS\n\nManaged relational database services.', '[{"label":"RDS Docs","url":"https://docs.aws.amazon.com/rds/","type":"docs"}]', 3, 60, strftime('%s', 'now')),
  ('top-cloud-05', 'sub-cloud-02', 'VPC & Cloud Networking', 'vpc', 'Virtual Private Clouds, subnets, Route Tables, Internet Gateways, and NAT Gateways.', '# Virtual Private Cloud\n\nIsolated virtual network topologies.', '[{"label":"VPC Docs","url":"https://docs.aws.amazon.com/vpc/","type":"docs"}]', 4, 90, strftime('%s', 'now'));
