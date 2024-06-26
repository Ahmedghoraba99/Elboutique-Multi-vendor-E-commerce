import { Component } from '@angular/core';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-check-mail',
  standalone: true,
  imports: [],
  templateUrl: './check-mail.component.html',
  styleUrl: './check-mail.component.css',
})
export class CheckMailComponent {
  needActivation = sessionStorage.getItem('needactivation');
  needReset = sessionStorage.getItem('needReset');
  message!: string;
  constructor(private authService: AuthService) {}
  ngOnInit(): void {
    if (this.needActivation) {
      this.message = `You have successfully completed the registration.
         The only remaining step is to verify the account via email.
          Please check your email to activate the account.`;
    } else if (this.needReset) {
      this.message = `We sent a message to your email to help you reset your password.
       Please check your inbox.
      `;
    }
  }

  ngOnDestroy(): void {}
}
