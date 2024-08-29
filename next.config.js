const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true'
});

const { version } = require('./package.json');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  generateBuildId: () => Promise.resolve(version),
  distDir: 'build/_next',
  optimizeFonts: false
}

module.exports = withBundleAnalyzer(nextConfig);
