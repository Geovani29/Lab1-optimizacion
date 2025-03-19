import React from 'react';
import Exercise1 from '../pages/Exercise1';
import Exercise2 from '../pages/Exercise2';
import Exercise3 from '../pages/Exercise3';
import Exercise4 from '../pages/Exercise4';

interface ExerciseProps {
  selectedExercise: number;
}

const Exercise: React.FC<ExerciseProps> = ({ selectedExercise }: ExerciseProps) => {
  switch (selectedExercise) {
    case 1:
      return <Exercise1 />;
    case 2:
      return <Exercise2 />;
    case 3:
      return <Exercise3 />;
    case 4:
      return <Exercise4 />;
    default:
      return (
        <div>
          <h2>Bienvenido al Laboratorio de Optimización</h2>
          <p>Selecciona un ejercicio del menú para comenzar.</p>
        </div>
      );
  }
};

export default Exercise;
