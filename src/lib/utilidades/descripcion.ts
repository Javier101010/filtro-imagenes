export let explicacion_media = {
    "filtro": "Filtro de media",
    "descripcion1": "El filtro de media suaviza la imagen usando una mascara de 3x3 de 1/9 en cada posición,"+
                " lo que ayuda a reducir el ruido. Sin embargo, puede hacer que la imagen se vea borrosa. "+
                "La matriz 3x3 que opera a la matriz de la imagen es:",
    "proceso": `| 1/9  1/9  1/9 |
                | 1/9  1/9  1/9 |
                | 1/9  1/9  1/9 |
                
                Y la matriz de la imagen es la siguiente:`,
    "matriz1": ``,
    "descripcion2": "Despues de aplicar la mascara de 3x3, la matriz resultante es:",
    "matriz2": "",}

export let explicacion_mediana = {
    "filtro": "Filtro de mediana",
    "descripcion1": "El filtro de mediana reemplaza cada píxel con la mediana de los píxeles vecinos, lo "+
                "que ayuda a eliminar el ruido. Es especialmente efectivo para eliminar el ruido de sal y pimienta. "+
                "El proceso es el siguiente: ",
    "proceso": `n, n+1, n+6, n+7, n+4, n+5, n+8, n+2, n+3 

                ordenamos los valores de menor a mayor y tomamos el valor del medio, que es la mediana.

                n, n+1, n+2, n+3, n+4, n+5, n+6, n+7, n+8

                tomamos el valor de n+4, que es la mediana, y lo asignamos al píxel central de la matriz de la imagen.
                La matriz de la imagen original es:.
                `,
    "matriz1": "",
    "descripcion2": "Despues de aplicar el filtro de mediana, la matriz resultante es:",
    "matriz2": "",}

export let explicacion_sobel = {
    "filtro": "Filtro de Sobel",
    "descripcion1": "El filtro de Sobel detecta bordes resaltando las áreas donde hay cambios bruscos en la "+
                "intensidad de la imagen. Es útil para resaltar los contornos de los objetos en la imagen. "+
                "La matriz 3x3 que opera a la matriz de la imagen es:",
    "proceso": `| 1, 0, -1 |,
                | 2, 0, -2 |,
                | 1, 0, -1 |
                
                Y la matriz de la imagen es la siguiente:`,
    "matriz1": "",
    "descripcion2": "Despues de aplicar el filtro de Sobel, la matriz resultante es:",
    "matriz2": "",}

export let explicacion_laplaciano = {
    "filtro": "Filtro de Laplaciano",
    "descripcion1": "El filtro Laplaciano resalta las áreas de transición rápida en la imagen, como bordes y "+
                    "detalles finos. Es útil para detectar bordes y mejorar la nitidez de la imagen. "+
                    "La matriz 3x3 que opera a la matriz de la imagen es:",
    "proceso": `| 0, 1, 0 |,
                | 1, -4, 1 |,
                | 0, 1, 0 |
                
                Y la matriz de la imagen es la siguiente:`,
    "matriz1": "",
    "descripcion2": "Despues de aplicar el filtro de Laplaciano, la matriz resultante es:",
    "matriz2": "",}