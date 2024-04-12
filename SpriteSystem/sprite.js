import Vector from '../Utilities/vector.js';

export default class Sprite{
    constructor(canvas ,context ,spriteSheet ,position ,anchor ,scale ,alpha ,animations){
        this.canvas = canvas;
        this.context = context;
        this.spriteSheet = spriteSheet;
        this.position = position;
        this.anchor = anchor;
        this.scale = scale;
        this.alpha = alpha;
        this.currentTime = 0;
        this.currentFrame = 0;
        this.animations = animations;
        this.degrees = 45;
    }

    setPos(vector){
        this.position.x = vector.x;
        this.position.y = vector.y;
    }
    get offset(){
        const frame = this.spriteSheet.spriteData.frames[this.currentFrame];
		const scale = this.scale;
		const w = frame.sourceSize.w;
		const h = frame.sourceSize.h;
        const x = frame.spriteSourceSize.x;
        const y = frame.spriteSourceSize.y;

        const offset = new Vector((w - x) * scale.x * this.anchor.x ,(h - y) * scale.y * this.anchor.y);
		return offset;
	}

   
    renderSingleFrame(frameNumber){
        this.context.save();
        this.currentFrame = frameNumber;
        const frame = this.spriteSheet.spriteData.frames[this.currentFrame].frame;
        const offset = this.offset;

        const x = (this.position.x )  - offset.x;
        const y = (this.position.y ) - offset.y;
        const width = frame.w * this.scale.x;
        const height = frame.h * this.scale.y;
       
        this.context.globalAlpha = this.alpha;
       
        this.context.drawImage(
            this.spriteSheet.spriteImage,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            x,
            y,
            width,
            height
        );   
        this.context.restore();
    }
    renderAnimate(animationIndex){
        const alpha = this.context.globalAlpha;
        this.context.globalAlpha = this.alpha;

        const animation = this.animations[animationIndex];

        const delta = Date.now() - this.currentTime;

       
        
        if(delta > 1000/animation.fps){
            this.currentFrame++;
            this.currentTime = Date.now();
            if( this.currentFrame == animation.frames.length){
                if(animation.loop){
                    this.currentFrame = 0;
                }else{
                    this.currentFrame =  animation.frames.length;
                }
            }
        }

        const frame = this.spriteSheet.spriteData.frames[this.currentFrame].frame;
        const offset = this.offset;

        const x = (this.position.x )  - offset.x;
        const y = (this.position.y ) - offset.y;
        const width = frame.w * this.scale.x;
        const height = frame.h * this.scale.y;

      

        this.context.drawImage(
            this.spriteSheet.spriteImage,
            frame.x,
            frame.y,
            frame.w,
            frame.h,
            x,
            y,
            width,
            height
        );   
        this.context.globalAlpha = alpha;

     }

     static spawn(context, spriteSheet ,position ,anchor ,scale ,alpha ,animation){

        const sprite = new Sprite(context ,spriteSheet ,position ,anchor ,scale ,alpha ,animation);
        return sprite;
    }
}

    