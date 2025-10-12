export async function handleService(fn) {
  try {
    const result = await fn();
    return { success: true, data: result };
  } catch (error) {
    console.error(error);
    return {
      success: false,
      error: {
        status: error.status || 500,
        message: error.message || "Internal server error",
      },
    };
  }
}
