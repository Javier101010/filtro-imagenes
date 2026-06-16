const API_URL = 'https://filtro-backend-3.onrender.com';
//const API_URL = 'http://localhost:8000';

export async function explicacionApi(filtros: string[], imagen: File) {
	const formData = new FormData();

	formData.append('imagen', imagen);

	filtros.forEach((filtro) => {
		formData.append('filtros', filtro);
	});

	const response = await fetch(
		`${API_URL}/filtro/explicacion`,
		{
			method: 'POST',
			body: formData
		}
	);
	console.log(response);

	return response.json();
}

export async function filtroMedia(imagen: File) {
	const formData = new FormData();

	formData.append('imagen', imagen);

	const response = await fetch(
		`${API_URL}/filtro/media`,
		{
			method: 'POST',
			body: formData
		}
	);

	return response.blob();
}

export async function filtroMediana(imagen: File) {
	const formData = new FormData();

	formData.append('imagen', imagen);

	const response = await fetch(
		`${API_URL}/filtro/mediana`,
		{
			method: 'POST',
			body: formData
		}
	);

	return response.blob();
}

export async function filtroSobel(imagen: File) {
	const formData = new FormData();

	formData.append('imagen', imagen);

	const response = await fetch(
		`${API_URL}/filtro/sobel`,
		{
			method: 'POST',
			body: formData
		}
	);

	return response.blob();
}

export async function filtroLaplaciano(imagen: File) {
	const formData = new FormData();

	formData.append('imagen', imagen);

	const response = await fetch(
		`${API_URL}/filtro/laplaciano`,
		{
			method: 'POST',
			body: formData
		}
	);

	return response.blob();
}