const WINDOW_MS = 15 * 60 * 1000;
const MAX_SUBMISSIONS = 5;
const submissionWindows = new Map();

const limitPublicMessageSubmissions = (req, res, next) => {
  const now = Date.now();
  const key = req.ip || req.socket.remoteAddress || 'unknown';
  let window = submissionWindows.get(key);

  if (!window || window.expiresAt <= now) {
    window = { count: 0, expiresAt: now + WINDOW_MS };
    submissionWindows.set(key, window);
  }

  if (window.count >= MAX_SUBMISSIONS) {
    return res.status(429).json({
      message: 'Too many messages have been submitted. Please try again later.',
    });
  }

  window.count += 1;

  if (submissionWindows.size > 1000) {
    for (const [address, entry] of submissionWindows) {
      if (entry.expiresAt <= now) submissionWindows.delete(address);
    }
  }

  return next();
};

module.exports = { limitPublicMessageSubmissions };
