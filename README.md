# Inventory Management System

## Deployment Instructions

### Prerequisites
- Node.js 18.x
- MongoDB database (cloud or local)

### Environment Variables
Set these in your platform's dashboard:
- `MONGODB_URI` (your MongoDB connection string)
- `SESSION_SECRET` (any random string)

### Build & Start
Most platforms (Render, Railway, Heroku) will:
- Run `npm install`
- Run `npm run build` (compiles TypeScript)
- Run `npm start` (starts the server)

### Static Files
Static files are served from the `/public` directory automatically.

### Procfile
A `Procfile` is included for Heroku/Render compatibility:
```
web: npm run build && npm start
```

### Example Deployment Steps (Render/Railway/Heroku)
1. Push your code to GitHub.
2. Create a new project on your chosen platform.
3. Connect your GitHub repo.
4. Set the environment variables as above.
5. Deploy!

---

For any issues, check your platform's build logs and ensure your environment variables are set correctly. 