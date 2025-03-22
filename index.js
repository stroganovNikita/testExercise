/*Класс game инициализирующий игру*/
/* 0 - tileW, 1 - tile, 2 - tileHP, 3 - tileSW, 4 - tileP, 5 - tileE */
class Game {
  constructor() { //Поле, статы героя, и массив для врагов
	this.playField = [];
	this.hero = {x: 0, y: 0, hp: 100, attack: 33};
	this.enemies = []
  };

  init() {  //Каскад, инициализирующий игру
	createPlayingField(this.playField);
    createRooms(this.playField);
	createAisle(this.playField);
	placeUnits(this.playField, this.hero, this.enemies);
    fillWall(this.playField, this.hero, this.enemies);
	movementHero(this.playField, this.hero, this.enemies);
	setInterval(() => {movementEnemies(this.playField, this.hero, this.enemies)}, 700);
  };
};

/*Генерация рандомного числа в интервале min max*/
function randomInt(min, max) {
	return Math.floor(Math.random() * (max - min + 1) + min);
};

/*Создание игровой зоны*/
function createPlayingField(playField) {
  for (let i = 0; i < 24; i++) {
	playField.push(new Array(40).fill(0))
  };
return playField;
};

/*Заполняем карту*/
function fillWall(playField, hero, enemies) {
	const gameFieldDOM = document.querySelector('.field'); //Выбор области для заполнения карты
	gameFieldDOM.innerHTML = ''; 
	for (let y = 0; y < 24; y++) {  // Ось y
	  for (let x = 0; x < 40; x++) { // Ось x
	    const div = document.createElement('div');  //Создание div элемента в зависимости от числа, соответствующего предмету.
		switch (playField[y][x]) {
		  case 0: 
		    div.classList.add('tileW');
		    break;
		  case 1:
			div.classList.add('tile');
			break;
		  case 2:
			div.classList.add('tileHP');
			break;
		  case 3:
			div.classList.add('tileSW')
			break;
		  case 4: // DOM с процентами hp для персонажа
			div.classList.add('tileP');
			div.innerHTML = '';
			healthDOM(hero, div) //Функция для заполнения здоровья для героя
			break;
		  case 5:  
		    div.classList.add('tileE');
			div.innerHTML = '';
		    enemies.forEach(function(enemy) {
			  if (y === enemy.y && x === enemy.x) {
			    healthDOM(enemy, div) //Функция для заполнения здоровья для врагов
			  } 
		    });
		  break;
		};
		gameFieldDOM.appendChild(div);
	  };
	};
};
/*Функция для DOM заполнения здоровья всем персонажам на карте*/
function healthDOM(person, div) {
	const health = document.createElement('div');
	health.classList.add('health');
	health.setAttribute('style', `width: ${person.hp}%;`);
	div.append(health)
};

/*Создание прямоугольных комнат*/
function createRooms(playField) {
	const quantityRooms = randomInt(5, 10);
    for (let i = 0; i < quantityRooms; i++) {
	  let x = randomInt(0, 31);
	  let y = randomInt(0, 15);
	  let xEnd = x + randomInt(3, 8) 
	  let yEnd = y + randomInt(3, 8);
	  loopRooms(x, y, xEnd, yEnd, playField);
  }
};
/*Петля для создания комнат*/
function loopRooms(x, y, xEnd, yEnd, playField) { 
	for (let i = x; i <= xEnd; i++) {
		for (let j = y; j <= yEnd; j++) {
			playField[j][i] = 1;
		}
	}
};

/*Создание проходов*/
function createAisle(playField) {
  let quaX = randomInt(3, 5);
  let quaY = randomInt(3, 5);
  for (let i = 0; i < quaY; i++) {
	const y = randomInt(0, 23);
	loopForAisleY(y, playField);
  };
  for (let i = 0; i < quaX; i++) {
	const x = randomInt(0, 39);
	loopForAisleX(x, playField);
  }
};
/*Петля для проходов по y оси */
function loopForAisleY(y, playField) {  
  for (let x = 0; x < 40; x++) {
	playField[y][x] = 1;
  }
};
/*Петля для проходов по x оси */
function loopForAisleX(x, playField) { 
  for (let y = 0; y < 24; y++) {
	playField[y][x] = 1;
  }
};

/*Размещаем зелья, мечи, героя и врагов*/
function placeUnits(playField, heroObj, enemies) {
  let rx = randomInt(0, 39);
  let ry = randomInt(0, 23);
  let hero = 1;
  let potion = 10;
  let sword = 2;
  let enemy = 10;
  while (potion > 0) { // зелья
	if (playField[ry][rx] === 1) {
		playField[ry][rx] = 2;
		potion--
	} else {
		rx = randomInt(0, 39);
		ry = randomInt(0, 23);
	}
  };
  while (sword > 0) { // мечи
	if (playField[ry][rx] === 1) {
		playField[ry][rx] = 3;
		sword--
	} else {
		rx = randomInt(0, 39);
		ry = randomInt(0, 23);
	}
  };
  while (hero > 0) { // герой
	if (playField[ry][rx] === 1) {
		playField[ry][rx] = 4;
		heroObj.x = rx;
		heroObj.y = ry;
		hero--
	} else {
		rx = randomInt(0, 39);
		ry = randomInt(0, 23);
	}
  };
  while (enemy > 0) { // враги
	if (playField[ry][rx] === 1) {
		playField[ry][rx] = 5;
		enemies.push({x: rx, y: ry, hp: 100, attack: 15})
		enemy--
	} else {
		rx = randomInt(0, 39);
		ry = randomInt(0, 23);
	}
  }
};
/*Реализация WASD передвижения*/
function movementHero(playField, hero, enemies) {
  window.addEventListener('keydown', function(e) {
    switch(e.key) {
	  case 'a':
	  case 'ф':
		const a = permissionMove(playField, hero.x - 1, hero.y);
		if (a.move) { 
		  checkStats(a, hero); //Функция для изменений статов героя в случае взятия предмета
	  	  hero.x = hero.x - 1; //Изменения расположения героя
		  rearrangement(playField, hero.y, hero.x + 1, hero.y, hero.x, 4, hero, enemies); // Перестановка элементов на карте
		  checkEnemy(false, hero, enemies); // Проверка наличия врагов и получения от них урона
	  }
	  break;
	  case 'w':
	  case 'ц':
		const w = permissionMove(playField, hero.x, hero.y - 1);
		if (w.move) { 
		  checkStats(w, hero);
	      hero.y = hero.y - 1;
		  rearrangement(playField, hero.y + 1, hero.x, hero.y, hero.x, 4, hero, enemies);
		  checkEnemy(false, hero, enemies); 
      }
	  break;
	  case 's':
	  case 'ы':
		const s = permissionMove(playField, hero.x, hero.y + 1);
		if (s.move) {
		  checkStats(s, hero);
		  hero.y = hero.y + 1;
		  rearrangement(playField, hero.y - 1, hero.x, hero.y, hero.x, 4, hero, enemies);
		  checkEnemy(false, hero, enemies);
	  }
	  break;
	  case 'd':
	  case 'в':
		const d = permissionMove(playField, hero.x + 1, hero.y);
		if (d.move) {
		  checkStats(d, hero);
		  hero.x = hero.x + 1;
		  rearrangement(playField, hero.y, hero.x - 1, hero.y, hero.x, 4, hero, enemies);
		  checkEnemy(false, hero, enemies);
	  }
	  break;
	  case ' ':
		checkEnemy(true, hero, enemies, playField);
		fillWall(playField, hero, enemies); //Триггер перерисовки
	}
  })
};
/*Проверка условий для изменения статов героя*/
function checkStats(direction, hero) {
	if (direction.health && hero.hp + 30 >= 100) return hero.hp = 100;
	if (direction.health) return hero.hp = hero.hp + 30;
    if (direction.sword && hero.attack + 33 == 99) return hero.attack = 100;
 	if (direction.sword) return hero.attack = hero.attack + 33; 
}
/*Проверка возможности движения*/
function permissionMove(playField, x, y) { 
	try {
	  if (playField[y][x] === 1) {
		return {move: true};
	  };
	  if (playField[y][x] === 2) {
		return {move: true, health: true};
	  }
	  if (playField[y][x] === 3) {
		return {move: true, sword: true};
	  } 
	  if (playField[y][x] === 0) {
		return {move: false};
	  }
	  if (playField[y][x] === 5) {
		return {move: false};
	  } else {
		return { move: false }
	  }
    } catch {
	  return { move: false }; // Ошибка возвращает объект со свойством move
    }
}

/*Реализация атаки героя*/
function checkEnemy(attack, hero, enemies, playField) {
  enemies.forEach(function(enemy) {
	if (Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y) === 1) { // Проверка наличия врага
		hero.hp = hero.hp - enemy.attack; // Атака по герою
	  if (attack) {
	    enemy.hp = enemy.hp - hero.attack; // Атака по врагу
	  };
	  if (enemy.hp <= 0) { // Удаление врага с массива с врагами
		playField[enemy.y][enemy.x] = 1;
		enemies.splice(enemies.indexOf(enemy), 1);
	  };
      if (hero.hp <= 0) { // Обновление страницы в случае смерти героя
		setTimeout(() => alert('You are lose!'), 100);
	    setTimeout(() => location.reload(), 200);
	  };
	  if (enemies.length <= 0) {
		setTimeout(() => alert('You are win!'), 100);
		setTimeout(() => location.reload(), 200);
	  }
	}
  });
};
/*Функция для атаки пользователя врагом при хождении*/
function hitEnemy(hero, enemy) {  
  if (Math.abs(hero.x - enemy.x) + Math.abs(hero.y - enemy.y) === 1) {
	hero.hp = hero.hp - enemy.attack;
    if (hero.hp <= 0) { // Обновление страницы в случае смерти героя
		setTimeout(() => alert('You are lose!'), 100);
	    setTimeout(() => location.reload(), 200);
  };
 }
};
/*Движение врагов*/
function movementEnemies(playField, hero, enemies) {
  enemies.forEach(function(enemy) {
    let random = randomInt(0, 3) // Рандомное направление хода
	switch (random) {
	  case 0:
		const d = permissionMove(playField, enemy.x + 1, enemy.y, true) 
		if (d.move && !d.health && !d.sword) {  // Можно ходить, если true move, но не на фласки со здоровьем и не на мечи
		  enemy.x = enemy.x + 1;
		  rearrangement(playField, enemy.y, enemy.x -1, enemy.y, enemy.x, 5, hero, enemies);  // Перестановка элементов на карте
		  hitEnemy(hero, enemy);
		  break;
		};
	  case 1:
		const a = permissionMove(playField, enemy.x - 1, enemy.y, true)
		if (a.move && !a.health && !a.sword) {
		  enemy.x = enemy.x - 1;
		  rearrangement(playField, enemy.y, enemy.x + 1, enemy.y, enemy.x, 5, hero, enemies);
		  hitEnemy(hero, enemy);
	  	  break;
		} 
	  case 2: 
	    const w = permissionMove(playField, enemy.x, enemy.y - 1, true)
		if (w.move && !w.health && !w.sword) {
		  enemy.y = enemy.y - 1;
		  rearrangement(playField, enemy.y + 1, enemy.x, enemy.y, enemy.x, 5, hero, enemies);
		  hitEnemy(hero, enemy);
		  break;
		} 
	  case 3:
		const s = permissionMove(playField, enemy.x, enemy.y + 1, true)
		if (s.move && !s.health && !s.sword) {	
		  enemy.y = enemy.y + 1;
		  rearrangement(playField, enemy.y - 1, enemy.x, enemy.y, enemy.x, 5, hero, enemies);
		  hitEnemy(hero, enemy);
		}	
		break;
		} 
	})
};

function rearrangement (playField, yB, xB, yA, xA, value, hero, enemies) { // Функция для перетасовки значений во время передвижения юнитов, окончание B-before, A-after
	playField[yB][xB] = 1;
	playField[yA][xA] = value;
	fillWall(playField, hero, enemies);
}