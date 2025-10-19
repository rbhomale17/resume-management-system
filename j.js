import crypto from "crypto";

const JWT_SECRET = crypto.randomBytes(32).toString("base64url");
console.log(JWT_SECRET);
