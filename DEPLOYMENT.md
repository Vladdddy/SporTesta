# SporTesta Deployment Configuration

## Changes Made for Production Deployment

### Backend (Express Server) - Deployed on Render
- **File**: `express-backend/server.js`
- **Changes**:
  - Updated CORS origin from `http://localhost:5173` to `https://sportesta.vercel.app`
  - Updated port configuration to use `process.env.PORT || 3000` for Render compatibility
  - Server now listens on dynamic port provided by Render

### Frontend (React App) - Deployed on Vercel
- **Files Updated**:
  - `src-sportesta/src/App.jsx` - Updated API calls to use production backend URL
  - `src-sportesta/src/pages/Login.jsx` - Updated login API endpoint
  - **New file**: `src-sportesta/src/config.js` - Centralized API configuration
  - **New file**: `src-sportesta/vercel.json` - Vercel routing configuration

### API Configuration
- **Production Backend URL**: `https://sportesta.onrender.com`
- **Production Frontend URL**: `https://sportesta.vercel.app`

### Environment Variables Needed on Render
Make sure these environment variables are set in your Render dashboard:
- `ADMIN_USERNAME=sportesta.admin`
- `ADMIN_PASSWORD=f!U6%d6iFGy&f7`
- `SECRET_KEY=S2cR3t$k4yG3n3R4t3d`
- `PORT` (automatically set by Render)

### Deployment Commands
- **Frontend (Vercel)**: `pnpm build` (configured in vercel.json)
- **Backend (Render)**: `npm start` (runs `node server.js`)

### Development vs Production
To switch back to local development, update `src-sportesta/src/config.js`:
```javascript
export const API_CONFIG = {
    BASE_URL: "http://localhost:3000", // For development
    // BASE_URL: "https://sportesta.onrender.com", // For production
};
```

## Deployment Status
✅ Backend CORS configured for Vercel frontend
✅ Frontend API calls updated for Render backend
✅ Dynamic port configuration for Render
✅ Vercel routing configuration added
✅ Centralized API configuration created

## Testing
1. Frontend should load at: https://sportesta.vercel.app
2. Login functionality should work with backend at: https://sportesta.onrender.com
3. All API endpoints should be accessible cross-origin
