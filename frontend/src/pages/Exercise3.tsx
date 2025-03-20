import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exercise3: React.FC = () => {
  const [a, setA] = useState<string>('0');
  const [itter, setItter] = useState<string>('3');
  const [selectedFunction, setSelectedFunction] = useState<string>('0');
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // loadTextContent(3).then(content => {
    //   setProblemDescription(content);
    // });
  }, []);

  const functions = [
    'e^x',
    '1/x',
    'ln(x)',
    'x^(-2)',
    'sin(x)'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get('http://localhost:8000/taylor', {
        params: {
          a: parseFloat(a),
          itter: parseInt(itter),
          fx_n: parseInt(selectedFunction)
        }
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResult(`http://localhost:8000${response.data.image_url}`);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al calcular la serie de Taylor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="exercise-container">
      <h2>Ejercicio 3: Series de Taylor</h2>

      <form onSubmit={handleSubmit}>
        <div className="input-group">
          <label htmlFor="a">Punto de expansión (a):</label>
          <input
            type="number"
            id="a"
            value={a}
            onChange={(e) => setA(e.target.value)}
            required
            step="any"
          />
        </div>

        <div className="input-group">
          <label htmlFor="itter">Número de términos:</label>
          <input
            type="number"
            id="itter"
            value={itter}
            onChange={(e) => setItter(e.target.value)}
            required
            min="0"
            step="1"
          />
        </div>

        <div className="input-group">
          <label htmlFor="function">Función:</label>
          <select
            id="function"
            value={selectedFunction}
            onChange={(e) => setSelectedFunction(e.target.value)}
            required
            style={{
              width: '100%',
              padding: '12px 15px',
              border: '2px solid #e0e7ff',
              borderRadius: '8px',
              fontSize: '1rem',
              backgroundColor: '#f8faff',
              color: '#284b8c',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              appearance: 'none',
              backgroundImage: 'url("data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22292.4%22%20height%3D%22292.4%22%3E%3Cpath%20fill%3D%22%23284b8c%22%20d%3D%22M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.4-12.8z%22%2F%3E%3C%2Fsvg%3E")',
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 15px top 50%',
              backgroundSize: '12px auto'
            }}
          >
            {functions.map((func, index) => (
              <option 
                key={index} 
                value={index}
                style={{
                  padding: '8px',
                  fontSize: '1rem',
                  color: '#284b8c'
                }}
              >
                f(x) = {func}
              </option>
            ))}
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Calculando...' : 'Calcular'}
        </button>
      </form>

      {error && <div className="error">{error}</div>}
      
      {result && (
        <div className="result-container">
          <img src={result} alt="Gráfica de Taylor" style={{ maxWidth: '100%', marginTop: '20px' }} />
        </div>
      )}
    </div>
  );
};

export default Exercise3;