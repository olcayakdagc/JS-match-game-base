export default class SFX{
    constructor(context , source ,loop){
        this.context = context;
        this.src = source;
        this.loop = loop;
        this.gainNode = this.context.createGain();
        this.gainNode.gain.setValueAtTime(1, this.context.currentTime);
        this.gainNode.connect(this.context.destination);
        this.buffer = null;

        let codec;
        
        for(let prop in this.src){
            if(prop == "webm" && SFX.supportsVideoType(prop)){
                codec = prop;
                break;
            }
            if(prop == "mp3"){
                codec = prop;
            }
        }

        if(codec != undefined){
            this.url = this.src[codec];
            this.load(this.url);
        }else{
            console.warn("Browser does not support any of the supplied audio files!");
        }
    }
    static supportsVideoType(type){
        let video;
        let formats ={
            ogg: 'video/ogg; codecs="theora"',
            h264: 'video/mp4; codecs="avc1.42E01E"',
            webm: 'video/webm; codecs="vp8, vorbis"',
            vp9: 'video/webm; codecs="vp9"',
            hls: 'application/x-mpegURL; codecs="avc1.42E01E"'
        }
        if(!video) video = document.createElement('video');

        return video.canPlayType(formats[type] || type);
    }
    load(url){
        const request = new XMLHttpRequest();
        request.open("GET", url ,true);
        request.responseType = "arraybuffer";

        const sfx = this;

        request.onload = function(){
            sfx.context.decodeAudioData(
                request.response,
                function(buffer){
                    if(!buffer){
                        console.error('Decode Error');
                        return;
                    }
                    sfx.buffer = buffer;
                },
                function(error){
                    console.error('decodeAudioData error',error);
                }
            );
        }
        request.onerror = function(){
            console.error('SFX XHR error');
        }

        request.send();
    }
    play(){
        this.context.resume();
        if (this.source!=undefined) this.source.stop();
		this.source = this.context.createBufferSource();
		this.source.loop = this.loop;
	  	this.source.buffer = this.buffer;
	  	this.source.connect(this.gainNode);
		this.source.start(0);
    }
}