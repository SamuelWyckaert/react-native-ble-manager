import { Capteur } from "./Capteur";

export class BleSingleton {

    capteurList : Capteur[]


    // 1000 => 1 par seconde : OK (on reste vers 62 trames/s)
    // 250 => 4 par seconde : OK (on reste vers 62 trames/s)

    // 50 => 20 par seconde : NOK (on est vers 10 - 15 trames/s, ce qui delay trop l'acquisition de données)
    public static MAXIMUM_TICK = 250;

    private static instance: BleSingleton;

    private constructor() { 
        this.capteurList = [];
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

    public capteur(name : string): Capteur | undefined {
        return BleSingleton.get().capteurList.find((capteur) => capteur.name === name);
    }


    public addCapteur(capteur : Capteur) {
        BleSingleton.get().capteurList.push(capteur);
    }


}