'use client';

import { useState } from 'react';
import { Mail, Send } from 'lucide-react';

export default function NewsletterSignup() {
  const [email, setEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubscribed(true);
      setIsLoading(false);
      setEmail('');
    }, 1000);
  };

  if (isSubscribed) {
    return (
      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <Mail className="text-green-600" size={20} />
          <div>
            <p className="text-green-800 font-medium">Thank you for subscribing!</p>
            <p className="text-green-600 text-sm">You'll receive our latest updates and property listings.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <div className="flex items-center space-x-3 mb-4">
        <Mail className="text-primary-400" size={24} />
        <div>
          <h3 className="text-lg font-semibold text-white">Stay Updated</h3>
          <p className="text-gray-300 text-sm">Get the latest property listings and rental tips</p>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex space-x-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          <button
            type="submit"
            disabled={isLoading || !email}
            className="px-4 py-2 bg-primary-600 hover:bg-primary-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 flex items-center space-x-2"
          >
            <Send size={16} />
            <span>{isLoading ? 'Subscribing...' : 'Subscribe'}</span>
          </button>
        </div>
        <p className="text-gray-400 text-xs">
          We respect your privacy. Unsubscribe at any time.
        </p>
      </form>
    </div>
  );
} 