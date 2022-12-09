import { Observer } from 'rxjs';

export class DevTools {

  static getLogObserver(message: string): Observer<any> {
    return {
      next: data => console.log(`[next ${message}]`, data),
      error: err => console.log(`[error ${message}]`, err),
      complete: () => console.log(`[complete ${message}]`)
    }
  }

  constructor() { }
}
