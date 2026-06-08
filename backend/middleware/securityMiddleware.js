const stripUnsafeKeys = (value) => {
  if (!value || typeof value !== "object") return value;

  for (const key of Object.keys(value)) {
    if (key.startsWith("$") || key.includes(".")) {
      delete value[key];
      continue;
    }
    stripUnsafeKeys(value[key]);
  }

  return value;
};

export const sanitizeRequest = (req, _res, next) => {
  stripUnsafeKeys(req.body);
  stripUnsafeKeys(req.query);
  stripUnsafeKeys(req.params);
  next();
};
