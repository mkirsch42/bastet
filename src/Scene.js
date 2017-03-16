import { Howl } from 'howler';

class SoundEffect {
    constructor(howl) {
        Object.assign(howl, {
            autoplay: false,
            volume: 0,
            onfade: ()=>{if(this.howl.volume() === 0) this.howl.stop();}
        });
        this.howl = new Howl(howl);
    }
    static fromJSON(json) {
        return new SoundEffect({
            src: `${process.env.PUBLIC_URL}/sounds/${json}`
        });
    }
    fade(to, ms) {
        if(to > 0 && !this.howl.playing()) {
            this.howl.play();
            this.howl.seek(0);
        }
        this.howl.fade(this.howl.volume(), to, ms);
    }
    play() {
        this.fade(1, 2000);
    }
    stop() {
        this.fade(0, 2000);
    }
}

class SoundSet {
    constructor(sounds) {
        this.sounds = sounds;
    }
    static fromJSON(json) {
        return new SoundSet(json.map(me => SoundEffect.fromJSON(me)));
    }
    apply(situation) {
        situation.vals.forEach((val, ind)=> {
            this.sounds[ind].fade(val, 2000);
        });
    }
    stopAll() {
        this.sounds.forEach((val, index, arr) => {
            val.stop();
        });
    }
}

class Situation {
    constructor(vals) {
        this.vals = vals;
    }
    static fromJSON(json) {
        return new Situation(json.vals);
    }
}

class Scene {
    constructor(name, soundset, situations) {
        this.name = name;
        this.soundset = soundset;
        this.situations = situations;
    }
    static fromJSON(json) {
        return new Scene(json.name, SoundSet.fromJSON(json.soundset), json.situations.map(me => Situation.fromJSON(me)));
    }
    play() {
        this.soundset.apply(this.situations[0]);
    }
    stop() {
        this.soundset.stopAll();
    }
}

export default Scene;
export {SoundSet, SoundEffect, Situation};