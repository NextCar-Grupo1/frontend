import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    grecaptcha?: {
      ready(callback: () => void): void;
      execute(siteKey: string, options: { action: string }): Promise<string>;
    };
  }
}

@Injectable({ providedIn: 'root' })
export class RecaptchaService {
  private scriptLoad?: Promise<void>;

  execute(action: string): Promise<string> {
    const siteKey = environment.recaptchaSiteKey;
    if (!siteKey) {
      return Promise.resolve('');
    }

    return this.loadScript(siteKey).then(
      () =>
        new Promise<string>((resolve, reject) => {
          const grecaptcha = window.grecaptcha;
          if (!grecaptcha) {
            reject(new Error('reCAPTCHA no esta disponible.'));
            return;
          }

          grecaptcha.ready(() => {
            grecaptcha
              .execute(siteKey, { action })
              .then(resolve)
              .catch(reject);
          });
        }),
    );
  }

  private loadScript(siteKey: string): Promise<void> {
    if (window.grecaptcha) {
      return Promise.resolve();
    }

    if (this.scriptLoad) {
      return this.scriptLoad;
    }

    this.scriptLoad = new Promise<void>((resolve, reject) => {
      const script = document.createElement('script');
      script.src = `https://www.google.com/recaptcha/api.js?render=${encodeURIComponent(siteKey)}`;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error('No se pudo cargar reCAPTCHA.'));
      document.head.appendChild(script);
    });

    return this.scriptLoad;
  }
}
