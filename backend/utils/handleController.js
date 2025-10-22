export function handleController(res, result, successStatus = 200) {
  if (!result || typeof result !== "object") {
    return res
      .status(500)
      .json({
        success: false,
        error: { status: 500, message: "Invalid result object" },
      });
  }

  if (!result.success) {
    const status = result.error?.status || 400;
    const message = result.error?.message || "An error occurred";
    return res
      .status(status)
      .json({ success: false, error: { status, message } });
  }

  return res
    .status(successStatus)
    .json({ success: true, data: result.data ?? null });
}
