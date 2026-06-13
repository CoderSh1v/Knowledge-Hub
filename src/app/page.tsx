'use client';
import Navbar from '@/components/navbar2';

export default function Home() {

  return (
    <div className="min-h-screen bg-white flex flex-col">

      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center px-8 py-20">
        <div className="text-center max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
            Knowledge Hub
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Store. Manage. Connect.
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Organize your knowledge, manage your resources, and unlock insights
          </p>

        </div>
      </main>
    </div>
  );
}