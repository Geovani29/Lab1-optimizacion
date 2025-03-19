import React, { useState } from 'react';

interface Exercise2Props {
}

const Exercise2: React.FC<Exercise2Props> = () => {
  const [result, setResult] = useState<string | null>(null);
  
  return (
    <div className="exercise-container">
      <h2>Ejercicio 2</h2>
      {result && (
        <div className="result-container">
          <img src={result} alt="Resultado" />
        </div>
      )}
    </div>
  );
};

export default Exercise2;
