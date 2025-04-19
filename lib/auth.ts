// /lib/auth.ts
import { SignJWT, jwtVerify, JWTVerifyResult } from "jose";

// Secret key for HMAC—make sure process.env.JWT_SECRET is set to a non-empty string.
const SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export interface AuthToken {
  uid: string;
  email: string;
  iat: number;
  exp: number;
}

/**
 * Sign and return a JWT containing uid and email, valid for 2 hours.
 */
export async function signToken(
  payload: { uid: string; email: string }
): Promise<string> {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET);
}

/**
 * Verify a JWT and return the decoded AuthToken or null if invalid.
 */
export async function verifyToken(
  token: string
): Promise<AuthToken | null> {
  try {
    const { payload }: JWTVerifyResult = await jwtVerify(token, SECRET);

    // Extract and validate required fields
    const uid   = (payload as any).uid;
    const email = (payload as any).email;
    const iat   = (payload as any).iat;
    const exp   = (payload as any).exp;

    if (
      typeof uid !== "string" ||
      typeof email !== "string" ||
      typeof iat !== "number" ||
      typeof exp !== "number"
    ) {
      console.error("[auth] Invalid JWT payload:", payload);
      return null;
    }

    return { uid, email, iat, exp };
  } catch (err: any) {
    console.error("[auth] JWT verify failed:", err.message);
    return null;
  }
}
