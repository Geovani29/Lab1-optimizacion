import React from 'react'
import Exercise from './components/Exercise'
import Sidebar from './components/Sidebar'
import './App.css'

const App: React.FC = () => {
    const [selectedExercise, setSelectedExercise] = React.useState<number>(0)

    return (
        <div className="app-container">
            <Sidebar setSelectedExercise={setSelectedExercise} />
            <main className="main-content">
                <Exercise selectedExercise={selectedExercise} />
            </main>
        </div>
    )
}

export default App
