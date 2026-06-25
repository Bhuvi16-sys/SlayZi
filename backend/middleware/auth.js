import admin from "firebase-admin";

let isFirebaseAdminInitialized = false;

// Initialize Firebase Admin SDK if service account environment variable is present
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    isFirebaseAdminInitialized = true;
    console.log("Firebase Admin SDK successfully initialized from environment service account.");
  } catch (error) {
    console.error("Failed to initialize Firebase Admin SDK:", error);
  }
} else {
  console.warn("FIREBASE_SERVICE_ACCOUNT environment variable is not defined. Backend running in developer token decoder mode (signatures not verified).");
}

// Fallback JWT decoder for development when service account credentials are not loaded
function decodeJwtPayload(token) {
  try {
    const base64Url = token.split('.')[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      Buffer.from(base64, 'base64')
        .toString()
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// Authentication middleware
export async function requireAuth(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Unauthorized: Missing Authorization header" });
  }

  const token = authHeader.split(" ")[1];

  if (isFirebaseAdminInitialized) {
    try {
      const decodedToken = await admin.auth().verifyIdToken(token);
      req.user = decodedToken;
      next();
    } catch (error) {
      console.error("Firebase ID Token verification failed:", error);
      return res.status(401).json({ error: "Unauthorized: Invalid or expired token signature" });
    }
  } else {
    // Development fallback mode: parse payload keys directly
    const decoded = decodeJwtPayload(token);
    if (decoded) {
      req.user = decoded; // holds uid, email, etc.
      next();
    } else {
      return res.status(401).json({ error: "Unauthorized: Malformed JWT token payload" });
    }
  }
}
