import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/Korisnik';

@Component({
  selector: 'app-turista',
  standalone: true,
  imports: [],
  templateUrl: './turista.component.html',
  styleUrl: './turista.component.css'
})
export class TuristaComponent {
  private router = inject(Router)
  private navig = this.router.getCurrentNavigation()
  user: User = new User()
  username = ""

  ngOnInit(): void{
    if(this.navig?.extras?.state){
      this.user = this.navig.extras.state['user']
      this.username = this.user.username
    }
    console.log(this.username)
    this.router.navigate(["/profil"])
  }

  logOut(){
    localStorage.removeItem('username');
  }
}
