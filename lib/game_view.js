//Copyright (C) Piotr Wiercinski 2017.
//Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).


class GameView {
	constructor(game, ctx) {
		this.ctx = ctx;
		this.game = game;
		this.playerUp = this.game.playerUp;
		this.playerDown = this.game.playerDown;
		this.lastTime = 0;
	}

	bindKeysPlayerDown() {
		const playerDown = this.playerDown;
		const ctx = this.ctx;

		addEventListener("keydown", function(e) {
			switch (e.keyCode) {
				case 90:
				case 37:
					playerDown.setType("rock");
					break;
				case 88:
				case 40:
					playerDown.setType("paper");
					break;
				case 67:
				case 39:
					playerDown.setType("scissors");
					break;
					// case: 80
					// p - pause the game
				default:
					break;
			}
		}, false);
	}

	bindKeysPlayerUp() {
		const playerUp = this.playerUp;
		const ctx = this.ctx;

		addEventListener("keydown", function(e) {
			switch (e.keyCode) {
				case 219:
					playerUp.setType("rock");
					break;
				case 221:
					playerUp.setType("paper");
					break;
				case 220:
					playerUp.setType("scissors");
					break;
					// case: 80
					// p - pause the game
				default:
					break;
			}
		}, false);
	}

	// consider modifying switch statement above to only allow moves if game NOT over
 	// save draw for game.draw!

 	animate(time) {
 		if (!this.game.gameOver && !this.game.paused) {
 			if (!this.lastTime) this.lastTime = time;
 			const timeDelta = time - this.lastTime;
 			this.game.step();
 			this.game.draw(this.ctx);
 			
 			//console.log(time, this.lastTime, timeDelta);

			requestAnimationFrame(this.animate.bind(this));
 		}
 	}

 	start() {
 		this.bindKeysPlayerUp();
 		this.bindKeysPlayerDown();
 		this.lastTime = 0;
 		this.game.populateEnemies(this.game.level);

 		requestAnimationFrame(this.animate.bind(this));
 	}
}

module.exports = GameView;