export default class SpriteSheet{
    constructor(JSONData){
        this.spriteData = JSONData;
        this.spriteImage = new Image();
        this.spriteImage.src = JSONData.meta.image;
    }
}