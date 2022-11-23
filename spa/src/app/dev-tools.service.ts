import { Injectable } from '@angular/core';
import { Observer } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DevToolsService {

  static getLogObserver(message: string): Observer<any> {
    return {
      next: data => console.log(`[next ${message}]`, data),
      error: err => console.log(`[error ${message}]`, err),
      complete: () => console.log(`[complete ${message}]`)
    }
  }

  constructor() { }
}
