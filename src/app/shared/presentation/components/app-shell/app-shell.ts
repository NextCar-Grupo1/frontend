import { BreakpointObserver } from '@angular/cdk/layout';
import { CommonModule } from '@angular/common';
import { Component, DestroyRef, inject, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { SessionService } from '../../../../identity-access/application/session.service';
import { MATERIAL_IMPORTS } from '../../material/material-imports';

interface NavItem {
  label: string;
  icon: string;
  route: string;
}

@Component({
  selector: 'app-shell',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive, ...MATERIAL_IMPORTS],
  templateUrl: './app-shell.html',
  styleUrl: './app-shell.scss'
})
export class AppShell {
  private readonly destroyRef = inject(DestroyRef);
  private readonly breakpointObserver = inject(BreakpointObserver);
  private readonly router = inject(Router);
  private readonly session = inject(SessionService);
  readonly isMobile = signal(false);
  readonly user = this.session.currentUser;

  readonly navItems: NavItem[] = [
    { label: 'Dashboard', icon: 'dashboard', route: '/dashboard' },
    { label: 'Simulador', icon: 'calculate', route: '/simulator' },
    { label: 'Mis creditos', icon: 'account_balance_wallet', route: '/credits' },
    { label: 'Mi perfil', icon: 'person', route: '/profile' },
    { label: 'Soporte', icon: 'support_agent', route: '/support' }
  ];

  constructor() {
    this.breakpointObserver
      .observe('(max-width: 900px)')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((state) => this.isMobile.set(state.matches));
  }

  logout(): void {
    this.session.logout();
    this.router.navigateByUrl('/auth/login');
  }
}
