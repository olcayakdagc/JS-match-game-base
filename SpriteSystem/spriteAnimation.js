export default  class SpriteAnimation{
    constructor(frames, loop ,fps){
        this.frames = frames;
        this.loop = loop;
        this.fps = fps;
        this.duration = this.frames.length * (1.0 / this.fps);
    }
}