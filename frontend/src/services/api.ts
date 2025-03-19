const API_URL = "http://localhost:8000";

export const calculateExercise1 = async (x: number, y: number, C: number) => {
  const response = await fetch(`${API_URL}/calculate?x=${x}&y=${y}&C=${C}`);
  return response.json();
};

export const getGraph = () => {
  return `${API_URL}/graph`;
};
