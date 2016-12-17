window.onload = function(){
	document.getElementById('target_img').addEventListener('change', fileread);

	function fileread(ev){
		const file = ev.target.files[0];

		if(!file){
			return;
		}

		const fr = new FileReader();
		fr.onload = (ev) => {
			const img = new Image();
			img.src = ev.target.result;
			
			img.addEventListener('load', tv_effect);
		};
		fr.readAsDataURL(file);
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

		const jobs = [];

		let slice_src_idx = 0;

		for(let i = 0; i < 4; i++){
			const worker = new Worker('js/worker.js');
			const height  = (i === 3)? Math.floor(base_img.height / 4) + base_img.height % 4 : Math.floor(base_img.height / 4);
			const chunk_size = height * base_img.width * 4;
			const slice_src = src.slice(slice_src_idx, slice_src_idx + chunk_size);
			
			slice_src_idx += chunk_size;

			const promise = new Promise(function(resolve, reject){
				worker.onmessage = (message) => {
					resolve(message.data);
				};
			})

			jobs.push(promise);
			
			worker.postMessage(
				{
					width: base_img.width,
					height: height,
					img: slice_src.buffer
				},
				[slice_src.buffer]
			)
		}

		Promise.all(jobs).then(function(results){
			let idx = 0;
			for(let j = 0; j < results.length; j++){
				const typed_array = new Uint8ClampedArray(results[j]);
				res.set(typed_array, idx);
				idx += typed_array.length;
			}

			ctx.putImageData(img_data, 0, 0);

			const preview = document.createElement('img');
			preview.src = canvas.toDataURL();
			preview.setAttribute('style', 'max-width:100%;');

			const target = document.getElementById('result');
			target.textContent = '';
			target.appendChild(preview);
		});

	}
}
