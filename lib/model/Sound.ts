export class Sound {

    audio: any;

    constructor(src:string) {
    //    this.ready = false;
      //  this.src = src;

        this.audio = (new Audio(src));
        this.audio.currentTime = 0;
    }

    play = (/** number */vol) => {
        //if (this.ready) {

        this.audio.currentTime = 0;
        this.audio.volume = vol || 1;
        return this.audio.play();

    };
}
