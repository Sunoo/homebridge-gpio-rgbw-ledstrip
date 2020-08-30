declare module 'pi-blaster.js' {
  export function setPwm(pinNumber: number, value: number, callback?: (err?: string) => void): void;
  export function release(pinNumber: number, callback?: (err?: string) => void): void;
}
