const BASE_URL = "http://localhost:3001";

const parseResponseBody = async (res) => {
  const text = await res.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch {
    throw new Error("Invalid server response");
  }
};

const handleResponse = async (res) => {
  const data = await parseResponseBody(res);

  if (!res.ok) {
    throw new Error(data?.message || `Request failed with status ${res.status}`);
  }

  return data;
};

export const api = {
  get: (endpoint) => fetch(`${BASE_URL}/${endpoint}`).then(handleResponse),

  post: (endpoint, data) =>
    fetch(`${BASE_URL}/${endpoint}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    }).then(handleResponse),
};