/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate');

const nextConfig = nextTranslate({
  reactStrictMode: true,
  trailingSlash: true,
})

module.exports = nextConfig
