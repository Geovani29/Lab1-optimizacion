export const loadTextContent = async (exerciseNumber: number): Promise<string> => {
  try {
    const response = await fetch(`/data/exercise${exerciseNumber}.txt`);
    if (!response.ok) {
      throw new Error('No se pudo cargar el contenido');
    }
    return await response.text();
  } catch (error) {
    console.error('Error al cargar el contenido:', error);
    return 'No se pudo cargar la descripción del ejercicio.';
  }
};
