{
	let width = 0;
	let height = 0;
	let lastPosY = 0;
	let lastPosX = 0;
	let CANVAS_ID = "myCanvas"
	let LINES_COUNT = 0;
	let RAD_CONST = 0.0175;
	let LINE_THICKNESS = 10;

	let lastRender = 0

	let objects = [];
	
	const LineTypes = Object.freeze({
		Regular: Symbol("regular")
	});

	class Point{
		constructor(x, y){
			this.x = x;
			this.y = y;	
		}
	}


	class Line{
		constructor(x, y){
			this.x = x;
			this.y = y;			
			this.points = [];			
		}		

		randomize = () => {
			this.lineThickness = LINE_THICKNESS;
			this.hue = getRandomInt(1, 360);			
			this.saturation = 100;
			this.light = getRandomInt(20, 80);	

			let lastX = this.x;
			let lastY = this.y;
			let lastDirection = 0; //determine from mouse position
			let baseDirection = 45 * getRandomInt(0, 7);

			for (let index = 0; index < 10; index++) {
				let length = getRandomInt(20, 200);
				let direction = baseDirection + this.getDirection(lastDirection);
				console.log(direction);

				let deltaX = Math.cos(direction * RAD_CONST) * length;
				let deltaY = Math.sin(direction * RAD_CONST) * length;

				let newX = lastX + deltaX;				
				let newY = lastY + deltaY;	
				let point = new Point(newX, newY);
				this.points.push(point);			

				lastX = newX;
				lastY = newY;
				lastDirection = direction;
			}			
			
		}

		getDirection = (lastDirection) => {
			return  45 * getRandomInt(0, 2);
		}

		drawMetroLine = (ctx) => {				
			ctx.lineCap = "round";
			ctx.lineWidth = this.lineThickness;
			ctx.strokeStyle = this.colorBase();
			ctx.beginPath();
			ctx.moveTo(this.x, this.y);

			for (let index = 0; index < this.points.length; index++) {
				const element = this.points[index];
				ctx.lineTo(element.x, element.y); 
			}

			ctx.stroke(); 			
		}			

		colorBase = () => `hsl(${this.hue}, ${this.saturation}%, ${this.light}%)`; 
	}

	init = () => {
		randomize();
		addEvents();
		drawFrame();
	}

	getRandomInt = (min, max) => {
		return Math.floor(Math.random() * max) + min;
	}

	getRandomFloat = (min, max, decimals) => {
		const str = (Math.random() * (max - min) + min).toFixed(
		  decimals,
		);
	  
		return parseFloat(str);
	}

	getRandomBool = () => {
		return Math.random() < 0.5;
	}

	addEvents = () => {
		let canvas = document.getElementById(CANVAS_ID);

		canvas.addEventListener('click', e => {
			addMetroLine(e.offsetX, e.offsetY);
		}, false);
	}

	randomize = () => {	
		angle = getRandomInt(0, 40);
	}

	drawFrame = () => {
		let canvas = document.getElementById(CANVAS_ID);
		if (canvas.getContext){
			canvas.width = width;
	  		canvas.height = height;
			let ctx = canvas.getContext('2d')
			ctx.fillStyle = "#000";
			ctx.fillRect(0, 0, canvas.width, canvas.height);
			ctx.lineWidth = 1;
			ctx.strokeStyle = '#000000';
			ctx.strokeRect(0, 0, width, height);
		}
	}	

	addMetroLine = (x, y) => {	
		let line = new Line(x, y);	
		line.randomize();	
		objects.push(line);
		LINES_COUNT++; 
	}			
			
	draw = () => {	
		drawFrame();

		if (LINES_COUNT > 0)
			for (let i = 0; i < LINES_COUNT; i++){
				let canvas = document.getElementById(CANVAS_ID);
				if (canvas.getContext){
					let ctx = canvas.getContext('2d');
					objects[i].drawMetroLine(ctx);
				}			
			}				
	}

	width = window.innerWidth;
	height = window.innerHeight;
	lastPosY = 0;
	lastPosX = 0;			

	loop = (timestamp) => {
		let progress = timestamp - lastRender;

		draw();

		lastRender = timestamp;
		window.requestAnimationFrame(loop);
	}

	init();

	window.requestAnimationFrame(loop);

}