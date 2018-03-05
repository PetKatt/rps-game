//Copyright (C) Piotr Wiercinski 2017.
//Distributed under the MIT License (license terms are at http://opensource.org/licenses/MIT).

const Unit = require("./unit.js");

class EnemyUp extends Unit {
	constructor() {
		super();
		this.y = 130;
	}

	// handle anti-enemy logic here in the future
	// shape shifting enemies

}

module.exports = EnemyUp;