import type { Metadata } from 'next';
import './globals.css';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';

export const metadata: Metadata = {
  title: 'RoadmapEngine — Visual Learning Tracks for DevOps & Cloud',
  description:
    'An interactive, node-graph roadmap platform where learners master DevOps, Cloud Engineering, Linux, Kubernetes, Terraform, and AWS with real-time progress tracking.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main style={{ minHeight: 'calc(100vh - 250px)' }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}
