export const loadTextContent = async (exerciseNumber: number): Promise<string> => {
  try {
    const response = await fetch(`/src/data/exercise${exerciseNumber}.txt`);
    if (!response.ok) {
      throw new Error(`Error loading exercise ${exerciseNumber} content`);
    }
    return await response.text();
  } catch (error) {
    console.error('Error loading text content:', error);
    return 'Error cargando la descripción del ejercicio.';
  }
};
