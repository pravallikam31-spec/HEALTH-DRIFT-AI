# Health Drift AI

Health Drift AI is a health dashboard application with food image recognition and meal tracking. The web app is built with React, TypeScript, TanStack Start, and Firebase. Food recognition is provided by a local Flask API backed by a TensorFlow/Keras model.

## Requirements

- Node.js and npm
- Python 3.11 (recommended for the TensorFlow backend)
- A Firebase project configured for the application

## Web application

Install dependencies and start the development server:

```sh
npm install
npm run dev
```

Configure the Firebase web app credentials in `src/lib/firebase.ts` and ensure Firebase Authentication and Firestore are enabled for your project. Firestore security rules are in `firestore.rules`.

## Food recognition API

The food dashboard sends images to `http://127.0.0.1:5000/predict`. Run the Flask service on the same machine as the browser during local development.

In a separate terminal, from the repository root:

```powershell
cd backend
py -3.11 -m venv .venv
.\.venv\Scripts\Activate.ps1
python -m pip install Flask flask-cors numpy Pillow tensorflow
python app.py
```

The API loads `backend/best_food_model.keras` and `backend/food_class_names.json` when it starts. Keep both files alongside `app.py`. The `/predict` endpoint accepts an image in the multipart form field `image`.

The included command-line client can submit a local image to the running API:

```powershell
python .\test_prediction.py C:\path\to\food-image.jpg
```

The browser integration uses a loopback address, so it is intended for local development. A deployed web app needs an API URL reachable by its users and appropriate cross-origin/network configuration.
