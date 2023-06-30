export function mFn_100<T extends number, K extends keyof Pick<Math, 'floor' | 'round' | 'ceil'>>(fnKey: K, args: T): number;
export function mFn_100<T extends number, K extends keyof Pick<Math, 'floor' | 'round' | 'ceil'>>(fnKey: K, ...args: T[]): number[];
export function mFn_100<T extends number, K extends keyof Pick<Math, 'floor' | 'round' | 'ceil'>>(fnKey: K, ...args: T[]) {
    const mathFn = Math[fnKey];
    if (!Array.isArray(args))
        return mathFn(args * 100) / 100;

    const scaled = args.map(c => c * 100)
        .map(mathFn)
        .map(c => c / 100);

    return scaled;
}
