import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../service/auth.service';

@Component({
  selector: 'app-congs',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './congs.component.html',
  styleUrl: './congs.component.css',
})
export class CongsComponent implements OnInit {
  public show: boolean = false;
  constructor(private authService: AuthService, private router: Router) {
    const token: any = this.getParams('token');
    const link: any = this.getParams('link');
    this.authService.verification(link, token).subscribe(
      (data) => {
        this.show = true;
        sessionStorage.removeItem('needactivation');
        console.log(data);
      },
      (error) => {
        sessionStorage.removeItem('needactivation');
        this.router.navigateByUrl('/');
      }
    );
  }
  ngOnInit(): void {}

  getParams(param: string) {
    const searchBarParams = new URLSearchParams(window.location.search);
    return searchBarParams.get(param);
  }
}
