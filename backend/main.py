from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
import os
import uvicorn
import time

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Ruta para guardar la imagen de la gráfica
graph_path = "region_factible.png"

@app.get("/")
async def root():
    return {"message": "API de optimización funcionando"}

@app.get("/calculate")
def calculate(x: float = Query(...), y: float = Query(...), C: float = Query(10)):
    """Calcula la función de costo y genera la gráfica de la región factible."""
    # Limpiar gráfica anterior si existe
    plt.clf()
    
    # Crear datos para la gráfica
    x_vals = np.linspace(0, 8, 100)
    y_vals = C - x_vals  # Restricción x + y <= C
    y_vals = np.maximum(0, y_vals)  # Asegurar que y no sea negativo

    # Crear la figura
    plt.figure(figsize=(4, 3))
    plt.plot(x_vals, y_vals, label=f'$x + y \\leq {C}$', color='blue', linewidth=1)
    plt.axvline(8, color='red', linestyle='--', label='$x \\leq 8$', linewidth=1)
    plt.axhline(0, color='black', linewidth=0.5)
    plt.axvline(0, color='black', linewidth=0.5)

    # Calcular los vértices del polígono de la región factible
    intersection_x = min(8, C)  # Punto de intersección con x ≤ 8
    intersection_y = max(0, C - 8)  # Punto de intersección con y ≥ 0
    
    # Crear los vértices del polígono
    if C <= 8:
        vertices = [(0, 0), (C, 0), (0, C)]  # Triángulo cuando C ≤ 8
    else:
        vertices = [(0, 0), (8, 0), (8, intersection_y), (0, C)]  # Polígono cuando C > 8

    # Rellenar la región factible
    poligono = Polygon(vertices, color='lightblue', alpha=0.2)
    plt.gca().add_patch(poligono)

    # Si el usuario ingresó un punto, lo marcamos en la gráfica
    if x is not None and y is not None:
        plt.scatter(x, y, color='red', s=30, label=f'({x}, {y})', zorder=3)
        if x >= 0 and y >= 0 and x + y <= C and x <= 8:
            plt.title(f'Costo = {x + 2*y}', pad=2, fontsize=9)
        else:
            plt.title('Punto fuera de la región factible', pad=2, fontsize=9)

    plt.xlim(-0.2, 8.5)
    plt.ylim(-0.2, max(C + 0.5, 10))
    plt.xlabel('$x$', labelpad=2, fontsize=8)
    plt.ylabel('$y$', labelpad=2, fontsize=8)
    plt.legend(loc='upper right', fontsize=6, borderaxespad=0)
    plt.grid(True, alpha=0.2, linewidth=0.5)
    plt.tick_params(axis='both', which='major', labelsize=8)
    
    # Ajustar los márgenes
    plt.tight_layout(pad=0.5)
    
    # Guardar gráfica
    plt.savefig(graph_path, dpi=100, bbox_inches='tight', pad_inches=0.1)
    plt.close()
    
    # Generar timestamp único
    timestamp = int(time.time() * 1000)
    
    # Devolver la URL de la imagen con timestamp y el costo calculado
    return {
        "image_url": f"/{graph_path}?t={timestamp}",
        "cost": x + 2*y if x >= 0 and y >= 0 and x + y <= C and x <= 8 else None
    }

# Endpoint para servir la imagen
@app.get("/{graph_path}")
async def get_image(graph_path: str):
    if graph_path == "favicon.ico":
        return {"message": "No favicon"}
    if not os.path.exists(graph_path):
        return {"error": "Imagen no encontrada"}
    return FileResponse(graph_path)

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 