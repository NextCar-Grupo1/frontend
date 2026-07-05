import { Injectable } from '@angular/core';

declare const grecaptcha: any;

const SITE_KEY = '6LfhUf4sAAAAAEPikPEf23FDcXjvz_ld515xnAaU';

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  execute(action: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (typeof grecaptcha === 'undefined') {
        reject(new Error('reCAPTCHA no está cargado todavía.'));
        return;
      }
      grecaptcha.ready(() => {
        grecaptcha
          .execute(SITE_KEY, { action })
          .then((token: string) => resolve(token))
          .catch(reject);
      });
    });
  }
}
