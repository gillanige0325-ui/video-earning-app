'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { DollarSign, Video, TrendingUp, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (token) {
      router.push('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Video className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">VideoEarn</h1>
          </div>
          <div className="space-x-4">
            <Link
              href="/login"
              className="text-gray-700 hover:text-blue-600 font-medium"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 font-medium"
            >
              Sign Up
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold text-gray-900 mb-4">
            Watch Videos & Earn Money
          </h2>
          <p className="text-xl text-gray-600 mb-8">
            Earn $0.5 for every video you watch. Up to 30 videos per day!
          </p>
          <Link
            href="/register"
            className="bg-blue-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 inline-block"
          >
            Start Earning Now
          </Link>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <div className="bg-white p-6 rounded-xl shadow-md">
            <DollarSign className="h-12 w-12 text-green-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Earn $0.5 Per Video</h3>
            <p className="text-gray-600">
              Watch full videos and earn real money instantly
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <Video className="h-12 w-12 text-blue-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">30 Videos Daily</h3>
            <p className="text-gray-600">
              Watch up to 30 videos every day and maximize your earnings
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <TrendingUp className="h-12 w-12 text-purple-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Easy Withdrawals</h3>
            <p className="text-gray-600">
              Minimum $5 withdrawal, converted to PKR instantly
            </p>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-md">
            <Shield className="h-12 w-12 text-red-600 mb-4" />
            <h3 className="text-xl font-bold mb-2">Secure Platform</h3>
            <p className="text-gray-600">
              Bank-level security for your account and earnings
            </p>
          </div>
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <h3 className="text-3xl font-bold text-center mb-8">How It Works</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Sign Up Free</h4>
              <p className="text-gray-600">
                Create your account in seconds with just your email
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Watch Videos</h4>
              <p className="text-gray-600">
                Watch full movie clips and videos to earn $0.5 each
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="text-xl font-bold mb-2">Withdraw Money</h4>
              <p className="text-gray-600">
                Cash out your earnings in PKR when you reach $5
              </p>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="mt-16 grid md:grid-cols-3 gap-8 text-center">
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">$15/day</div>
            <p className="text-gray-600">Maximum Daily Earnings</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">PKR 278.5</div>
            <p className="text-gray-600">Current Exchange Rate</p>
          </div>
          <div>
            <div className="text-4xl font-bold text-blue-600 mb-2">$5</div>
            <p className="text-gray-600">Minimum Withdrawal</p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white mt-16 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p>&copy; 2025 VideoEarn. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}