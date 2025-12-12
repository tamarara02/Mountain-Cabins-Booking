import { Component, inject } from '@angular/core';
import { User } from '../models/Korisnik';
import { Router } from '@angular/router';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-prijava-admin',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prijava-admin.component.html',
  styleUrl: './prijava-admin.component.css'
})
export class PrijavaAdminComponent {
  username=""
  password=""
  mistake=""
  
  user: User = new User()
  private service = inject(PrijavaRegistracijaService)
  private router = inject(Router)



  logIn(){
    this.service.logIn(this.username, this.password).subscribe(data=>{
      if(data==null){
        this.mistake="Uneti podaci su neispravni!"
      } else {
        this.mistake=""
        this.user = data
        if(this.user.type != "admin"){
          this.mistake="Nedozvoljena prijava"
        } else{
          localStorage.setItem('username', this.username);
          this.router.navigate([`/admin`], {state: {user: this.user}})
        }
      }
    });    
  }
}
