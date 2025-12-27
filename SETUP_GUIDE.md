# CipherSQLStudio - Setup Guide

## Quick Start (5 minutes)

### 1. Install Dependencies

**Backend:**
```bash
cd backend
npm install
```

**Frontend:**
```bash
cd frontend
npm install
```

### 2. Setup PostgreSQL Database

Create a database for the SQL sandbox:

```sql
CREATE DATABASE sql_sandbox;
```

### 3. Setup MongoDB Atlas (Recommended)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist your IP address (or use 0.0.0.0/0 for development)
5. Get your connection string

### 4. Get LLM API Key

**Option A - OpenAI:**
1. Go to [OpenAI Platform](https://platform.openai.com/)
2. Create an account and generate an API key
3. Set `LLM_PROVIDER=openai` in backend `.env`

**Option B - Google Gemini:**
1. Go to [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Create an API key
3. Set `LLM_PROVIDER=gemini` in backend `.env`

### 5. Configure Environment Variables

**Backend (.env):**
```env
PORT=5000
NODE_ENV=development

MONGODB_URI=<your-mongodb-atlas-connection-string>

PG_HOST=localhost
PG_PORT=5432
PG_USER=postgres
PG_PASSWORD=<your-postgres-password>
PG_DATABASE=sql_sandbox

JWT_SECRET=your_random_secret_key_here

LLM_PROVIDER=openai
OPENAI_API_KEY=<your-openai-key>

CORS_ORIGIN=http://localhost:3000
```

**Frontend (.env):**
```env
REACT_APP_API_URL=http://localhost:5000/api
```

### 6. Seed the Database

```bash
cd backend
npm run seed
```

Expected output:
```
✅ Connected to MongoDB
🗑️  Cleared existing assignments
✅ Inserted 5 assignments into MongoDB
🐘 Setting up PostgreSQL tables...
✅ PostgreSQL tables created and populated
🎉 Database seeding completed successfully!
```

### 7. Run the Application

**Terminal 1 (Backend):**
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend):**
```bash
cd frontend
npm start
```

Visit: `http://localhost:3000`

---

## Troubleshooting

### PostgreSQL Connection Error

**Error:** `Connection refused on localhost:5432`

**Solution:**
- Ensure PostgreSQL is running: `brew services start postgresql` (macOS) or `sudo service postgresql start` (Linux)
- Check PostgreSQL port: `psql -U postgres -c "SHOW port;"`

### MongoDB Connection Error

**Error:** `MongooseError: Connection failed`

**Solution:**
- Verify your MongoDB Atlas connection string
- Check IP whitelist in MongoDB Atlas
- Ensure network access is configured

### LLM API Error

**Error:** `Failed to generate hint`

**Solution:**
- Verify your API key is correct
- Check your API usage limits/quota
- Ensure you've set the correct `LLM_PROVIDER` value

### Port Already in Use

**Error:** `EADDRINUSE: address already in use :::5000`

**Solution:**
- Kill the process: `lsof -ti:5000 | xargs kill -9` (macOS/Linux)
- Or change the PORT in backend `.env`

---

## Testing the Application

### Test Query Execution

1. Navigate to any assignment
2. Try this query:
```sql
SELECT * FROM employees WHERE salary > 70000;
```
3. Click "Execute Query"
4. You should see results displayed

### Test Hint Generation

1. On any assignment page
2. Click "Get Hint"
3. You should receive an AI-generated hint

### Test Authentication (Optional)

1. Click "Sign Up"
2. Create an account
3. Login with your credentials
4. Your username should appear in the header

---

## Development Tips

### Hot Reloading

Both frontend and backend support hot reloading:
- Frontend: Automatically reloads on file changes
- Backend: Uses nodemon for automatic restart

### Debugging

**Backend:**
- Check console logs in the terminal
- Use `console.log()` for debugging
- API errors are logged with details

**Frontend:**
- Open browser DevTools (F12)
- Check Console tab for errors
- Network tab shows API requests

### Database Inspection

**PostgreSQL:**
```bash
psql -U postgres -d sql_sandbox
\dt  # List tables
SELECT * FROM employees;
```

**MongoDB:**
```bash
mongosh "<your-connection-string>"
use ciphersqlstudio
db.assignments.find()
```

---

## Production Deployment

### Backend Deployment (Railway/Render/Heroku)

1. Set environment variables in platform
2. Deploy from Git repository
3. Run migration: `npm run seed`

### Frontend Deployment (Vercel/Netlify)

1. Build the app: `npm run build`
2. Deploy the `build` folder
3. Set `REACT_APP_API_URL` to production backend URL

### Important for Production

- Change `JWT_SECRET` to a strong random string
- Update `CORS_ORIGIN` to your frontend domain
- Use production MongoDB cluster
- Secure PostgreSQL with proper credentials
- Enable HTTPS

---

## Common Issues & Solutions

### Issue: "Only SELECT queries are allowed"
**Cause:** Query validation is working correctly
**Solution:** Write only SELECT queries (as intended)

### Issue: Monaco Editor not loading
**Cause:** Large package download
**Solution:** Wait for initial load, check internet connection

### Issue: No assignments showing
**Cause:** Database not seeded
**Solution:** Run `npm run seed` in backend directory

### Issue: Hint button not working
**Cause:** Invalid LLM API key
**Solution:** Verify API key and provider in `.env`

---

## Need Help?

1. Check the main README.md for detailed documentation
2. Review error messages carefully
3. Ensure all environment variables are set correctly
4. Verify database connections are working

Happy coding! 🚀
