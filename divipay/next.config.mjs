/** @type {import('next').NextConfig} */

import nextPwa from 'next-pwa';

const withPWA = nextPwa({
  dest: 'public',
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === 'development',
})


const nextConfig = nextPwa({
  experimental: {
    appDir: true,
  },
});

export default withPWA(nextConfig);


