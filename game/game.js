import Sprite from '../SpriteSystem/sprite.js';
import Vector from '../Utilities/vector.js';
import {loadJSON} from '../Utilities/loadJSON.js';
import SpriteSheet from '../SpriteSystem/spriteSheet.js';
import SFX from '../Utilities/sfx.js';
import Grid from '../GridSystem/grid.js';
import Utilities from '../Utilities/utilities.js';
import MatchObject from './matchObject.js';
import MatchController from './matchController.js';
class Game{
    
    constructor(){
        const game = this;
        this.currentState = 0; // 0: ready 1:not ready
        this.canvas = document.getElementById("game");
        this.context = this.canvas.getContext("2d");
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();


        this.spriteSheets = [];

        loadJSON("myFlowers" ,function(data){
            let spriteSheet = new SpriteSheet(JSON.parse(data));
            spriteSheet.spriteImage.onload = function(){
                game.spriteSheets.push(spriteSheet);
                game.init();

            };
        });
    } 

   
    init(){
        const game = this;
        this.lastRefreshTime = Date.now();
        const cellSize = new Vector(64 ,64);
        const gridWidth = 5;
        const gridHeight = 6;

        this.grid = new Grid(gridWidth ,gridHeight, cellSize.x /2, cellSize.y /2 ,cellSize ,null);
        this.canvas.height = cellSize.y * gridHeight;
        this.canvas.width = cellSize.x * gridWidth;
       
        for(let i = 0; i < this.grid.width; i++){
            for(let j = 0; j < this.grid.heigth; j++){

                const animation =[];
                const position = new Vector(this.grid.cells[i][j].x ,this.grid.cells[i][j].y);
                const anchor = new Vector(0.5 ,0.5);
                const scale =  new Vector(0.5 ,0.5);

                const sprite = Sprite.spawn(this.canvas ,this.context ,this.spriteSheets[0] ,position ,anchor ,scale ,1 ,animation);
                this.grid.offset = sprite.offset;
                const type = Utilities.getRandomInt(0 ,this.spriteSheets[0].spriteData.frames.length - 1);
                const mathcObject = new MatchObject(sprite ,type ,this.grid.cells[i][j] ,this.grid);
                this.grid.cells[i][j].holder = mathcObject;
            }
        }      

        if ('ontouchstart' in window){
			this.canvas.addEventListener("touchstart", function(event){ game.onTap(event); });
		}else{
			this.canvas.addEventListener("mousedown", function(event){ game.onTap(event); });
		}

        this.refresh();
    }
   
    onTap(event){
        if(this.currentState != 0) return;
        const mousePos = Utilities.getMousePos(event ,this.canvas);
        MatchController.CheckMatch(mousePos ,this.grid ,this);
        this.currentState = 1;
    }

    refresh(){
        const now = Date.now();
        const dt = (now - this.lastRefreshTime) / 1000;
        this.render();
        this.lastRefreshTime = now;
        const game = this;
        requestAnimationFrame(function(){
            game.refresh();
        });
    }

    render(){
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

        for(let i = 0; i < this.grid.width; i++){
            for(let j = 0; j < this.grid.heigth; j++){
                this.grid.cells[i][j].holder.render();
            }
        }     
    }
}

document.addEventListener("DOMContentLoaded", function(event){
    const game = new Game();
})
