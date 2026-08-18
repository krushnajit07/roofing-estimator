const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

export async function getEstimatorConfig() {
  const response = await fetch(`${API_BASE_URL}/api/config`);

  if (!response.ok) {
    throw new Error("Failed to load estimator configuration");
  }

  return response.json();
}

export async function submitEstimate(payload) {
  const response = await fetch(`${API_BASE_URL}/api/estimate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to generate estimate");
  }

  return data;
}