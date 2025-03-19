import React, { useState } from 'react';

interface Exercise3Props {
}

const Exercise3: React.FC<Exercise3Props> = () => {
  const [result, setResult] = useState<string | null>(null);
  
  return (
    <div className="exercise-container">
      <h2>Ejercicio 3</h2>
      {result && (
        <div className="result-container">
          <img src={result} alt="Resultado" />
        </div>
      )}
    </div>
  );
};

export default Exercise3;
