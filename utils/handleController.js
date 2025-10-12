export function handleController(res, result, successStatus = 200) {
  if (!result.success) {
    res.status(result.error.status).json({ error: result.error.message });
  }
  res.status(successStatus).json(result);
}
