import React from 'react';
import Exercise1 from '../pages/Exercise1';
import Exercise2 from '../pages/Exercise2';
import Exercise3 from '../pages/Exercise3';
import Exercise4 from '../pages/Exercise4';

interface ExerciseProps {
  selectedExercise: number;
}

const Exercise: React.FC<ExerciseProps> = ({ selectedExercise }) => {
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
      return <div>Por favor selecciona un ejercicio del menú.</div>;
  }
};

export default Exercise;
