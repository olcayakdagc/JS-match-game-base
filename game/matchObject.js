import Vector from "../Utilities/vector.js";
import Utilities from '../Utilities/utilities.js';

export default class MatchObject{
    constructor(sprite ,type ,cell ,grid){
        this.grid = grid;

        this.sprite = sprite;
        this.type = type;
        this.cell = cell;
        this.animationInterval;
        this.currentState = 0;  // 0 = ready 1 = matched 2 = animation
    }
    render(){
        this.sprite.renderSingleFrame(this.type);
    }   

    movePosition(vector){
        this.animationInterval = setInterval(() => this.movePositionAnim(vector), 10);
        this.currentState = 2;
    }
    movePositionAnim(vector){
        const addedVector = new Vector((vector.x - this.sprite.position.x) * 0.1 ,(vector.y - this.sprite.position.y) * 0.1);
        this.sprite.position= this.sprite.position.add(addedVector);

        if(vector.distance(this.sprite.position) < 1){
            this.sprite.setPos(vector)
            this.currentState = 0;
            clearInterval(this.animationInterval);
        }
    }

    changeType(){
        const type = Utilities.getRandomInt(0 ,this.sprite.spriteSheet.spriteData.frames.length - 1);
        this.currentState = 2;

        this.animationInterval = setInterval(() => this.changeAnimation(type), 10);
    }
    changeAnimation(type){
        this.sprite.scale = this.sprite.scale.add(new Vector(-0.1 ,-0.1));
        if(this.sprite.scale.x <= 0.1){
            clearInterval(this.animationInterval);

            this.animationInterval = setInterval(() => this.changeAnimationPhase2(), 10);          
        }
    }
    changeAnimationPhase2(){
        this.sprite.scale = this.sprite.scale.add(new Vector(0.1 ,0.1));
        if(this.sprite.scale.x >= 0.5){
            clearInterval(this.animationInterval);
            this.currentState = 0;
        }
    }
    wrongMatch(){
        this.currentState = 2;

        this.animationInterval = setInterval(() => this.wrongMatchAnimation(), 10);
    }

    matched(){
        this.currentState = 1;
        const scale = new Vector(this.sprite.scale.x ,this.sprite.scale.y);
        this.animationInterval = setInterval(() => this.matchAnimation(scale), 10);
    }
    
    matchAnimation(scale){
        this.sprite.scale = this.sprite.scale.add(new Vector(-0.1 ,-0.1));
        if(this.sprite.scale.x <= 0.1){
            clearInterval(this.animationInterval);
            this.sprite.setPos(new Vector(this.cell.x ,this.cell.y - (this.grid.cellSize.y * (this.cell.gridPos.y + 1))));

            new Promise(resolve => setTimeout(resolve, 500)).then(() => { this.sprite.scale = scale; });
          
        }
    }
    wrongMatchAnimation(){
        this.sprite.scale = this.sprite.scale.add(new Vector(-0.025 ,-0.025));
        if(this.sprite.scale.x <= 0.2){
            clearInterval(this.animationInterval);
            this.animationInterval = setInterval(() => this.wrongMatchAnimationPhase2(), 10);
        }
    }
    wrongMatchAnimationPhase2(){
        this.sprite.scale = this.sprite.scale.add(new Vector(0.1 ,0.1));
        if(this.sprite.scale.x >= 0.4){
            clearInterval(this.animationInterval);
            this.currentState = 0;
        }
    }
}