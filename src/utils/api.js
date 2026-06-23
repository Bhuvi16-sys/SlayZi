// Client API utility for fetching dynamic page configuration
export async function fetchLandingConfig() {
  const response = await fetch('/api/v1/config/landing');
  if (!response.ok) {
    throw new Error(`API error: ${response.status} ${response.statusText}`);
  }
  return response.json();
}
