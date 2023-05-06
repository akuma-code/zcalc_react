export class Size {
    w: number;
    h: number;
    constructor(w: number | string, h: number | string) {

        this.w = typeof w === 'string' ? +w : w;
        this.h = typeof h === 'string' ? +h : h;
    }


}
