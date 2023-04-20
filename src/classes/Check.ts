import { IConstructor } from "../interfaces";

export class Check {
    public static intanceOf<T extends object>(obj: object, ctor: IConstructor<T>): boolean {
        let objKeys = JSON.stringify(Object.keys(obj).sort());
        let myKeys = JSON.stringify(Object.keys(new ctor()).sort());
        return objKeys === myKeys;
    }

    public static fromObject<T extends object>(obj: object, ctor: IConstructor<T>): T {
        return Object.assign(new ctor(), obj);
    }
}