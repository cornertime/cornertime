export function randomInteger(min: number, max: number): number {
    return Math.floor(Math.random() * (max - min) + min);
}


export function randomElement<T>(items: T[]): T {
    return items[randomInteger(0, items.length)];
}
