window.onload = function(){
	document.getElementById('target_img').addEventListener('change', fileread);

	function fileread(ev){
		const file = ev.target.files[0];

		if(!file){
			return;
		}

		const fr = new FileReader();
		fr.onload = fileload;
		fr.readAsDataURL(file);
	}

	function fileload(ev){
		const img = new Image();
		img.src = ev.target.result;
		
		img.addEventListener('load', tv_effect);
	}

	function tv_effect(ev){
		const base_img = ev.target;

		const canvas = document.createElement('canvas');
		canvas.width = base_img.width * 3;
		canvas.height = base_img.height * 3;

		const ctx = canvas.getContext('2d');
		ctx.drawImage(base_img, 0, 0);

		const src = ctx.getImageData(0, 0, base_img.width, base_img.height).data;
		const img_data = ctx.createImageData(canvas.width, canvas.height);
		const res = img_data.data; 
		const res_width = canvas.width;

		for(let y = 0; y < base_img.height; y++){
			for(let x = 0; x < base_img.width; x++){
				const idx = (x + y * base_img.width) * 4;
				const r = src[idx];
				const g = src[idx + 1];
				const b = src[idx + 2];

				const line = (x + y * canvas.width) * 4 * 3;
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

		ctx.putImageData(img_data, 0, 0);

		const data_url = canvas.toDataURL();
		const preview = document.createElement('img');
		preview.src = data_url;
		preview.setAttribute('style', 'max-width:100%;');

		const target = document.getElementById('result');
		target.textContent = '';
		target.appendChild(preview);
	}
}
