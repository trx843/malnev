export class ValidateInputOneAttrModel {
    atrPath: string;
    atrName: string;
    elemName: string;
    startTime: Date;
    endTime: Date;

    constructor(atrPath: string, startTime: Date, endTime: Date) {
        this.atrPath = atrPath;
        this.startTime = startTime;
        this.endTime = endTime;
        this.getNames();
    }

    private getNames() {
        let arr: string[] = this.atrPath.split('|');
        if(arr.length === 0)
            return;

        this.atrName = arr[arr.length - 1];
        arr = arr.slice(0, arr.length - 1).join('|').split('\\');
        this.elemName = arr.slice(4, arr.length).join('\\');
    }
}