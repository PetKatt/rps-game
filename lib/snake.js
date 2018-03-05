//Copyright (C) Piotr Wiercinski 2017.
//Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).

class Snake {
	constructor() {
		this.canvasEl = document.getElementById("mainCanvas");
		this.ctx = this.canvasEl.getContext("2d");
		this.width = this.canvasEl.width;
		this.height = this.canvasEl.height;

		this.divisions = 30;

		this.posX = 0;
		this.posY = 0;

		this.distX = this.width/this.divisions;
		this.distY = this.height/this.divisions;

		this.memory = new Array(this.divisions);
		this.animID = 0;	
	}

	numGenerator() {
		this.posX = Math.floor(Math.random()*this.divisions);
		this.posY = Math.floor(Math.random()*this.divisions);
	}

	init() {
		// create Two-Dimensional Array to remember already filled squares
		for (let i = 0; i < (this.divisions+1); i++) {
			this.memory[i] = new Array(this.divisions);
		}
		
		this.numGenerator();

		this.animID = requestAnimationFrame(this.animate.bind(this));
	}

	animate(timestamp) {
		if (!start) start = timestamp;
		let progress = timestamp - start;
		this.oneMovement();

		this.animID = requestAnimationFrame(this.animate.bind(this));
	}

	oneMovement() {	
		this.drawSquare(this.posX, this.posY);

		const numPosibilities = this.checkPosition().length;
		if (numPosibilities == 0) {
			let newPoint = this.startNew();
			this.posX = newPoint[0];
			this.posY = newPoint[1];
			requestAnimationFrame(this.animate.bind(this));
		} else {
			this.chooseDirection(this.checkPosition());
		}
	}

	checkPosition() {
		const posPosition = [];

		if (this.posX == 0) {
			// left end
		} else if (this.memory[this.posX-1][this.poxY] == true) {
			// left not empty
		} else {
			posPosition.push("left");
		}

		if (this.posX == this.divisions) {
			// right end
		} else if (this.memory[this.posX+1][this.posY] == true) {
			// right not empty
		} else {
			posPosition.push("right");
		}

		if (this.posY == 0) {
			// top end
		} else if (this.memory[this.posX][this.posY-1] == true) {
			// top not empty
		} else {
			posPosition.push("top");
		}

		if (this.posY == this.divisions) {
			// bottom end
		} else if (this.memory[this.posX][this.posY+1] == true) {
			// bottom not empty
		} else {
			posPosition.push("bottom");
		}

		return posPosition;
	}

	chooseDirection(array) {
		let randomDir = array[Math.floor(Math.random()*array.length)]
		switch (randomDir) {
			case "left":
				this.posX--;
				break;
			case "right":
				this.posX++;
				break;
			case "top":
				this.posY--;
				break;
			case "bottom":
				this.posY++;
				break;
			default:
				break;
		}
	}

	drawSquare(x, y) {
		this.ctx.fillStyle = "#E11584";
		this.ctx.fillRect(x*this.distX, y*this.distY, this.distX, this.distY);

		if (this.memory) {
			this.memory[x][y] = true;
		}
	}

	startNew() {
		cancelAnimationFrame(this.animID);

		for (let i = 0; i < (this.divisions+1); i++) {
			for (let o = 0; o < (this.divisions+1); o++) {
				if (!this.memory[i][o]) {
					return [i, o];
				}
			}
		}
	}

}

module.exports = Snake;