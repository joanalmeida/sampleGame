//Super duper test of git functions and commits

KEY_CODES = {
  37: 'left',
  38: 'up',
  39: 'right',
  40: 'down'
}

KEY_STATUS = {};
for (code in KEY_STATUS) {
  KEY_STATUS[KEY_CODES[code]] = false;
}

document.onkeydown = function (e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;

  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
}

document.onkeyup = function (e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;

  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
}

/**
 * Define a singleton object to hold all the game images
 */
var imageRepository = new function() {
  // Define images
  this.background = new Image();
  this.character = new Image();

  var numImages = 2;
  var numLoaded = 0;
  function imageLoaded() {
    numLoaded++;
    if (numLoaded === numImages) {
      window.init();
    }
  }
  this.background.onload = function () {
    imageLoaded();
  }
  this.character.onload = function () {
    imageLoaded();
  }

  // Set images source
  this.background.src = 'img/gbg.jpg';
  this.character.src = 'img/sm.png';
}

function Drawable() {
  this.init = function(x, y) {
    this.x = x;
    this.y = y;
  };

  this.speed = 0;
  this.canvasWidth = 0;
  this.canvasHeight = 0;

  this.draw = function() {
  };
}

function Background() {
  this.draw = function() {
    this.context.drawImage(imageRepository.background, this.x, this.y);
  }
}

Background.prototype = new Drawable();

function Character() {
  this.facing = "right";
  this.jumping = false;
  this.jumpSpeed = 10;
  this.speed = 4;

  this.init = function(destX, destY, destW, destH) {
    this.x = destX;
    this.y = destY;
    this.width = destW;
    this.height = destH;
    this.lastUpdated = 0;
    this.frameTime = 70;
  }

  this.draw = function(srcX, srcY, srcW, srcH) {
    this.srcX = srcX;
    this.srcY = srcY;
    this.srcW = srcW;
    this.srcH = srcH;
    this.context.drawImage(imageRepository.character, srcX, srcY, srcW, srcH,
     this.x, this.y, this.width, this.height);
  }

  this.move = function() {
    this.currentTime = Date.now();

    if (this.currentTime - this.lastUpdated > this.frameTime) {
      this.lastUpdated = this.currentTime;
      if (KEY_STATUS.left || KEY_STATUS.right ||
        KEY_STATUS.down || KEY_STATUS.up) {
        // Erase the character so we can redraw him in a new position
        this.context.clearRect(this.x, this.y, this.width, this.height);

        // Update x and y coordinates based on the user's input
        // and redraw the character

        // Left Key
        if (KEY_STATUS.left) {
          this.left = true;
          if (this.facing === "right") {
            this.facing = "left";
            this.srcX = 181;
          } else {
            if (!this.jumping) {
              if (this.srcX === 91) {
                this.srcX = 151;
              } else {
                this.srcX -= 30;
              }
            }
            this.x -= this.speed;
            if (this.x <= 0) { //---> Keep user inside the screen
              this.x = 0;
            }
          }
        }

        // Right Key
        if (KEY_STATUS.right) {
          this.right = true;
          if (this.facing === "left") {
            this.facing = "right";
            this.srcX = 211;
          } else {
            if (!this.jumping) {
              if (this.srcX === 301) {
                this.srcX = 241;
              } else {
                this.srcX += 30;
              }
            }
            this.x += this.speed;
            if (this.x >= this.canvasWidth - this.width) {
              this.x = this.canvasWidth - this.width;
            }
          }
        }

        // Down Key
        if (KEY_STATUS.down) {
          this.y += this.speed;
          if (this.y >= this.canvasHeight - this.height) {
            this.y = this.canvasHeight - this.height;
          }
        }

        // Up Key
        if (KEY_STATUS.up) {
          if (this.jumping) {
            if (this.y >= 373) {
              this.y = 373;
              this.jumpSpeed = 10;
              this.jumping = false;
              if (this.facing === "right") {
                this.srcX = 211;
              } else {
                this.srcX = 181;
              }
            } else {
              this.y -= this.jumpSpeed;
              if (this.y <= 0) { //---> Keep user inside the screen
                this.y = 0;
              }
              this.jumpSpeed -= 1;
            }
          } else {
            this.jumping = true;
            if (this.facing === "right") {
              this.srcX = 359;
            } else {
              this.srcX = 29;
            }
            this.y -= this.jumpSpeed;
            if (this.y <= 0) { //---> Keep user inside the screen
              this.y = 0;
            }
            this.jumpSpeed -= 1;
          }
        }

        // Redraw the character
        this.draw(this.srcX, this.srcY, this.srcW, this.srcH);
      }

      // Check if key was released
      if (!KEY_STATUS.right && this.right) {
        if (!this.jumping) {
          this.right = false;
          this.srcX = 211;

          // Redraw the character
          this.draw(this.srcX, this.srcY, this.srcW, this.srcH);
        }
      }

      if (!KEY_STATUS.left && this.left) {
        if (!this.jumping) {
          this.left = false;
          this.srcX = 181;

          // Redraw the character
          this.draw(this.srcX, this.srcY, this.srcW, this.srcH);
        }
      }

      if (!KEY_STATUS.up && this.jumping) {
        // Erase the character so we can redraw him in a new position
        this.context.clearRect(this.x, this.y, this.width, this.height);

        if (this.y >= 373) {
          this.y = 373;
          this.jumpSpeed = 10;
          this.jumping = false;
          if (this.facing === "right") {
            this.srcX = 211;
          } else {
            this.srcX = 181;
          }
        } else {
          this.y -= this.jumpSpeed;
          if (this.y <= 0) { //---> Keep user inside the screen
            this.y = 0;
          }
          this.jumpSpeed -= 1;
        }

        // Redraw the character
        this.draw(this.srcX, this.srcY, this.srcW, this.srcH);
      }
    }
  }
}

Character.prototype = new Drawable();

function Game() {
  // Character start position coordinates
  var charStartX = 100;
  var charStartY = 373;
  this.init = function() {
    this.bgCanvas = document.getElementById('background');
    this.charCanvas = document.getElementById('character');

    if (this.bgCanvas.getContext) {
      this.bgContext = this.bgCanvas.getContext('2d');
      this.charContext = this.charCanvas.getContext('2d');

      // Initialize objects to contain their canvas and context info
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;

      Character.prototype.context = this.charContext;
      Character.prototype.canvasWidth = this.charCanvas.width;
      Character.prototype.canvasHeight = this.charCanvas.height;

      // Initialize the background object
      this.background = new Background();
      this.background.init(0, 0);

      // Initialize the character object
      this.character = new Character();

      // Set the initial position of the character
      this.character.init(charStartX, charStartY, 17, 16);
      return true;
    } else {
      return false;
    }
  }

  this.start = function() {
    this.character.draw(211, 0, 17, 16);
    animate();
  };
}

function animate() {
  requestAnimFrame( animate );
  game.background.draw();
  game.character.move();
}

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       || 
      window.webkitRequestAnimationFrame || 
      window.mozRequestAnimationFrame    || 
      window.oRequestAnimationFrame      || 
      window.msRequestAnimationFrame     || 
      function(/* function */ callback, /* DOMElement */ element){
        window.setTimeout(callback, 1000 / 60);
      };
})();

var game = new Game();

function init() {
  if(game.init()) {
    game.start();
  }
}