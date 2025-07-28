import aj from "../config/arcjet.js";

const arjetMiddleware = async (req, res, next) => {
  try {
    const decision = await aj.protect(req, {requested: 1});

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        res.status(429).json({ error: "Rate limit exceeded" });
      }
      if (decision.reason.isBot()) {
        res.status(403).json({ error: "Bot detectado" });
      }
      return res.status(403).json({ error: "Acceso denegado" });
    }

    next();
  } catch (error) {
    console.log(`Arcjet middleware error: ${error}`);
    next(error);
  }
};

export default arjetMiddleware