import { Capteur } from "./Capteur";

export class BleSingleton {

    capteurList : Capteur[]


    // 1000 => 1 par seconde : OK (on reste vers 62 trames/s)
    // 250 => 4 par seconde : OK (on reste vers 62 trames/s)

    // 50 => 20 par seconde : NOK (on est vers 10 - 15 trames/s, ce qui delay trop l'acquisition de données)
    public static MAXIMUM_TICK = 250;

    public NAMES = [
        'EMIL-FDC6',
        'EMIL-FA96',
        'EMIL-FAC2',
        'EMIL-FE1E',
        'EMIL-FE06',
        'EMIL-A2D2'
    ]


    private static instance: BleSingleton;

    private constructor() { 
        this.capteurList = [];

        for(let i = 0; i < 6; i++) {
            this.capteurList.push(new Capteur(this.NAMES[i]));
        }
        
    }

    public static get(): BleSingleton {
        if (!BleSingleton.instance) {
            BleSingleton.instance = new BleSingleton();
        }

        return BleSingleton.instance;
    }

    public capteurById(id : string): Capteur | undefined {
        return BleSingleton.get().capteurList.find((capteur) => capteur.id === id);
    }

    public capteur(name : string): Capteur {
        return this.capteurList[this.NAMES.indexOf(name)];
    }


}