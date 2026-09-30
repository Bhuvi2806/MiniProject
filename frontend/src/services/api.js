const API_URL = 'http://localhost:5000/api';

export const loginUser = async (email, password) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }
  return response.json();
};

export const fetchRequests = async () => {
  const response = await fetch(`${API_URL}/requests`);
  if (!response.ok) throw new Error('Failed to fetch requests');
  return response.json();
};

export const fetchDonors = async (bloodGroup) => {
  // Hardcoded coordinates for Kanpur Metro center
  let url = `${API_URL}/donors/search?lng=80.3319&lat=26.4499`;
  if (bloodGroup && bloodGroup !== 'ALL') {
    url += `&bloodGroup=${encodeURIComponent(bloodGroup)}`;
  }
  
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch donors');
  return response.json();
};

export const broadcastAlert = async (emails, hospitalName, bloodGroup, unitsNeeded) => {
  const response = await fetch(`${API_URL}/notifications/broadcast`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ emails, hospitalName, bloodGroup, unitsNeeded })
  });
  if (!response.ok) throw new Error('Broadcast failed');
  return response.json();
};

/**
 * Run the rule-based donor matching engine on the backend.
 * Future Scope: backend will swap matchingService for LLM agent when
 * AGENT.md tech stack is updated. This call signature stays the same.
 */
export const matchDonors = async ({ hospital, request, radius_km = 25 }) => {
  const response = await fetch(`${API_URL}/match`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ hospital, request, radius_km })
  });
  if (!response.ok) throw new Error('Matching engine request failed');
  return response.json();
};

export const sendChatMessage = async (messages) => {
  const response = await fetch(`${API_URL}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ messages })
  });
  if (!response.ok) throw new Error('Chat request failed');
  return response.json();
};
