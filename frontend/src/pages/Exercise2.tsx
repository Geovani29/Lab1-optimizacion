import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Exercise2: React.FC = () => {
  const [filas, setFilas] = useState<string>('5');
  const [columnas, setColumnas] = useState<string>('5');
  const [densidad, setDensidad] = useState<string>('0.5');
  const [formato, setFormato] = useState<string>('coo');
  const [operacion, setOperacion] = useState<string>('suma');
  const [loadingCompare, setLoadingCompare] = useState(false);
  const [loadingOperate, setLoadingOperate] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Resultados
  const [comparacionTiempos, setComparacionTiempos] = useState<{
    time_manual: number;
    time_scipy: number;
  } | null>(null);
  
  const [resultadoOperacion, setResultadoOperacion] = useState<{
    tiempo: number;
    resultado: number[][];
    dimensiones?: {
      matriz1: [number, number];
      matriz2: [number, number];
      resultado: [number, number];
    };
  } | null>(null);

  useEffect(() => {
    // loadTextContent(2).then(content => {
    //   setProblemDescription(content);
    // });
  }, []);

  const formatos = [
    { value: 'coo', label: 'Listas coordinadas (COO)' },
    { value: 'csr', label: 'Filas comprimidas (CSR)' },
    { value: 'csc', label: 'Columnas comprimidas (CSC)' },
    { value: 'lil', label: 'Listas enlazadas por filas (LIL)' }
  ];

  const handleCompare = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingCompare(true);

    try {
      const response = await axios.get('http://localhost:8000/sparse/compare', {
        params: {
          filas: parseInt(filas),
          columnas: parseInt(columnas),
          densidad: parseFloat(densidad)
        }
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setComparacionTiempos(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al comparar tiempos de conversión');
    } finally {
      setLoadingCompare(false);
    }
  };

  const handleOperate = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoadingOperate(true);

    try {
      const response = await axios.get('http://localhost:8000/sparse/operate', {
        params: {
          filas: parseInt(filas),
          columnas: parseInt(columnas),
          densidad: parseFloat(densidad),
          formato,
          operacion
        }
      });

      if (response.data.error) {
        setError(response.data.error);
      } else {
        setResultadoOperacion(response.data);
      }
    } catch (err) {
      console.error('Error:', err);
      setError('Error al realizar la operación');
    } finally {
      setLoadingOperate(false);
    }
  };

  return (
    <div className="exercise-container">
      <h2>Ejercicio 2: Matrices Dispersas</h2>

      <div className="sections-container" style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '30px',
        width: '100%',
        maxWidth: '800px',
        margin: '20px auto'
      }}>
        <div className="section" style={{
          padding: '25px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Parte 1: Comparación de Tiempos de Conversión</h3>
          <form onSubmit={handleCompare}>
            <div className="input-group" style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'space-between'
            }}>
              <label htmlFor="filas1" style={{ fontWeight: '500', minWidth: '120px' }}>Filas:</label>
              <input
                type="number"
                id="filas1"
                value={filas}
                onChange={(e) => setFilas(e.target.value)}
                required
                min="1"
                disabled={loadingCompare}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '150px'
                }}
              />
            </div>

            <div className="input-group" style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'space-between'
            }}>
              <label htmlFor="columnas1" style={{ fontWeight: '500', minWidth: '120px' }}>Columnas:</label>
              <input
                type="number"
                id="columnas1"
                value={columnas}
                onChange={(e) => setColumnas(e.target.value)}
                required
                min="1"
                disabled={loadingCompare}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '150px'
                }}
              />
            </div>

            <div className="input-group" style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'space-between'
            }}>
              <label htmlFor="densidad1" style={{ fontWeight: '500', minWidth: '120px' }}>Densidad (0-1):</label>
              <input
                type="number"
                id="densidad1"
                value={densidad}
                onChange={(e) => setDensidad(e.target.value)}
                required
                step="0.1"
                min="0"
                max="1"
                disabled={loadingCompare}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '150px'
                }}
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                type="submit" 
                disabled={loadingCompare}
                style={{
                  backgroundColor: '#284b8c',
                  color: 'white',
                  padding: '12px 15px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loadingCompare ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  width: '100%',
                  maxWidth: '400px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(40, 75, 140, 0.1)',
                  opacity: loadingCompare ? '0.7' : '1'
                }}
              >
                {loadingCompare ? 'Comparando...' : 'Comparar Tiempos'}
              </button>
            </div>
          </form>

          {comparacionTiempos && (
            <div className="result-container" style={{
              marginTop: '20px',
              padding: '15px',
              backgroundColor: '#f8f9fa',
              borderRadius: '4px',
              border: '1px solid #eee'
            }}>
              <h4 style={{ marginBottom: '10px' }}>Resultados:</h4>
              <p>Tiempo de conversión manual: {comparacionTiempos.time_manual.toFixed(6)} segundos</p>
              <p>Tiempo de conversión SciPy: {comparacionTiempos.time_scipy.toFixed(6)} segundos</p>
            </div>
          )}
        </div>

        <div className="section" style={{
          padding: '25px',
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#fff',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ marginBottom: '20px', textAlign: 'center' }}>Parte 2: Operaciones con Matrices Dispersas</h3>
          <form onSubmit={handleOperate}>
            <div className="input-group" style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'space-between'
            }}>
              <label htmlFor="formato" style={{ fontWeight: '500', minWidth: '120px' }}>Formato:</label>
              <select
                id="formato"
                value={formato}
                onChange={(e) => setFormato(e.target.value)}
                required
                disabled={loadingOperate}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '210px',
                  backgroundColor: 'white'
                }}
              >
                {formatos.map(f => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="input-group" style={{
              marginBottom: '15px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '10px',
              justifyContent: 'space-between'
            }}>
              <label htmlFor="operacion" style={{ fontWeight: '500', minWidth: '120px' }}>Operación:</label>
              <select
                id="operacion"
                value={operacion}
                onChange={(e) => setOperacion(e.target.value)}
                required
                disabled={loadingOperate}
                style={{
                  padding: '8px 12px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  width: '150px',
                  backgroundColor: 'white'
                }}
              >
                <option value="suma">Suma</option>
                <option value="multiplicacion">Multiplicación</option>
              </select>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              <button 
                type="submit" 
                disabled={loadingOperate}
                style={{
                  backgroundColor: '#284b8c',
                  color: 'white',
                  padding: '12px 15px',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: loadingOperate ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  fontWeight: '500',
                  width: '100%',
                  maxWidth: '400px',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(40, 75, 140, 0.1)',
                  opacity: loadingOperate ? '0.7' : '1'
                }}
              >
                {loadingOperate ? 'Calculando...' : 'Realizar Operación'}
              </button>
            </div>
          </form>

          {resultadoOperacion && (
            <div className="result-container">
              <h4>Resultados:</h4>
              <p>Tiempo de ejecución: {resultadoOperacion.tiempo.toFixed(6)} segundos</p>
              {resultadoOperacion.dimensiones && (
                <div className="dimensions-info" style={{ marginBottom: '10px', fontSize: '0.9em' }}>
                  <p>Dimensiones:</p>
                  <ul style={{ margin: '5px 0', paddingLeft: '20px' }}>
                    <li>Matriz 1: {resultadoOperacion.dimensiones.matriz1[0]}×{resultadoOperacion.dimensiones.matriz1[1]}</li>
                    <li>Matriz 2: {resultadoOperacion.dimensiones.matriz2[0]}×{resultadoOperacion.dimensiones.matriz2[1]}</li>
                    <li>Resultado: {resultadoOperacion.dimensiones.resultado[0]}×{resultadoOperacion.dimensiones.resultado[1]}</li>
                  </ul>
                </div>
              )}
              <div className="matrix-result" style={{
                overflowX: 'auto',
                padding: '20px',
                border: '1px solid #eee',
                borderRadius: '4px',
                backgroundColor: '#f8f9fa',
                marginTop: '10px',
                maxWidth: '100%'
              }}>
                <h5>Matriz Resultante:</h5>
                <div className="matrix-display" style={{
                  display: 'table',
                  borderSpacing: '12px',
                  margin: '15px 0'
                }}>
                  {resultadoOperacion.resultado.map((row, i) => (
                    <div key={i} className="matrix-row" style={{
                      display: 'table-row'
                    }}>
                      {row.map((val, j) => (
                        <span key={j} className="matrix-cell" style={{
                          display: 'table-cell',
                          padding: '8px 16px',
                          border: '1px solid #ddd',
                          borderRadius: '4px',
                          backgroundColor: 'white',
                          textAlign: 'center',
                          minWidth: '65px',
                          fontSize: '1.1em'
                        }}>
                          {val.toFixed(2)}
                        </span>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {error && (
        <div className="error" style={{
          color: '#dc3545',
          marginTop: '10px',
          padding: '10px',
          borderRadius: '4px',
          backgroundColor: '#f8d7da'
        }}>
          {error}
        </div>
      )}
    </div>
  );
};

export default Exercise2;
