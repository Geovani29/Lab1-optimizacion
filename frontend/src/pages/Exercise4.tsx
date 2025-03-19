import React, { useState } from 'react';

interface Exercise4Props {
}

const Exercise4: React.FC<Exercise4Props> = () => {
  const [result, setResult] = useState<string | null>(null);
  
  return (
    <div className="exercise-container">
      <h2>Ejercicio 4</h2>
      {result && (
        <div className="result-container">
          <img src={result} alt="Resultado" />
        </div>
      )}
    </div>
  );
};

export default Exercise4;
