self.addEventListener('message', (message) => {
	const width = message.data.width;
	const height = message.data.height;
	const src = new Uint8ClampedArray(message.data.img);
	const res = new Uint8ClampedArray(4 * width * 3 * height * 3);
	const res_width = width * 3;

	for(let y = 0; y < height; y++){
		for(let x = 0; x < width; x++){
			const idx = (x + y * width) * 4;
			const r = src[idx];
			const g = src[idx + 1];
			const b = src[idx + 2];

			const line = (x + y * res_width) * 4 * 3;
			const line2 = line + res_width * 4;
			const line3 = line + res_width * 8;
			res[line] = res[line2] = res[line3] = r;
			res[line + 5] = res[line2 + 5] = res[line3 + 5] = g;
			res[line + 10] = res[line2 + 10] = res[line3 + 10] = b;

			res[line + 3] = res[line + 7] = res[line + 11] = 255;
			res[line2 + 3] = res[line2 + 7] = res[line2 + 11] = 255;
			res[line3 + 3] = res[line3 + 7] = res[line3 + 11] = 255;
		}
	}

	postMessage(res.buffer, [res.buffer]);
});
