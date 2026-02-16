module.exports = {
  apps: [
    {
      name: 'muhit-frontend',
      cwd: '/var/www/vhosts/muhitsolution.com/httpdocs',
      script: 'node_modules/next/dist/bin/next',
      args: 'start -p 3000',
      env: {
        NODE_ENV: 'production',
        NEXT_PUBLIC_API_URL: 'https://muhitsolution.com/api',
        NEXT_PUBLIC_SITE_URL: 'https://muhitsolution.com',
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '512M',
    },
    {
      name: 'muhit-api',
      cwd: '/var/www/vhosts/muhitsolution.com/httpdocs/muhit-api',
      script: 'dist/src/main.js',
      env: {
        NODE_ENV: 'production',
        JWT_SECRET: 'muhit-jwt-secret-change-me-2026',
        PORT: 3001,
      },
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '256M',
    },
  ],
};
