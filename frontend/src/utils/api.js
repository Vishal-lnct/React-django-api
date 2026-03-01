const BASE_URL = "http://127.0.0.1:8000/api";

export const getCategories = async () => {
  const res = await fetch(`${BASE_URL}/categories/`);
  return res.json();
};