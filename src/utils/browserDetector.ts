export const getBrowserName = (): string => {
  const userAgent = navigator.userAgent;

  if (
    userAgent.includes("Chrome") &&
    !userAgent.includes("Edg") &&
    !userAgent.includes("OPR")
  ) {
    return "Chrome";
  }
  if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
    return "Safari";
  }
  if (userAgent.includes("Firefox")) {
    return "Firefox";
  }
  if (userAgent.includes("Edg")) {
    return "Edge";
  }
  if (userAgent.includes("OPR") || userAgent.includes("Opera")) {
    return "Opera";
  }

  return "Unknown";
};
