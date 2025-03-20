import React from 'react'
import '../styles/sidebar.css'

interface SidebarProps {
    setSelectedExercise: (exercise: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedExercise }) => {
    return (
        <aside className="sidebar">
            <h1 style={{ cursor: 'pointer' }} onClick={() => setSelectedExercise(0)}>Optimización</h1>
            <nav>
                <ul>
                    <li>
                        <button 
                            onClick={() => setSelectedExercise(1)}
                            className="exercise-button"
                        >Problema de optimización</button>
                    </li>
                    <li>
                        <button 
                            onClick={() => setSelectedExercise(2)}
                            className="exercise-button"
                        >Matrices Sparses</button>
                    </li>
                    <li>
                        <button 
                            onClick={() => setSelectedExercise(3)}
                            className="exercise-button"
                        >Series de Taylor</button>
                    </li>
                    <li>
                        <button 
                            onClick={() => setSelectedExercise(4)}
                            className="exercise-button"
                        >Métodos de optimización</button>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
