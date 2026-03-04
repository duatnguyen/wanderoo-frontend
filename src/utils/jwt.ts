// src/utils/jwt.ts - JWT token utilities
export interface DecodedToken {
  role: string[];
  username: string;
  sub: string;
  iat: number; // Issued at
  exp: number; // Expiration time
}

/**
 * Decode JWT token without verification (client-side only)
 */
export const decodeToken = (token: string): DecodedToken | null => {
  try {
    // JWT has 3 parts separated by dots
    const parts = token.split(".");
    if (parts.length !== 3) {
      console.error("Invalid JWT format");
      return null;
    }

    // Decode the payload (second part)
    const payload = parts[1];

    // Add padding if needed for base64 decoding
    const paddedPayload = payload + "=".repeat((4 - (payload.length % 4)) % 4);

    // Decode base64
    const decodedPayload = atob(paddedPayload);

    // Parse JSON
    return JSON.parse(decodedPayload) as DecodedToken;
  } catch (error) {
    console.error("Error decoding JWT token:", error);
    return null;
  }
};

/**
 * Check if token is expired
 */
export const isTokenExpired = (token: string): boolean => {
  const decoded = decodeToken(token);
  if (!decoded) return true;

  // Convert exp (seconds) to milliseconds and compare with current time
  const currentTime = Date.now();
  const expirationTime = decoded.exp * 1000;

  return currentTime >= expirationTime;
};

/**
 * Get time until token expires (in milliseconds)
 */
export const getTimeUntilExpiry = (token: string): number => {
  const decoded = decodeToken(token);
  if (!decoded) return 0;

  const currentTime = Date.now();
  const expirationTime = decoded.exp * 1000;

  return Math.max(0, expirationTime - currentTime);
};

/**
 * Extract user info from token
 */
export const getUserFromToken = (token: string) => {
  const decoded = decodeToken(token);
  if (!decoded) return null;

  return {
    id: decoded.sub,
    username: decoded.username,
    role: decoded.role[0]?.replace(/[\[\]]/g, "") || "USER", // Remove brackets from role
  };
};
