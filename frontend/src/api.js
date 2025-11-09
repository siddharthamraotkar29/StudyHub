// frontend/src/api.js
const API_BASE = process.env.REACT_APP_API_BASE || "https://studyhub-backend.onrender.com";

// Example public API call
export async function getPublicData() {
  try {
    const res = await fetch(`${API_BASE}/api/public`);
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching from backend:", err);
    return { success: false, message: "Backend unreachable" };
  }
}

// Example protected API call (if you add tokens later)
export async function getProtectedData(token) {
  try {
    const res = await fetch(`${API_BASE}/api/protected`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return await res.json();
  } catch (err) {
    console.error("❌ Error fetching protected data:", err);
    return { success: false };
  }
}
