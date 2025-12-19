import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-splash-screen',
  templateUrl: './splash-screen.component.html',
  styleUrls: ['./splash-screen.component.scss'],
  standalone: false,

})
export class SplashScreenComponent implements OnInit {
  constructor(private router: Router) {}

ngOnInit() {
  setTimeout(() => {
    this.router.navigate(['/login'], {
      state: { fromSplash: true },
      replaceUrl: true,     // 🔴 This removes splash from history
    });
  }, 3000);
}

}