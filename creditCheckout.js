export const CREDIT_CHECKOUT_PAUSED_MESSAGE = 'Credit purchases are temporarily unavailable. Existing credits and purchase support are still available.';

// Fail closed: an absent or malformed setting must never reopen payment links.
// This changes only new checkout creation, not balances or receipt support.
export function creditCheckoutAvailability(env = process.env) {
  const available = env.CREDIT_CHECKOUT_ENABLED === 'true';
  return {
    available,
    code: available ? null : 'CHECKOUT_PAUSED',
    message: available ? 'Credit purchases are available.' : CREDIT_CHECKOUT_PAUSED_MESSAGE,
  };
}

export function requireCreditCheckoutAvailable(_req, res, next) {
  res.setHeader('Cache-Control', 'no-store');
  const status = creditCheckoutAvailability();
  if (!status.available) return res.status(503).json({ error: status.code, message: status.message });
  next();
}
