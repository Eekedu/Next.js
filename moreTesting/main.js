var tiles = [];
var player = 0;
var resolution;
var xMax, yMax;
var maxTiles = 0;
var rolls = 0;
var players = [];
var newGameArea, gameArea;
var playButton, playerCountInput, difficultyB;
var currentPlayer, rollButton, diceGif, newGame, resetGame;
var scoreBoard;
function init(){
  createCanvas(500, 400);
  createTag("hr");
  setFrameRate(10);
  //div to create a game start selection
  newGameArea = createTag("div");
  var label = createTag("span");
  label.text = "How many players? ";
  playerCountInput = createTag("select");
  for (var i = 1; i < 10; i++){
    var num = createTag("option");
    num.text = i+1;
    playerCountInput.insertChild(num);
  }
  var label2 = createTag("span");
  label2.text = " Difficulty? (1-easy, 5 hard) ";
  difficultyB = createTag("select");
  for (var i = 0; i < 5; i++){
    var num = createTag("option");
    num.text = i + 1;
    difficultyB.insertChild(num);
  }
  playButton = createTag("button");
  playButton.text = "Start Game";
  playButton.setMouseCallback(startGame);
  newGameArea.insertChild(label);
  newGameArea.insertChild(playerCountInput);
  newGameArea.insertChild(label2);
  newGameArea.insertChild(difficultyB);
  newGameArea.insertChild(playButton);

  //div to show and let people play
  gameArea = createTag("div");
  currentPlayer = createTag("span");
  rollButton = createTag("button");
  rollButton.text = "Roll the die";
  rollButton.setStyle("float", "right");
  rollButton.setMouseCallback(prepareRoll);
  diceGif = createTag("img");
  diceGif.src = "dice.gif";
  diceGif.setStyle("display", "none");
  diceGif.setStyle("float", "right");
  diceGif.setStyle("width", "100px");
  diceGif.setStyle("height", "100px");
  newGame = createTag("button");
  newGame.text = "New Game";
  newGame.setStyle("display", "none");
  newGame.setStyle("float", "right");
  newGame.setMouseCallback(newGameS);
  resetGame = createTag("button");
  resetGame.text = "Reset Game";
  resetGame.setStyle("display", "none");
  resetGame.setStyle("float", "right");
  resetGame.setMouseCallback(resetGameS);
  scoreBoard = createTag("div");
  gameArea.insertChild(currentPlayer);
  gameArea.insertChild(rollButton);
  gameArea.insertChild(diceGif);
  gameArea.insertChild(newGame);
  gameArea.insertChild(resetGame);
  gameArea.insertChild(scoreBoard);
  gameArea.setStyle("display", "none");
  resolution = 25;
  xMax = width / resolution;
  yMax = height / resolution;
  maxTiles = xMax * yMax;
}

function clearGameB(){
  tiles = [];
}

function makeGame(difficulty){
  var numSnakes = difficulty * (floor((xMax + yMax) / 2)) * 2;
  var curXpos = 0;
  var curYpos = (yMax - 1) * resolution;
  var dir = 1;
  var takenIndex = [];
  for (var index = 0; index < maxTiles; index++){
    var makeSnadder = random(1, 8 + numSnakes);
    var lsnad = 0;
    var didMake = false;
    if (numSnakes > 0 && makeSnadder <= 4 && index > 0){
      while (!didMake){
        lsnad = 0;
        if (makeSnadder <= 1){
          if (index < (maxTiles) - xMax){
            lsnad = floor(index + random(maxTiles - (xMax * 6)));
          }
          lsnad = constrain(lsnad, xMax + 1, maxTiles - (xMax * 3 - 1));
        } else if (makeSnadder <= 4){
          if (index < maxTiles - 1){
            lsnad = floor(index - random(maxTiles - 1, 1));
          }
          lsnad = constrain(lsnad, 0, (maxTiles) - 2);
        }
        if (!$.inArray(lsnad, takenIndex)){
          makeSnadder = floor(random(1, 8 + numSnakes));
        } else {
          numSnakes--;
          takenIndex.push(lsnad);
          didMake = true;
        }
      }
    }
    var tile = new Tile(curXpos, curYpos, resolution, index, lsnad);
    tiles.push(tile);
    curXpos += resolution * dir;
    if (curXpos > (xMax - 1) * resolution || curXpos < 0){
      dir *= -1;
      curXpos += resolution * dir;
      curYpos -= resolution;
    }
  }
}

var gameStart = false;
var gameOver = false;
function startGame(){
  if (!gameStart){
    var difficulty = parseInt(difficultyB.getValue());
    makeGame(6 - difficulty);
    var numPlayers = parseInt(playerCountInput.getValue());
    players = new Array(numPlayers);
    for (var i = 0; i < numPlayers; i++){
      var randR = floor(random(50, 200));
      var randG = floor(random(50, 200));
      var randB = floor(random(50, 200));
      players[i] = new Player(new Color(randR, randG, randB), i);
    }
    newGameArea.setStyle("display", "none");
    gameArea.setStyle("display", "inline");
    currentPlayer.text = "Current Player: " + (player + 1);
    updateScoreboard();
    gameStart = true;
  } else {
    console.log("Game already started!");
  }
}

function newGameS(){
  clearGameB();
  resetGameS();
  gameStart = false;
  newGameArea.setStyle("display", "inline");
  gameArea.setStyle("display", "none");
}

function resetGameS(){
  each(players, function(idx, player){
    player.reset();
    gameOver = false;
    player = 0;
  });
  rolls = 0;
  resetGame.setStyle("display", "none");
  newGame.setStyle("display", "none");
  rollButton.setStyle("display", "inline");
}

function updateScoreboard(){
  scoreBoard.text = "";
  each(players, function(idx, player){
    scoreBoard.text += "Player " + (idx + 1) + ": " + roundDecS((((player.spot + 1) / maxTiles) * 100.0), 2)  + "%\n";
  });
}
var isRolling = false;
function prepareRoll(){
  if (!isRolling){
    diceGif.setStyle("display", "inline");
    isRolling = true;
    setTimeout(playerRoll, 1200);
  }
}

function playerRoll(){
  diceGif.setStyle("display", "none");
  if (!gameOver){
    rolls++;
    players[player].rollDice();
  }
  if (players[player].spot >= maxTiles - 1){
    players[player].spot = maxTiles - 1;
    updateScoreboard();
    gameOver = true;
    resetGame.setStyle("display", "inline");
    newGame.setStyle("display", "inline");
    rollButton.setStyle("display", "none");
  }
  if (!gameOver){
    player++;
    if (player > players.length - 1){
      player = 0;
    }
    currentPlayer.text = "Current Player: " + (player + 1);
    updateScoreboard();
  }
  isRolling = false;
}

function loop(){
  background(51);
  for (var tile of tiles){
    tile.show();
  }
  for (var tile of tiles){
    tile.showSnadder();
  }

  if (gameStart){
    each(players, function(idx, player){
      if (player.spot != -1){
        player.show(tiles);
      }
    });

    players[player].showCurrent();
    playerRoll();
    if (gameOver){
      fill(255);
      rect(0, hfheight - 32, width, 64, true);
      fill(0);
      font(48);
      text("Player " + (player + 1) + " won the game", 5, hfheight + 16);
    }
  }
}
