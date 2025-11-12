# SleepWise

SleepWise predicts nightly rest quality from lifestyle signals and delivers personalised guidance that nudges healthier routines.

## Features
- Authenticated dashboard with a guided sleep questionnaire.
- Real-time prediction stored in MongoDB and echoed through tailored recommendations.
- Insight gallery powered by JSON datasets for quick chart iteration.
- Responsive UI with smooth scroll, dark-mode aware theming, and hero animations.

## Tech Stack
- **Frontend:** React, Vite, Tailwind CSS, Framer Motion, Nivo, lucide-react.
- **Backend:** Node.js, Express, MongoDB (Mongoose), JWT auth.
- **ML Service:** Flask API invoking a scikit-learn model (joblib payload).
- **Hosting:** Frontend on Netlify, backend and ML services on Render, database on MongoDB Atlas.

## Project Structure
- `Frontend/` — SPA source, charts, context, and static data (`public/data`).
- `Backend/` — Express server, routes, models, and ML client.
- `Backend/ml_model/` — Flask predictor (`app.py`) with its own `requirements.txt`.

## Environment Variables

### Backend `.env`
```dotenv
MONGO_URI=your-mongodb-uri
PORT=5000
ML_URL=https://sleepqualityapp-backend-ml-flask.onrender.com/predict
```

## Local Setup

1. **Clone & install**
   ```bash
   git clone <repo>
   cd SleepWise/Frontend && npm install
   cd ../Backend && npm install
   ```

2. **Run services**
   ```bash
   # Backend (Express)
   cd Backend
   npm run dev

   # ML service (Flask)
   cd ml_model
   pip install -r requirements.txt
   flask run --host=0.0.0.0 --port=5001

   # Frontend (Vite)
   cd ../../Frontend
   npm run dev
   ```

3. **Open** `http://localhost:5173` (or the port logged by Vite).

## Deployment Notes
- Frontend is hosted on Netlify.
- Backend and ML services run on Render—update `ML_URL` and `VITE_API_BASE` with live domains.
- Keep `PORT=5000` locally; Render injects its own `PORT` at runtime.
- Upload or refresh chart JSON files under `Frontend/public/data` to drive new visualisations—append to `chartConfigs` in `InsightsSection.jsx` for additional charts.

## API Reference
| Method | Endpoint                 | Description                          |
|--------|--------------------------|--------------------------------------|
| POST   | `/api/auth/signup`       | Register a new account               |
| POST   | `/api/auth/login`        | Authenticate and receive JWT         |
| POST   | `/api/sleep/submit`      | Store questionnaire + fetch prediction |

Responses include the saved entry and model score; the frontend uses them to render interpretation and insights.


## Future Enhancements
- Expand insights with additional chart configs or real analytics feeds.
- Harden the ML service with batching, model versioning, and async retries.
- Add reminders or push notifications using user chronotype data.
