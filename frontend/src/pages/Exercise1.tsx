import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoButton from '../components/InfoButton';
import { loadTextContent } from '../utils/loadTextContent';

const Exercise1: React.FC = () => {
  const [x, setX] = useState('');
  const [y, setY] = useState('');
  const [C, setC] = useState('10');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [cost, setCost] = useState<number | null>(null);
  const [outOfBounds, setOutOfBounds] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [problemDescription, setProblemDescription] = useState('Cargando descripción...');

  useEffect(() => {
    loadTextContent(1).then(content => {
      setProblemDescription(content);
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setOutOfBounds(null);
    setLoading(true);
    setCost(null);
    setResult(null);
    
    const xVal = parseFloat(x);
    const yVal = parseFloat(y);
    const CVal = parseFloat(C);

    // Verificar restricciones
    if (xVal < 0 || yVal < 0) {
      setOutOfBounds('El punto no cumple con x ≥ 0, y ≥ 0. Se encuentra fuera de la región factible.');
    } else if (xVal > 8) {
      setOutOfBounds('El punto no cumple con x ≤ 8. Se encuentra fuera de la región factible.');
    } else if (xVal + yVal > CVal) {
      setOutOfBounds(`El punto no cumple con x + y ≤ ${CVal}. Se encuentra fuera de la región factible.`);
    }
    
    try {
      const response = await axios.get(`http://localhost:8000/calculate`, {
        params: {
          x: xVal,
          y: yVal,
          C: CVal,
        },
      });
      
      const imageUrl = `http://localhost:8000${response.data.image_url}`;
      setResult(imageUrl);
      if (response.data.cost !== null) {
        setCost(response.data.cost);
      }
    } catch (error) {
      console.error('Error:', error);
      setError('Error al calcular. Asegúrate de que el servidor backend esté corriendo en http://localhost:8000');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-container">
      <h2>Ejercicio 1: Optimización Lineal Básica</h2>
      <InfoButton content={problemDescription} />
      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="x">Valor de X:</label>
          <input
            type="number"
            id="x"
            value={x}
            onChange={(e) => setX(e.target.value)}
            required
            step="any"
          />
        </div>
        <div className="input-group">
          <label htmlFor="y">Valor de Y:</label>
          <input
            type="number"
            id="y"
            value={y}
            onChange={(e) => setY(e.target.value)}
            required
            step="any"
          />
        </div>
        <div className="input-group">
          <label htmlFor="C">Valor de C:</label>
          <input
            type="number"
            id="C"
            value={C}
            onChange={(e) => setC(e.target.value)}
            step="any"
          />
        </div>
        <button type="submit" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>
      {error && <div className="error-message">{error}</div>}
      {outOfBounds && <div className="warning-message">{outOfBounds}</div>}
      {cost !== null && (
        <div className="cost-display">
          <p>Costo calculado: {cost.toFixed(2)}</p>
        </div>
      )}
      {result && (
        <div className="result-container">
          <img src={result} alt="Región factible" />
        </div>
      )}
    </div>
  );
};

export default Exercise1;
