'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const isDarkClass = document.documentElement.classList.contains('dark');
    setIsDark(isDarkClass);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#1f1f1f] text-zinc-900 dark:text-zinc-100 selection:bg-zinc-200 dark:selection:bg-zinc-800 antialiased transition-colors duration-200">
      
      <nav className="sticky top-0 z-50 backdrop-blur-md bg-white/70 dark:bg-[#1f1f1f]/70 border-b border-zinc-100 dark:border-zinc-800/80">
        <div className="max-w-3xl mx-auto px-6 h-16 flex items-center justify-between">
          
          <Link 
            href="/"
            className="group inline-flex items-center space-x-2 text-sm font-medium text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white transition-colors"
          >
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth={2} 
              stroke="currentColor" 
              className="w-4 h-4 transform group-hover:-translate-x-0.5 transition-transform"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            <span>Back to home</span>
          </Link>

          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg border border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/50 text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-all duration-200"
          >
            {isDark ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v2.25m0 13.5V21M4.22 4.22l1.58 1.58m12.42 12.42l1.58 1.58M3 12h2.25m13.5 0H21M4.22 19.78l1.58-1.58M17.66 6.34l1.58-1.58M12 7.5a4.5 4.5 0 110 9 4.5 4.5 0 010-9z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 12.83A9.78 9.78 0 0111.17 2.25 9.74 9.74 0 003 12c0 5.385 4.365 9.75 9.75 9.75 a9.76 9.76 0 009.03-6.17z" />
              </svg>
            )}
          </button>

        </div>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-16 md:py-24">
        
        <header className="border-b border-zinc-100 dark:border-zinc-800 pb-8 mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-zinc-100 dark:bg-zinc-800 text-xs font-medium text-zinc-600 dark:text-zinc-400 mb-6 tracking-wide uppercase">
            <span>Legal Document</span>
          </div>
          <h1 className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white sm:text-5xl">
            Privacy Policy
          </h1>
          <p className="mt-3 text-sm text-zinc-400 dark:text-zinc-500 font-medium">
            Last updated: June 10, 2026
          </p>
        </header>

        <main className="space-y-12 text-base leading-relaxed text-zinc-600 dark:text-zinc-300">
          
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              1. Overview
            </h2>
            <p>
              Aryan Naik ("we", "our", or "us") operates the DiviPay mobile application and website. 
              We respect your privacy and are committed to protecting it through complete transparency. 
              This Privacy Policy outlines our straightforward approach regarding user information.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              2. Zero Data Collection & Processing
            </h2>
            <div className="p-4 rounded-xl bg-zinc-50 dark:bg-zinc-900/50 border border-zinc-100 dark:border-zinc-800/60">
              <p className="font-medium text-zinc-950 dark:text-white mb-1">
                DiviPay does not collect, store, transmit, or share any personal data.
              </p>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">
                All computational data entered into the application—including names, item entries, individual 
                prices, and mathematical split calculations—is processed strictly locally on your physical device. 
                We operate no external data warehouses, deploy no user tracking databases, and maintain zero technical 
                visibility into the details of your financial inputs.
              </p>
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              3. Device Interactivity
            </h2>
            <p>
              To execute core utility features, DiviPay leverages secure, native web browser architecture (such as the 
              native Web Share API). This layer allows you to generate and export visual itemized breakdowns or text summaries 
              directly to your peer networks. This rendering occurs entirely client-side on your hardware.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              4. External Ecosystems
            </h2>
            <p>
              The application is hosted globally via the Vercel edge framework. Standard web server deployments automatically 
              log basic, completely non-personally identifiable networking telemetry metadata (such as IP handshakes and browser 
              user-agents) exclusively to optimize system security and global performance delivery profiles. We include no 
              commercial third-party advertising tracking libraries or consumer analytics suites inside the code.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              5. Policy Iterations
            </h2>
            <p>
              We reserve the right to refine this privacy paradigm to align with potential application updates. Any updates 
              will instantly propagate directly to this web location, demarcated by an updated operational release date.
            </p>
          </section>

          <section className="space-y-4 pt-4 border-t border-zinc-100 dark:border-zinc-800">
            <h2 className="text-lg font-semibold text-zinc-900 dark:text-white tracking-tight">
              6. Developer Contact
            </h2>
            <p>
              For immediate clarification regarding this transparency document or app functionality, direct inquiries to:
            </p>
            <div className="inline-block">
              <a 
                href="mailto:aryann2203@gmail.com" 
                className="text-sm text-zinc-900 dark:text-white font-medium underline underline-offset-4 hover:text-zinc-500 dark:hover:text-zinc-400 transition-colors"
              >
                aryann2203@gmail.com
              </a>
            </div>
          </section>

        </main>

        <footer className="mt-24 pt-8 border-t border-zinc-100 dark:border-zinc-800 text-center text-xs text-zinc-400 dark:text-zinc-600">
          &copy; {new Date().getFullYear()} DiviPay. All rights reserved.
        </footer>

      </div>
    </div>
  );
}