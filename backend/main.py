from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from fastapi.staticfiles import StaticFiles
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
import os
import uvicorn
import time
import sympy
import math
from scipy import sparse as sp

app = FastAPI()

# Configurar CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Crear directorio para imágenes si no existe
if not os.path.exists("static"):
    os.makedirs("static")

# Montar directorio estático
app.mount("/static", StaticFiles(directory="static"), name="static")

# Ruta para guardar la imagen de la gráfica
graph_path = "static/graph.png"

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
        "image_url": f"/static/graph.png?t={timestamp}",
        "cost": x + 2*y if x >= 0 and y >= 0 and x + y <= C and x <= 8 else None
    }

# Endpoint para servir la imagen
@app.get("/static/{graph_path}")
async def get_image(graph_path: str):
    if graph_path == "favicon.ico":
        return {"message": "No favicon"}
    if not os.path.exists(f"static/{graph_path}"):
        return {"error": "Imagen no encontrada"}
    return FileResponse(f"static/{graph_path}")

@app.get("/optimize/gradient")
def optimize_gradient(x0: float = Query(...), alpha: float = Query(0.1), tol: float = Query(1e-6), max_iter: int = Query(50)):
    """Calcula el mínimo usando el método de gradiente descendente."""
    plt.clf()
    
    def f(x):
        return x**2 + 2*x + 1
    
    def df(x):
        return 2*x + 2
    
    x_vals = [x0]
    for _ in range(max_iter):
        grad = df(x_vals[-1])
        x_new = x_vals[-1] - alpha * grad
        x_vals.append(x_new)
        if abs(grad) < tol:
            break
    
    # Graficar resultados
    x = np.linspace(-3, 3, 100)
    y = f(x)
    plt.figure(figsize=(8, 6))
    plt.plot(x, y, label='Función Objetivo')
    plt.scatter(x_vals, [f(x) for x in x_vals], color='red', label='Iteraciones')
    plt.title('Gradiente Descendiente')
    plt.legend()
    plt.grid(True)
    plt.savefig(graph_path, dpi=100, bbox_inches='tight')
    plt.close()
    
    return {
        "image_url": f"/static/graph.png?t={int(time.time() * 1000)}",
        "result": x_vals[-1],
        "iterations": len(x_vals)
    }

@app.get("/optimize/newton")
def optimize_newton(x0: float = Query(...), tol: float = Query(1e-6), max_iter: int = Query(50)):
    """Calcula el mínimo usando el método de Newton."""
    plt.clf()
    
    def f(x):
        return x**2 + 2*x + 1
    
    def df(x):
        return 2*x + 2
    
    def ddf(x):
        return 2
    
    x_vals = [x0]
    for _ in range(max_iter):
        grad = df(x_vals[-1])
        hess = ddf(x_vals[-1])
        if abs(hess) < 1e-6:
            break
        x_new = x_vals[-1] - grad / hess
        x_vals.append(x_new)
        if abs(grad) < tol:
            break
    
    # Graficar resultados
    x = np.linspace(-3, 3, 100)
    y = f(x)
    plt.figure(figsize=(8, 6))
    plt.plot(x, y, label='Función Objetivo')
    plt.scatter(x_vals, [f(x) for x in x_vals], color='red', label='Iteraciones')
    plt.title('Método de Newton')
    plt.legend()
    plt.grid(True)
    plt.savefig(graph_path, dpi=100, bbox_inches='tight')
    plt.close()
    
    return {
        "image_url": f"/static/graph.png?t={int(time.time() * 1000)}",
        "result": x_vals[-1],
        "iterations": len(x_vals)
    }

@app.get("/optimize/golden")
def optimize_golden(a: float = Query(...), b: float = Query(...), tol: float = Query(1e-6), max_iter: int = Query(50)):
    """Calcula el mínimo usando el método de sección dorada."""
    plt.clf()
    
    def f(x):
        return x**2 + 2*x + 1
    
    phi = (np.sqrt(5) - 1) / 2
    x_vals = []
    
    for _ in range(max_iter):
        x1 = a + (1 - phi) * (b - a)
        x2 = a + phi * (b - a)
        x_vals.extend([x1, x2])
        if f(x1) < f(x2):
            b = x2
        else:
            a = x1
        if abs(b - a) < tol:
            break
    
    # Graficar resultados
    x = np.linspace(-3, 3, 100)
    y = f(x)
    plt.figure(figsize=(8, 6))
    plt.plot(x, y, label='Función Objetivo')
    plt.scatter(x_vals, [f(x) for x in x_vals], color='red', label='Iteraciones')
    plt.title('Sección Dorada')
    plt.legend()
    plt.grid(True)
    plt.savefig(graph_path, dpi=100, bbox_inches='tight')
    plt.close()
    
    return {
        "image_url": f"/static/graph.png?t={int(time.time() * 1000)}",
        "result": (a + b) / 2,
        "iterations": len(x_vals)
    }

def f1():
    x = sympy.symbols('x')
    return math.e ** x

def f2():
    x = sympy.symbols('x')
    return 1 / x

def f3():
    x = sympy.symbols('x')
    return sympy.log(x)

def f4():
    x = sympy.symbols('x')
    return x ** -2

def f5():
    x = sympy.symbols('x')
    return sympy.sin(x)

def punto_3(a, itter, fx_n):
    x = sympy.symbols('x')
    X = np.linspace(a - 2, a + 2, num=101)
    fx = [f1(),f2(),f3(),f4(),f5()][fx_n]

    # Funcion de taylor
    def taylor(x0):
        sum = 0
        for i in range(itter + 1):
            sum += fx.diff(x,i).subs(x,a) * (x0 - a) ** i / math.factorial(i)
        return sum

    # Hallar las y para la grafica
    Yoriginal = sympy.utilities.lambdify(x,fx,'numpy')(X)
    Ytaylor = taylor(X)

    # Preparacion de la grafica
    graph = plt
    graph.plot(X, Yoriginal, label="Original")
    graph.plot(X, Ytaylor, label="Taylor")
    graph.legend()

    return graph

@app.get("/taylor")
def calculate_taylor(a: float = Query(...), itter: int = Query(...), fx_n: int = Query(...)):
    """Calcula la serie de Taylor y genera la gráfica comparativa."""
    if not (0 <= fx_n <= 4):
        return {"error": "fx_n debe estar entre 0 y 4"}
    if itter < 0:
        return {"error": "itter debe ser no negativo"}
    
    try:
        plt.clf()  # Limpiar figura anterior
        graph = punto_3(a, itter, fx_n)
        
        # Guardar gráfica
        os.makedirs("static", exist_ok=True)  # Asegurar que el directorio existe
        graph.savefig("static/graph.png", dpi=100, bbox_inches='tight', pad_inches=0.1)
        plt.close()
        
        # Generar timestamp único
        timestamp = int(time.time() * 1000)
        
        return {
            "image_url": f"/static/graph.png?t={timestamp}"
        }
    except Exception as e:
        print(f"Error al generar la gráfica: {str(e)}")
        return {"error": f"Error al generar la gráfica: {str(e)}"}

# Funciones para matrices dispersas
def generar_matriz_dispersa(filas, columnas, densidad=0.1, rango_valores=(0, 1)):
    """Genera una matriz dispersa aleatoria en formato denso."""
    matriz = np.zeros((filas, columnas))
    num_elementos = int(filas * columnas * densidad)
    filas_idx = np.random.randint(0, filas, num_elementos)
    columnas_idx = np.random.randint(0, columnas, num_elementos)
    valores = np.random.randint(rango_valores[0], rango_valores[1] + 1, num_elementos)
    matriz[filas_idx, columnas_idx] = valores
    return matriz

def convertir_a_coo_manual(matriz):
    """Convierte una matriz densa a formato COO manualmente."""
    time_start = time.time()
    filas, columnas = matriz.shape
    row, col, data = [], [], []
    for i in range(filas):
        for j in range(columnas):
            if matriz[i, j] != 0:
                row.append(i)
                col.append(j)
                data.append(matriz[i, j])
    time_end = time.time()
    return time_end - time_start

def convertir_a_coo_scipy(matriz):
    """Convierte una matriz densa a formato COO con Scipy."""
    time_start = time.time()
    sp.coo_matrix(matriz)
    time_end = time.time()
    return time_end - time_start

def convertir_matriz(matriz, formato):
    """Convierte una matriz densa a un formato disperso especificado."""
    if formato == 'csr':
        return sp.csr_matrix(matriz)
    elif formato == 'csc':
        return sp.csc_matrix(matriz)
    elif formato == 'lil':
        return sp.lil_matrix(matriz)
    else:
        return sp.coo_matrix(matriz)

@app.get("/sparse/compare")
def compare_sparse_conversion(filas: int = Query(...), columnas: int = Query(...), densidad: float = Query(...)):
    """Compara los tiempos de conversión a formato COO."""
    if not (0 < densidad <= 1):
        return {"error": "La densidad debe estar entre 0 y 1"}
    
    matriz = generar_matriz_dispersa(filas, columnas, densidad)
    time_manual = convertir_a_coo_manual(matriz)
    time_scipy = convertir_a_coo_scipy(matriz)
    
    return {
        "time_manual": time_manual,
        "time_scipy": time_scipy
    }

@app.get("/sparse/operate")
def operate_sparse_matrices(
    filas: int = Query(...),
    columnas: int = Query(...),
    densidad: float = Query(...),
    formato: str = Query(...),
    operacion: str = Query(...)
):
    """Realiza operaciones entre matrices dispersas."""
    if not (0 < densidad <= 1):
        return {"error": "La densidad debe estar entre 0 y 1"}
    
    # Generar matrices
    if operacion == "suma":
        # Para suma, ambas matrices deben tener las mismas dimensiones
        matriz1 = generar_matriz_dispersa(filas, columnas, densidad)
        matriz2 = generar_matriz_dispersa(filas, columnas, densidad)
    else:  # multiplicación
        # Para multiplicación, el número de columnas de matriz1 debe ser igual al número de filas de matriz2
        matriz1 = generar_matriz_dispersa(filas, columnas, densidad)  # matriz1 será de filas×columnas
        matriz2 = generar_matriz_dispersa(columnas, filas, densidad)  # matriz2 será de columnas×filas
    
    # Convertir a formato disperso
    matriz1_dispersa = convertir_matriz(matriz1, formato)
    matriz2_dispersa = convertir_matriz(matriz2, formato)
    
    # Realizar operación y medir tiempo
    inicio = time.time()
    try:
        if operacion == "suma":
            resultado = matriz1_dispersa + matriz2_dispersa
        else:  # multiplicación
            resultado = matriz1_dispersa @ matriz2_dispersa
        fin = time.time()
        tiempo_total = fin - inicio
        resultado_array = resultado.toarray().tolist()
        
        return {
            "tiempo": tiempo_total,
            "resultado": resultado_array,
            "dimensiones": {
                "matriz1": matriz1.shape,
                "matriz2": matriz2.shape,
                "resultado": resultado.shape
            }
        }
    except Exception as e:
        return {"error": f"Error al realizar la operación: {str(e)}"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000) 