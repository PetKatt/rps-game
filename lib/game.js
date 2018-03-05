//Copyright (C) Piotr Wiercinski 2017.
//Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).

const Unit = require("./unit.js");
const PlayerUp = require("./playerUp.js");
const PlayerDown = require("./playerDown.js");
const EnemyUp = require("./enemyUp.js");
const EnemyDown = require("./enemyDown.js");
const Snake = require("./snake.js");

class Game {
	constructor() {
		this.level = 1;
		this.score = 0;
		this.enemiesUp = [];
		this.enemiesDown = [];
		this.activeEnemiesUp = [];
		this.activeEnemiesDown = [];
		this.playerUp = new PlayerUp();
		this.playerDown = new PlayerDown();
		this.levelCompleted = false;
		this.collisionsUp = 0;
		this.collisionsDown = 0;
		this.combo = 0;
		this.paused = false;
		this.gameOver = false;

		this.background = new Image();
		this.background.src = "assets/images/scrollingBackground.png";

		this.snake = new Snake();
	}

	populateEnemies(level) {
		let numEnemies = Math.floor(3 + level*1.1);
		this.enemiesUp = new Array();
		this.enemiesDown = new Array();
		for (let i = 0; i < numEnemies; i++) {
			let newEnemUp = new EnemyUp();
			let newEnemDown = new EnemyDown();
			this.enemiesUp.push(newEnemUp);
			this.enemiesDown.push(newEnemDown);
		}
		this.spawnEnemies();
	}

	activateEnemy() {
		let nextEnemyUp = this.enemiesUp.shift();
		let nextEnemyDown = this.enemiesDown.shift();
		this.activeEnemiesUp.push(nextEnemyUp);
		this.activeEnemiesDown.push(nextEnemyDown);
	}

	enemySpawnInterval(level) {
		const max = 1500;
		const min = (950-((level + 100)/level));
		return Math.random() * (max - min) + min;
	}

	spawnEnemies() {
		let numEnemies = this.enemiesDown.length;
		const i = setInterval(() => {
			if (!this.pause) {
				this.activateEnemy();

				numEnemies -= 1;
				if (numEnemies === 0) {
					clearInterval(i);
				}
			}
		}, this.enemySpawnInterval(this.level));
	}

	moveObjects() {
		this.activeEnemiesUp.forEach((enemy) => {
			enemy.move();
		});
		this.activeEnemiesDown.forEach((enemy) => {
			enemy.move();
		});
	}

	draw(ctx) {
		ctx.clearRect(0, 0, Game.DIM_X, Game.DIM_Y);
		this.drawBackground(ctx);
		this.playerUp.draw(ctx);
		this.playerDown.draw(ctx);

		this.activeEnemiesUp.forEach((enemy) => {
			enemy.draw(ctx);
		});
		this.activeEnemiesDown.forEach((enemy) => {
			enemy.draw(ctx);
		});

		this.drawHealthPlayerUp(ctx);
		this.drawHealthPlayerDown(ctx);
		this.drawStats(ctx);
		if (this.combo > 1) {
			this.drawCombo(ctx);
		}
		if (this.gameOver) {
			this.snake.init();
			ctx.font = "40px Walter Turncoat";
			ctx.fillText("Game Over", 325, 170);
			ctx.fillText("Press R to Restart", 270, 210);
		}
	}
	
	drawBackground(ctx) {
		ctx.drawImage(this.background, 0, 0);
	}

	drawCombo(ctx) {
		ctx.font = `25px Walter Turncoat`;
		ctx.fillText(`Combo: ${this.combo}`, 50, 250);
		let adjective = "";
		let color = "";
		if (this.combo >= 30) {
			color = "blue";
			adjective = "Amazing!";
		} else if (this.combo >= 20) {
			color = "yellow";
			adjective = "Awesome!";
		} else if (this.combo >= 10) {
			color = "red";
			adjective = "Great!";
		}
		ctx.fillStyle = color;
		ctx.fillText(`${adjective}`, 55, 200);
		ctx.fillStyle = "black";
	}

	drawHealthPlayerUp(ctx) {		
		const heart = new Image();
		heart.src = "./assets/images/heart.png";
		const halfheart = new Image();
		halfheart.src = "./assets/images/half_heart.png";
		const noheart = new Image();
		noheart.src = "./assets/images/empty_heart.png";

		let numHearts = Math.floor(this.playerUp.health / 1);
		let numHalves = (this.playerUp.health % 1) / 0.5;
		let numEmpties = 3 - numHearts - numHalves;

		let first, second, third;

		if (numHearts === 3) {
			first = heart;
			second = heart;
			third = heart;
		} else if (numHearts === 2) {
			first = heart;
			second = heart;
			if (numHalves === 1) {
				third = halfheart;
			} else {
				third = noheart;
			}
		} else if (numHearts === 1) {
			first = heart;
			if (numHalves === 1) {
				second = halfheart;
				third = noheart;
			} else {
				second = noheart;
				third = noheart;
			}
		} else {
			if (numHalves === 1) {
				first = halfheart;
				second = noheart;
				third = noheart;
			} else {
				first = noheart;
				second = noheart;
				third = noheart;
			}
		}

		ctx.drawImage(first, 30, 50, 45, 45)
		ctx.drawImage(second, 75, 50, 45, 45)
		ctx.drawImage(third, 120, 50, 45, 45)
	}

	drawHealthPlayerDown(ctx) {		
		const heart = new Image();
		heart.src = "./assets/images/heart.png";
		const halfheart = new Image();
		halfheart.src = "./assets/images/half_heart.png";
		const noheart = new Image();
		noheart.src = "./assets/images/empty_heart.png";

		let numHearts = Math.floor(this.playerDown.health / 1);
		let numHalves = (this.playerDown.health % 1) / 0.5;
		let numEmpties = 3 - numHearts - numHalves;

		let first, second, third;

		if (numHearts === 3) {
			first = heart;
			second = heart;
			third = heart;
		} else if (numHearts === 2) {
			first = heart;
			second = heart;
			if (numHalves === 1) {
				third = halfheart;
			} else {
				third = noheart;
			}
		} else if (numHearts === 1) {
			first = heart;
			if (numHalves === 1) {
				second = halfheart;
				third = noheart;
			} else {
				second = noheart;
				third = noheart;
			}
		} else {
			if (numHalves === 1) {
				first = halfheart;
				second = noheart;
				third = noheart;
			} else {
				first = noheart;
				second = noheart;
				third = noheart;
			}
		}

		ctx.drawImage(first, 165, 50, 45, 45)
		ctx.drawImage(second, 210, 50, 45, 45)
		ctx.drawImage(third, 255, 50, 45, 45)
	}

	drawStats(ctx) {
		ctx.font = "30px Walter Turncoat";
		ctx.fillText(`Score: ${this.score}`, 325, 50);
		ctx.fillText(`Level: ${this.level}`, 645, 50);
		ctx.font = "20px Walter Turncoat";
		ctx.fillText(`${2*(Math.floor(3 + this.level*1.1)) - this.collisionsUp - this.collisionsDown} enemies remaining`, 585, 75);
	}

	removeEnemy() {
		this.activeEnemiesUp.shift();
		this.activeEnemiesDown.shift();
	}

	checkCollisionsUp() {		
		if (this.activeEnemiesUp.length) {
			let nextEnemyUp = this.activeEnemiesUp[0];
			if (this.playerUp.x > (nextEnemyUp.x - 75)) {
				this.handleScore(nextEnemyUp);
				this.handleHealthPlayerUp(nextEnemyUp);
				this.removeEnemy();
				this.collisionsUp += 1;
			}
		}
	}

	checkCollisionsDown() {
		if (this.activeEnemiesDown.length) {
			let nextEnemyDown = this.activeEnemiesDown[0];
			if (this.playerDown.x > (nextEnemyDown.x - 75)) {
				this.handleScore(nextEnemyDown);
				this.handleHealthPlayerDown(nextEnemyDown);
				this.removeEnemy();
				this.collisionsDown += 1;
			}
		}

		if (!this.activeEnemiesDown.length && !this.enemiesDown.length) {
			this.levelCompleted = true;
		}
	}

	handleScore(enemy) {
		let modifier = 1;
		if (this.combo > 0) modifier = this.combo;
		if ((this.rpsLogicUp(this.playerUp.type, enemy.type) === "win") || (this.rpsLogicDown(this.playerDown.type, enemy.type) === "win")) {
			this.score += (50 * modifier);
		}
	}

	handleHealthPlayerUp(enemy) {
		switch (this.rpsLogicUp(this.playerUp.type, enemy.type)) {
			case "draw":
				this.playerUp.health -= 0.5;
				this.combo = 0;
				break;
			case "loss":
				this.playerUp.health -= 1;
				this.combo = 0;
				break;
			case "win":
				this.combo ++;
				break;
			default:
				return;				
				break;
		}
	}

	handleHealthPlayerDown(enemy) {
		switch (this.rpsLogicDown(this.playerDown.type, enemy.type)) {
			case "draw":
				this.playerDown.health -= 0.5;
				this.combo = 0;
				break;
			case "loss":
				this.playerDown.health -= 1;
				this.combo = 0;
				break;
			case "win":
				this.combo ++;
				break;
			default:
				return;				
				break;
		}
	}

	rpsLogicUp(playerType, enemyType) {
		const types = Unit.TYPES;
		const playerIdx = types.indexOf(playerType);
		const enemyIdx = types.indexOf(enemyType);

		if (playerIdx === enemyIdx) {
			return "draw";
		}

		if (playerIdx === 2 && enemyIdx === 0) {
			return "loss";
		}

		if (enemyIdx === 2 && playerIdx === 0) {
			return "win";
		}

		if (playerIdx > enemyIdx) {
			return "win";
		} else {
			return "loss";
		}
	}

	rpsLogicDown(playerType, enemyType) {
		const types = Unit.TYPES;
		const playerIdx = types.indexOf(playerType);
		const enemyIdx = types.indexOf(enemyType);

		if (playerIdx === enemyIdx) {
			return "draw";
		}

		if (playerIdx === 2 && enemyIdx === 0) {
			return "loss";
		}

		if (enemyIdx === 2 && playerIdx === 0) {
			return "win";
		}

		if (playerIdx > enemyIdx) {
			return "win";
		} else {
			return "loss";
		}
	}

	step() {
		this.moveObjects();
		this.checkCollisionsUp();
		this.checkCollisionsDown();
		this.levelReset();
		this.checkGameOver();
	}

	checkGameOver() {
		if ((this.playerUp.health <= 0) || (this.playerDown.health <= 0)) {
			this.gameOver = true;
		}
	}

	levelReset() {
		if (this.levelCompleted) {
			this.levelCompleted = false;
			//render Level screen
			this.level ++;
			this.populateEnemies(this.level);
			this.collisionsUp = 0;
			this.collisionsDown = 0;
		}
	}

}

Game.DIM_X = 800;
Game.DIM_Y = 500;

module.exports = Game;