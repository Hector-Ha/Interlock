import crypto from "crypto";

export const verifyWebhookSignature = (
  signature: string,
  body: any,
  secret: string
): boolean => {
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(JSON.stringify(body));
  const expectedSignature = hmac.digest("hex");

  return signature === expectedSignature;
};
