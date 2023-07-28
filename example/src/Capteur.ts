import { BleSingleton } from "./BleSingleton";

export class Capteur {

    name : string
    id : string

    nbTrames : number;
    value : number[];
    start : number;
    update : number;
    callback : Function;

    constructor(name : string, id : string) {

        this.nbTrames = 0;
        this.value = [];
        this.start = 0;
        this.update = 0;
        this.callback = () => {};
        this.name = name;
        this.id = id;
    }

    public setId(id : string) {
        this.id = id;
    }

    public setValue(value : number[]) {
        this.value = value;
        this.addTrames()
        if(this.update === 0 || Date.now() - this.update > BleSingleton.MAXIMUM_TICK) {
            this.update = Date.now();
            this.callback();
        }

        


    }

    public addTrames() {
        this.nbTrames = this.nbTrames + 1;
        if(this.nbTrames === 1) {
            this.start = Date.now();
        }
         // console.log("Capteur " + this.index + " : " + this.value + " - " + this.nbTrames/((Date.now() - this.start)/1000) + " trames/s")
    }

    public getTramesPerSecond() : number {
        return this.nbTrames/((Date.now() - this.start)/1000);
    }







}