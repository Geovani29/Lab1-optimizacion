import React, { useState } from 'react';
import Exercise from './components/Exercise';
import Sidebar from './components/Sidebar';

const App: React.FC = () => {
  const [selectedExercise, setSelectedExercise] = useState<number>(0);

  return (
    <div className="app-container">
      <Sidebar setSelectedExercise={setSelectedExercise} />
      <main className="main-content">
        <Exercise 
          selectedExercise={selectedExercise} 
          setSelectedExercise={setSelectedExercise}
        />
      </main>
    </div>
  );
};

export default App;
