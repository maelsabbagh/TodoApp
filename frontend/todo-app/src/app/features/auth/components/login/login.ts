import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { SocialLoginModule, SocialAuthService, GoogleSigninButtonModule } from '@abacritt/angularx-social-login';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, SocialLoginModule, GoogleSigninButtonModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class LoginComponent implements OnInit {
  errorMessage: string = '';

  constructor(
    private socialAuthService: SocialAuthService,
    private authService: AuthService,
    private router: Router
  ) {}

ngOnInit(): void {
  this.socialAuthService.authState.subscribe(socialUser => {
    if (socialUser?.idToken) {
      this.authService.login(socialUser.idToken).subscribe({
        next: () => this.router.navigate(['/']),
        error: () => this.errorMessage = 'Login failed. Please try again.'
      });
    }
  });
}
}