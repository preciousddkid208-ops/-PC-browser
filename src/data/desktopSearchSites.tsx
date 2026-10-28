/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

export interface QuickBookmark {
  id: string;
  title: string;
  domain: string;
  url: string;
  icon: React.ReactNode;
  category: 'search' | 'reference' | 'tech' | 'shopping' | 'social';
}

export const QUICK_BOOKMARKS: QuickBookmark[] = [
  {
    id: 'google',
    title: 'Google',
    domain: 'google.com',
    url: 'https://www.google.com',
    category: 'search',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" aria-hidden="true">
        <path
          fill="#4285F4"
          d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
        />
        <path
          fill="#34A853"
          d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
        />
        <path
          fill="#FBBC05"
          d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
        />
        <path
          fill="#EA4335"
          d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
        />
      </svg>
    ),
  },
  {
    id: 'wikipedia',
    title: 'Wikipedia',
    domain: 'wikipedia.org',
    url: 'https://www.wikipedia.org',
    category: 'reference',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
        <path
          fill="#E2E8F0"
          d="M12.09 13.12 9.53 5.47H7.78L4.16 16.32H2v1.15h5.18v-1.15H5.85l.89-2.73h3.58l.84 2.73h-1.32v1.15h4.63v-1.15h-1.35l-1.03-3.2zm-2.07-2.06L11.4 6.7l1.37 4.36h-2.75zm10.74 5.26h-1.32l-3.32-9.61h-1.85L12 16.32h-1.33v1.15h4.62v-1.15h-1.35l.8-2.45h3.45l.77 2.45h-1.34v1.15H22v-1.15h-1.24zm-4.3-3.6 1.27-3.9 1.25 3.9h-2.52z"
        />
      </svg>
    ),
  },
  {
    id: 'github',
    title: 'GitHub',
    domain: 'github.com',
    url: 'https://github.com',
    category: 'tech',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6 fill-white">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        />
      </svg>
    ),
  },
  {
    id: 'hackernews',
    title: 'Hacker News',
    domain: 'news.ycombinator.com',
    url: 'https://news.ycombinator.com',
    category: 'tech',
    icon: (
      <div className="w-6 h-6 rounded bg-[#FF6600] flex items-center justify-center font-bold text-white text-xs select-none shadow-sm">
        Y
      </div>
    ),
  },
  {
    id: 'reddit',
    title: 'Reddit',
    domain: 'reddit.com',
    url: 'https://www.reddit.com',
    category: 'social',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6">
        <circle cx="12" cy="12" r="11" fill="#FF4500" />
        <path
          fill="#FFFFFF"
          d="M19.4 12.5c0-.8-.7-1.5-1.5-1.5-.4 0-.8.2-1.1.5-1.1-.8-2.6-1.3-4.3-1.4l.7-3.4 2.4.5c0 .7.6 1.2 1.3 1.2.7 0 1.3-.6 1.3-1.3s-.6-1.3-1.3-1.3c-.6 0-1.1.4-1.3.9l-2.7-.6c-.2 0-.3.1-.4.3l-.9 4.1c-1.8.1-3.4.6-4.5 1.4-.3-.3-.7-.5-1.1-.5-.8 0-1.5.7-1.5 1.5 0 .6.3 1.1.8 1.3-.1.3-.1.6-.1.9 0 2.5 2.8 4.6 6.3 4.6s6.3-2.1 6.3-4.6c0-.3 0-.6-.1-.9.5-.2.8-.7.8-1.3zM9 13.5c0-.6.5-1 1-1s1 .4 1 1-.5 1-1 1-1-.4-1-1zm6 3c-.8.8-2.2.8-3 0-.1-.1-.1-.3 0-.4.1-.1.3-.1.4 0 .6.6 1.6.6 2.2 0 .1-.1.3-.1.4 0 .1.1.1.3 0 .4zm-.9-2c-.6 0-1-.4-1-1s.4-1 1-1 1 .4 1 1-.4 1-1 1z"
        />
      </svg>
    ),
  },
  {
    id: 'amazon',
    title: 'Amazon',
    domain: 'amazon.com',
    url: 'https://www.amazon.com',
    category: 'shopping',
    icon: (
      <svg viewBox="0 0 24 24" className="w-6 h-6" fill="none">
        <path
          d="M3 15.5C8 19 16 19 21 14.5"
          stroke="#FF9900"
          strokeWidth="2.2"
          strokeLinecap="round"
        />
        <path
          d="M18.5 13.5L21.5 14.2L20.5 17.2"
          stroke="#FF9900"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <text
          x="12"
          y="11"
          fill="#FFFFFF"
          textAnchor="middle"
          fontSize="10"
          fontWeight="bold"
          fontFamily="system-ui"
        >
          a
        </text>
      </svg>
    ),
  },
  {
    id: 'apple',
    title: 'Apple',
    domain: 'apple.com',
    url: 'https://www.apple.com',
    category: 'tech',
    icon: (
      <svg viewBox="0 0 170 170" className="w-6 h-6 fill-white">
        <path d="M150.37 130.25c-2.45 5.66-5.35 10.87-8.71 15.66-4.58 6.53-8.33 11.05-11.22 13.56-4.48 4.12-9.28 6.23-14.42 6.35-3.69 0-8.14-1.05-13.32-3.18-5.19-2.12-9.97-3.17-14.34-3.17-4.58 0-9.49 1.05-14.75 3.17-5.26 2.13-9.5 3.24-12.74 3.35-4.35.13-9.16-1.9-14.42-6.08-3.69-3.08-7.66-7.85-11.92-14.34-6.49-9.87-11.75-21.49-15.79-34.86-4.04-13.36-6.06-25.75-6.06-37.15 0-14.27 3.54-26.04 10.63-35.31 7.08-9.28 16.03-13.97 26.83-14.09 4.35 0 9.4 1.25 15.15 3.75 5.75 2.51 9.53 3.82 11.34 3.93 1.58-.11 5.58-1.5 12-4.17 6.42-2.68 11.83-3.88 16.24-3.62 12.3.9 22.38 5.67 30.25 14.32-10.74 6.52-16 15.42-15.79 26.7.21 8.84 3.63 16.22 10.26 22.14 6.63 5.92 14.44 9.47 23.42 10.66-2.58 8.04-5.69 16.03-9.33 23.97zM119.22 33.15c0-7.27 2.66-14.18 7.99-20.72 5.32-6.55 11.85-10.93 19.59-13.15.52 3.82.78 6.94.78 9.35 0 7.37-2.61 14.41-7.83 21.12-5.22 6.7-11.82 11.19-19.8 13.46-.35-2.91-.73-6.26-.73-10.06z" />
      </svg>
    ),
  },
  {
    id: 'nytimes',
    title: 'The New York Times',
    domain: 'nytimes.com',
    url: 'https://www.nytimes.com',
    category: 'reference',
    icon: (
      <div className="w-6 h-6 rounded bg-[#000000] border border-[#33333A] flex items-center justify-center font-serif font-black text-white text-base select-none shadow-sm">
        T
      </div>
    ),
  },
];
