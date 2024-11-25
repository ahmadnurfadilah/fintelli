"use client";

import { ArrowRight, Bot, LineChart, MessageSquare, PieChart, User, Wallet } from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Hero Section */}
      <header className="relative overflow-hidden">
        <nav className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bot className="h-8 w-8 text-indigo-600" />
              <span className="text-xl font-bold text-gray-900">Fintelli</span>
            </div>
            <div className="hidden md:flex space-x-8">
              <a href="#features" className="text-gray-600 hover:text-indigo-600 transition-colors">Features</a>
              <a href="#how-it-works" className="text-gray-600 hover:text-indigo-600 transition-colors">How it Works</a>
              <a href="#" className="text-gray-600 hover:text-indigo-600 transition-colors" onClick={() => toast.success("It's free until the end of the year")}>Pricing</a>
            </div>
            <Link href="/auth" className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 transition-colors">
              Get Started
            </Link>
          </div>
        </nav>

        <div className="container mx-auto px-6 pt-20 pb-24 text-center">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-8">
            Your Personal Finance Manager<br/><span className="text-indigo-600">Powered by AI</span>
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-2xl mx-auto">
            Track your spending, get personalized financial advice, and achieve your money goals with our intelligent financial assistant.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/auth" className="flex items-center justify-center space-x-2 bg-indigo-600 text-white px-8 py-4 rounded-lg hover:bg-indigo-700 transition-colors">
              <span>Start Free Trial</span>
              <ArrowRight className="h-5 w-5" />
            </Link>
            <button className="flex items-center justify-center space-x-2 bg-white text-indigo-600 px-8 py-4 rounded-lg border-2 border-indigo-600 hover:bg-indigo-50 transition-colors">
              <span>Watch Demo</span>
            </button>
          </div>
        </div>

        <div className="absolute -bottom-1/2 left-1/2 transform -translate-x-1/2 w-[200%] aspect-[4/1] bg-gradient-to-b from-indigo-50 to-transparent -z-10 rounded-[100%]" />
      </header>

      {/* Features Section */}
      <section className="py-20 bg-white" id="features">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            Powerful Features for Your Financial Success
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <LineChart className="h-8 w-8 text-indigo-600" />,
                title: "Smart Analytics",
                description: "Get detailed insights into your spending patterns and financial habits."
              },
              {
                icon: <Bot className="h-8 w-8 text-indigo-600" />,
                title: "AI Assistant",
                description: "Chat with our AI to get personalized financial advice and recommendations."
              },
              {
                icon: <Wallet className="h-8 w-8 text-indigo-600" />,
                title: "Budget Tracking",
                description: "Set and monitor budgets with real-time updates and notifications."
              }
            ].map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it Works */}
      <section className="py-20 bg-gray-50" id="how-it-works">
        <div className="container mx-auto px-6">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-16">
            How Fintelli Works
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              {[
                {
                  icon: <User className="h-6 w-6 text-indigo-600" />,
                  title: "Sign Up",
                  description: "Create your Fintelli account in minutes."
                },
                {
                  icon: <PieChart className="h-6 w-6 text-indigo-600" />,
                  title: "Input Data",
                  description: "Track your income and expenses effortlessly."
                },
                {
                  icon: <MessageSquare className="h-6 w-6 text-indigo-600" />,
                  title: "Get AI Insights",
                  description: "Chat with our AI assistant to get personalized financial advice and recommendations."
                }
              ].map((step, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                    <p className="text-gray-600">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=2426"
                alt="Dashboard Preview"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-transparent rounded-lg" />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Ready to Transform Your Financial Future?
          </h2>
          <p className="text-xl text-indigo-100 mb-12 max-w-2xl mx-auto">
            Join thousands of users who are already managing their finances smarter with Fintelli.
          </p>
          <Link href="/auth" className="bg-white text-indigo-600 px-8 py-4 rounded-lg hover:bg-indigo-50 transition-colors font-semibold">
            Get Started Now
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-300 pb-8">
        <div className="container mx-auto px-6">
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © {new Date().getFullYear()} Fintelli. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
}
