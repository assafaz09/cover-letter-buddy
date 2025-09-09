# Frontend Deployment Guide

## Deploy to Railway

1. Create a new project in Railway
2. Connect your GitHub repository
3. Set the root directory to `frontend`
4. Railway will automatically detect the `nixpacks.toml` file
5. Deploy!

## Environment Variables

The frontend will automatically connect to:
`https://cover-letter-buddy-production.up.railway.app`

If you need to change the backend URL, set:
`VITE_API_URL=your-backend-url`

## Build Commands

- Install: `npm install`
- Build: `npm run build`
- Start: `npm run start`
