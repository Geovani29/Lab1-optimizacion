import React, { useState, useEffect } from 'react';
import axios from 'axios';
import InfoButton from '../components/InfoButton';
import { loadTextContent } from '../utils/loadTextContent';

interface OptimizationResult {
  image_url: string;
  result: number;
  iterations: number;
}

const Exercise4: React.FC = () => {
  const [selectedMethod, setSelectedMethod] = useState<string>('');
  const [result, setResult] = useState<OptimizationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [problemDescription, setProblemDescription] = useState('Cargando descripción...');

  useEffect(() => {
    loadTextContent(4).then(content => {
      setProblemDescription(content);
    });
  }, []);

  // Parámetros para cada método
  const [gradientParams, setGradientParams] = useState({
    x0: -3,
    alpha: 0.1,
    tol: 1e-6,
    max_iter: 50
  });

  const [newtonParams, setNewtonParams] = useState({
    x0: -3,
    tol: 1e-6,
    max_iter: 50
  });

  const [goldenParams, setGoldenParams] = useState({
    a: -3,
    b: 3,
    tol: 1e-6,
    max_iter: 50
  });

  const handleOptimize = async () => {
    setLoading(true);
    setError('');
    try {
      let response: { data: OptimizationResult } | undefined;
      switch (selectedMethod) {
        case 'gradient':
          response = await axios.get('http://localhost:8000/optimize/gradient', {
            params: gradientParams
          });
          break;
        case 'newton':
          response = await axios.get('http://localhost:8000/optimize/newton', {
            params: newtonParams
          });
          break;
        case 'golden':
          response = await axios.get('http://localhost:8000/optimize/golden', {
            params: goldenParams
          });
          break;
      }
      if (response) {
        setResult(response.data);
      }
    } catch (err) {
      setError('Error al calcular la optimización');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-container">
      <h2>Ejercicio 4: Métodos de Optimización</h2>
      <InfoButton content={problemDescription} />
      
      <div className="method-selection">
        <h3>Selecciona un método de optimización:</h3>
        <select 
          value={selectedMethod} 
          onChange={(e) => setSelectedMethod(e.target.value)}
        >
          <option value="">Selecciona un método...</option>
          <option value="gradient">Gradiente Descendiente</option>
          <option value="newton">Método de Newton</option>
          <option value="golden">Sección Dorada</option>
        </select>
      </div>

      {selectedMethod && (
        <div className="parameters-section">
          <h3>Parámetros del método:</h3>
          
          {selectedMethod === 'gradient' && (
            <div className="parameter-group">
              <div>
                <label>Punto inicial (x₀):</label>
                <input
                  type="number"
                  value={gradientParams.x0}
                  onChange={(e) => setGradientParams({...gradientParams, x0: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Tasa de aprendizaje (α):</label>
                <input
                  type="number"
                  value={gradientParams.alpha}
                  onChange={(e) => setGradientParams({...gradientParams, alpha: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Tolerancia:</label>
                <input
                  type="number"
                  value={gradientParams.tol}
                  onChange={(e) => setGradientParams({...gradientParams, tol: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Máximo de iteraciones:</label>
                <input
                  type="number"
                  value={gradientParams.max_iter}
                  onChange={(e) => setGradientParams({...gradientParams, max_iter: parseInt(e.target.value)})}
                />
              </div>
            </div>
          )}

          {selectedMethod === 'newton' && (
            <div className="parameter-group">
              <div>
                <label>Punto inicial (x₀):</label>
                <input
                  type="number"
                  value={newtonParams.x0}
                  onChange={(e) => setNewtonParams({...newtonParams, x0: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Tolerancia:</label>
                <input
                  type="number"
                  value={newtonParams.tol}
                  onChange={(e) => setNewtonParams({...newtonParams, tol: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Máximo de iteraciones:</label>
                <input
                  type="number"
                  value={newtonParams.max_iter}
                  onChange={(e) => setNewtonParams({...newtonParams, max_iter: parseInt(e.target.value)})}
                />
              </div>
            </div>
          )}

          {selectedMethod === 'golden' && (
            <div className="parameter-group">
              <div>
                <label>Límite inferior (a):</label>
                <input
                  type="number"
                  value={goldenParams.a}
                  onChange={(e) => setGoldenParams({...goldenParams, a: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Límite superior (b):</label>
                <input
                  type="number"
                  value={goldenParams.b}
                  onChange={(e) => setGoldenParams({...goldenParams, b: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Tolerancia:</label>
                <input
                  type="number"
                  value={goldenParams.tol}
                  onChange={(e) => setGoldenParams({...goldenParams, tol: parseFloat(e.target.value)})}
                />
              </div>
              <div>
                <label>Máximo de iteraciones:</label>
                <input
                  type="number"
                  value={goldenParams.max_iter}
                  onChange={(e) => setGoldenParams({...goldenParams, max_iter: parseInt(e.target.value)})}
                />
              </div>
            </div>
          )}

          <button onClick={handleOptimize} disabled={loading}>
            {loading ? 'Calculando...' : 'Calcular'}
          </button>
        </div>
      )}

      {error && <div className="error">{error}</div>}

      {result && (
        <div className="results-section">
          <h3>Resultados:</h3>
          <div className="graph-container">
            <img 
              src={`http://localhost:8000${result.image_url}`} 
              alt="Gráfica de optimización"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Exercise4;