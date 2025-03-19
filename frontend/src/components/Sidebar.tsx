import React from 'react'

interface SidebarProps {
    setSelectedExercise: (exercise: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ setSelectedExercise }) => {
    return (
        <aside className="sidebar">
            <h1>Optimización</h1>
            <nav>
                <ul>
                    <li>
                        <a href="#instrucciones">Instrucciones</a>
                    </li>
                    <li>
                        <button onClick={() => setSelectedExercise(1)}>Ejercicio 1</button>
                    </li>
                    <li>
                        <button onClick={() => setSelectedExercise(2)}>Ejercicio 2</button>
                    </li>
                    <li>
                        <button onClick={() => setSelectedExercise(3)}>Ejercicio 3</button>
                    </li>
                    <li>
                        <button onClick={() => setSelectedExercise(4)}>Ejercicio 4</button>
                    </li>
                </ul>
            </nav>
        </aside>
    )
}

export default Sidebar
