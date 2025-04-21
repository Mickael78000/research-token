'use client';

import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import Dashboard from '@/pages/Dashboard';

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-grow">
        <Dashboard />
      </main>
      <Footer />
    </>
  );
}