declare module 'pi-blaster.js' {
  export function setPwm(pinNumber: number, value: number, callback?: (err?: NodeJS.ErrnoException) => void): void;
  export function release(pinNumber: number, callback?: (err?: NodeJS.ErrnoException) => void): void;
}
