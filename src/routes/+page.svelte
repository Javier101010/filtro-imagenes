<script lang="ts">

	import { explicacionApi } from '../../src/lib/services/api';
	import {filtroMedia} from '../../src/lib/services/api';
	import {filtroMediana} from '../../src/lib/services/api';
	import {filtroSobel} from '../../src/lib/services/api';
	import {filtroLaplaciano} from '../../src/lib/services/api';
	import {explicacion_media} from '../../src/lib/utilidades/descripcion';
	import {explicacion_mediana} from '../../src/lib/utilidades/descripcion';
	import {explicacion_sobel} from '../../src/lib/utilidades/descripcion';
	import {explicacion_laplaciano} from '../../src/lib/utilidades/descripcion';

	let expl_media = explicacion_media;
	let expl_mediana = explicacion_mediana;
	let expl_sobel = explicacion_sobel;
	let expl_laplaciano = explicacion_laplaciano;

	/* Variables del checkbox */
	let filtros = $state({
		media: false,
		mediana: false,
		laplaciano: false,
		sobel: false
	});

	let matrices = 
	{
		"matriz_original": [],
		"filtro_media": [],
		"filtro_mediana": [],
		"filtro_sobel": [],
		"filtro_laplaciano": []
	};

	/* Variable para las explicaciones */
	let explicaciones = $state({
		"filtro": "",
		"descripcion1": "",
		"proceso": "",
		"matriz1": "",
		"descripcion2": "",
		"matriz2": "",
	});

	
	/* Variable para indicar si se está procesando */
	let procesando = $state(false);

	/* Variables para las imágenes */
	let imagenPreview = $state('');
	let imagenRecortada = $state('')
	let imagenMedia = $state('')
	let imagenMediana = $state('')
	let imagenSobel = $state('')
	let imagenLaplaciano = $state('')

	/* Variables para manejar el archivo de imagen */
	let archivoImagen = $state<File | null>(null);
	let archivoRecortado = $state<File | null>(null);

	let canvasOriginal: HTMLCanvasElement;
	let mouseX = 0;
	let mouseY = 0;

	// Coordendas de la imagen original
	
	function subirImagen() {
		const input = document.createElement('input');

		input.type = 'file';
		input.accept = 'image/*';

		input.onchange = (event) => {
			const file = (event.target as HTMLInputElement).files?.[0];

			if (!file) return;

			archivoImagen = file;

			imagenPreview = URL.createObjectURL(file);
		};

		input.click();
	}

	async function dibujarImagen() {
		const img = new Image();

		img.onload = () => {
			const ctx = canvasOriginal.getContext('2d');

			if (!ctx) return;

			canvasOriginal.width = img.width;
			canvasOriginal.height = img.height;

			ctx.drawImage(img, 0, 0);
		};

		img.src = imagenPreview;
	}

	$effect(() => {
		if (canvasOriginal && imagenPreview) {
			dibujarImagen();
		}
	});

	function moverMouse(event: MouseEvent) {
		const rect = canvasOriginal.getBoundingClientRect();

		const scaleX =
			canvasOriginal.width / rect.width;

		const scaleY =
			canvasOriginal.height / rect.height;

		mouseX =
			(event.clientX - rect.left) * scaleX;

		mouseY =
			(event.clientY - rect.top) * scaleY;

		redibujarCanvas();
	}

	function redibujarCanvas() {
		const ctx = canvasOriginal.getContext('2d');

		if (!ctx) return;

		const img = new Image();

		img.onload = () => {
			ctx.clearRect(
				0,
				0,
				canvasOriginal.width,
				canvasOriginal.height
			);

			ctx.drawImage(img, 0, 0);

			ctx.strokeStyle = 'red';
			ctx.lineWidth = 1;

			ctx.strokeRect(
				mouseX - 7,
				mouseY - 7,
				17,
				17
			);
		};

		img.src = imagenPreview;
	}

	async function seleccionarRecorte() {
		if (!archivoImagen) return;

		const img = new Image();

		img.onload = () => {
			// crear canvas temporal
			const canvasTemp =
				document.createElement('canvas');

			canvasTemp.width = 15;
			canvasTemp.height = 15;

			const ctx = canvasTemp.getContext('2d');

			if (!ctx) return;

			// calcular coordenadas reales
			const rect = canvasOriginal.getBoundingClientRect();

			const x = Math.round(mouseX) - 7;

			const y = Math.round(mouseY) - 7;

			// copiar recorte
			ctx.drawImage(img, x, y, 15, 15, 0, 0, 15, 15);

			// preview
			imagenRecortada = canvasTemp.toDataURL();

			// blob para backend
			canvasTemp.toBlob((blob) => {
				if (!blob) return;

				archivoRecortado =
					new File(
						[blob],
						'recorte.jpeg',
						{
							type: 'image/jpeg'
						}
					);
			});
		};

		img.src = URL.createObjectURL(
			archivoImagen
		);
	}

	async function procesarImagen() {
		if (!archivoRecortado) return;

		explicaciones = {
			filtro: "",
			descripcion1: "",
			proceso: "",
			matriz1: "",
			descripcion2: "",
			matriz2: ""
		};

		procesando = true;

		imagenMedia = '';
		imagenMediana = '';
		imagenSobel = '';
		imagenLaplaciano = '';

		try {

			const opciones_descripcion: string[] = [];

			if (filtros.media) {
				opciones_descripcion.push('media');
			}

			if (filtros.mediana) {
				opciones_descripcion.push('mediana');
			}

			if (filtros.sobel) {
				opciones_descripcion.push('sobel');
			}

			if (filtros.laplaciano) {
				opciones_descripcion.push('laplaciano');
			}

			const [
				matricesRespuesta,
				mediaBlob,
				medianaBlob,
				sobelBlob,
				laplacianoBlob
			] = await Promise.all([

				explicacionApi(
					opciones_descripcion,
					archivoRecortado
				),

				filtros.media
					? filtroMedia(archivoRecortado)
					: Promise.resolve(null),

				filtros.mediana
					? filtroMediana(archivoRecortado)
					: Promise.resolve(null),

				filtros.sobel
					? filtroSobel(archivoRecortado)
					: Promise.resolve(null),

				filtros.laplaciano
					? filtroLaplaciano(archivoRecortado)
					: Promise.resolve(null)
			]);

			matrices = matricesRespuesta;

			if (mediaBlob) {
				imagenMedia =
					URL.createObjectURL(mediaBlob);

				expl_media.matriz1 =
					matrizATexto(matrices.matriz_original);

				expl_media.matriz2 =
					matrizATexto(matrices.filtro_media);
			}

			if (medianaBlob) {
				imagenMediana =
					URL.createObjectURL(medianaBlob);

				expl_mediana.matriz1 =
					matrizATexto(matrices.matriz_original);

				expl_mediana.matriz2 =
					matrizATexto(matrices.filtro_mediana);
			}

			if (sobelBlob) {
				imagenSobel =
					URL.createObjectURL(sobelBlob);

				expl_sobel.matriz1 =
					matrizATexto(matrices.matriz_original);

				expl_sobel.matriz2 =
					matrizATexto(matrices.filtro_sobel);
			}

			if (laplacianoBlob) {
				imagenLaplaciano =
					URL.createObjectURL(laplacianoBlob);

				expl_laplaciano.matriz1 =
					matrizATexto(matrices.matriz_original);

				expl_laplaciano.matriz2 =
					matrizATexto(matrices.filtro_laplaciano);
			}

		} finally {
			procesando = false;
		}
	}

	function actualizarDescripcion(filtro: string) {
		switch (filtro) {
			case 'media':
				explicaciones = expl_media;
				break;
			case 'mediana':
				explicaciones = expl_mediana;
				break;
			case 'sobel':
				explicaciones = expl_sobel;
				break;
			case 'laplaciano':
				explicaciones = expl_laplaciano;
				break;
		}
	}

	function matrizATexto(matriz: number[][]): string {
		return matriz
			.map((fila) => fila.join('\t'))
			.join('\n');
	}

</script>
<div
	class="h-full min-h-screen w-full bg-gradient-to-br from-purple-900 via-purple-600 to-blue-800 p-6"
>
	<div class="grid grid-cols-1 gap-3 lg:grid-cols-3">
		<!-- PANEL IZQUIERDO -->
		<div
			class="sticky top-4 h-fit self-start flex flex-col rounded-2xl min-h-[800px] border-3 
			border-black bg-gray-700 p-5 shadow-2xl">

			<h1 class="mb-4 text-3xl font-bold text-white">Detalle del Proceso</h1>

			<div class="h-1 w-full bg-white"></div>
			<br />
			<p class="text-white">Presione sobre una imagen para saber mas del proceso</p>
			<div
				class="mt-5 flex-1 overflow-y-auto rounded-xl border-2 border-black bg-gray-600 p-4 text-black"
			>
					<h2 class="text-xl text-white font-bold">{explicaciones.filtro}</h2>
					<br />
					<p class="text-white">{explicaciones.descripcion1}</p>
					<br />
					<p class="whitespace-pre-line text-white">{explicaciones.proceso}</p>
					<br />
					<pre class="text-white">{explicaciones.matriz1}</pre>
					<br />
					<p class="text-white">{explicaciones.descripcion2}</p>
					<br />
					<pre class="text-white">{explicaciones.matriz2}</pre>
			</div>
		</div>

		<!-- PANEL DERECHO -->
		<div
			class="flex flex-col rounded-2xl border-3 border-black bg-gray-700 p-5 shadow-2xl lg:col-span-2"
		>
			<h1 class="mb-4 text-3xl font-bold text-white">Filtrado de Imágenes</h1>

			<div class="h-1 w-full bg-white"></div>

			<!-- ZONA SUPERIOR -->
			<div
				class="mt-5 flex flex-col gap-5 rounded-xl border-2 border-black bg-gray-600 p-4 lg:flex-row lg:items-center lg:justify-between"
			>
				<button
					class="rounded-xl bg-green-600 px-6 py-3 text-lg font-bold text-white transition hover:scale-105 hover:bg-green-500"
					onclick={subirImagen}
				>
					Subir Imagen
				</button>

				<div class="grid grid-cols-2 gap-4 text-lg text-white">
					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={filtros.media} />
						Filtro Media
					</label>

					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={filtros.mediana} />
						Filtro Mediana
					</label>

					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={filtros.laplaciano} />
						Filtro Laplaciano
					</label>

					<label class="flex items-center gap-2">
						<input type="checkbox" bind:checked={filtros.sobel} />
						Filtro Sobel
					</label>
				</div>
			</div>

			<!-- BOTÓN -->
			<button
				class="mt-6 rounded-2xl bg-green-600 py-4 text-2xl font-bold text-white transition hover:scale-[1.01] hover:bg-green-500"
				onclick={procesarImagen}
				disabled={procesando}
			>
				{#if procesando}
					Procesando...
				{:else}
					Procesar Filtro
				{/if}
			</button>

			<!-- IMÁGENES -->
			<div class="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
				<!-- ORIGINAL -->
				<div class="flex min-h-[350px] flex-col rounded-2xl border-2 border-black bg-gray-600 p-4">
					<h2 class="mb-4 text-2xl font-bold text-white">Imagen Original</h2>

					<div
						class="flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-white"
					>
						<canvas bind:this={canvasOriginal} onmousemove={moverMouse}
							onclick={seleccionarRecorte} class="h-full w-full"></canvas>
					</div>
				</div>

				<!-- RECORTE -->
				<div class="flex min-h-[350px] flex-col rounded-2xl border-2 border-black bg-gray-600 p-4">
					<h2 class="mb-4 text-2xl font-bold text-white">Imagen Recortada</h2>

					<div
						class="flex aspect-square items-center justify-center overflow-hidden rounded-xl border-2 border-black bg-white"
					>
						<img src={imagenRecortada} alt="" class="h-full w-full object-contain"/>
					</div>
				</div>

				<!-- MEDIA -->
				<div class="flex min-h-[350px] flex-col rounded-2xl border-2 border-black bg-gray-600 p-4">
					<h2 class="mb-4 text-2xl font-bold text-white">Filtro Media</h2>

					<div
						class="m-4 flex flex-1 overflow-hidden 
							cursor:pointer rounded-xl border-2 border-black bg-white"
						>
						<button
							type="button"
							onclick={() => actualizarDescripcion('media')}
							class="h-full w-full cursor-pointer border-none bg-transparent p-0"
							>
							<img src={imagenMedia} alt="Imagen Media" 
								class="imagen-efecto h-[380px] w-full object-cover"
								/>
						</button>
					</div>
				</div>

				<!-- MEDIANA -->
				<div class="flex min-h-[350px] flex-col rounded-2xl border-2 border-black bg-gray-600 p-4">
					<h2 class="mb-4 text-2xl font-bold text-white">Filtro Mediana</h2>

					<div
						class="m-4 flex flex-1 overflow-hidden 
							cursor:pointer rounded-xl border-2 border-black bg-white"
						>
						<button
							type="button"
							onclick={() => actualizarDescripcion('mediana')}
							class="h-full w-full cursor-pointer border-none bg-transparent p-0"
						>
							<img
								src={imagenMediana}
								alt="Imagen Mediana"
								class="imagen-efecto h-[380px] w-full object-cover"
							/>
						</button>
					</div>
				</div>

				<!-- LAPLACIANO -->
				<div class="flex min-h-[350px] flex-col rounded-2xl border-2 border-black bg-gray-600 p-4">
					<h2 class="mb-4 text-2xl font-bold text-white">Filtro Laplaciano</h2>

					<div
						class="m-4 flex flex-1 overflow-hidden 
							cursor:pointer rounded-xl border-2 border-black bg-white"
						>
						<button
							type="button"
							onclick={() => actualizarDescripcion('laplaciano')}
							class="h-full w-full cursor-pointer border-none bg-transparent p-0"
							>
							<img src={imagenLaplaciano} alt="Imagen Laplaciano" 
								class="imagen-efecto h-[380px] w-full object-cover" 
								/>
						</button>
					</div>
				</div>

				<!-- SOBEL -->
				<div class="flex min-h-[350px] flex-col rounded-2xl border-2 border-black bg-gray-600 p-4">
					<h2 class="mb-4 text-2xl font-bold text-white">Filtro Sobel</h2>

					<div
						class="m-4 flex flex-1 overflow-hidden 
							cursor:pointer rounded-xl border-2 border-black bg-white"
						>
						<button
							type="button"
							onclick={() => actualizarDescripcion('sobel')}
							class="h-full w-full cursor-pointer border-none bg-transparent p-0"
							>
							<img src={imagenSobel} alt="Imagen Sobel" 
								class="imagen-efecto h-[380px] w-full object-cover" 
							/>
						</button>
					</div>
				</div>
			</div>
		</div>
	</div>
</div>
