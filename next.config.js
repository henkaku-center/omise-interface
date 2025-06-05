/** @type {import('next').NextConfig} */
const nextTranslate = require('next-translate-plugin')

const nextConfig = nextTranslate({
  reactStrictMode: true,
  trailingSlash: true
})

module.exports = nextConfig
