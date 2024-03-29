/** @type {import('next').NextConfig} */
const nextConfig = {
    basePath: "/",
    images: {
        domains: [
            "uploadthing.com",
            "lh3.googleusercontent.com",
            "avatars.githubusercontent.com",
            "utfs.io",
        ],
    },
    experimental: {
        appDir: true,
    },
};

module.exports = nextConfig;
