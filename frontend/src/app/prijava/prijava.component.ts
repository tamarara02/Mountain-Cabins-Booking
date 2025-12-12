import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '../models/Korisnik';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-prijava',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './prijava.component.html',
  styleUrl: './prijava.component.css'
})
export class PrijavaComponent {
  username=""
  password=""
  mistake=""
  
  user: User = new User()
  private service = inject(PrijavaRegistracijaService)
  private router = inject(Router)



  logIn(){
    this.service.check(this.username).subscribe({
      next: (res) => {
        this.service.logIn(this.username, this.password).subscribe({
          next: (data) => {
            this.mistake = "";
            this.user = data;
            if (this.user.type === "admin") {
              this.mistake = "Nedozvoljena prijava!";
            } else {
              localStorage.setItem('username', this.username);
              this.router.navigate([`/${this.user.type}`], { state: { user: this.user } });
            }
          },
          error: (err) => {
            if (err.status === 401) {
              this.mistake = "Uneti podaci su neispravni!";
            } else {
              this.mistake = "Došlo je do greške pri prijavi!";
            }
          }
        });
      },
      error: (err) => {
        console.error('Greška pri proveri korisnika:', err);
        if (err.error && typeof err.error === 'string') {
        this.mistake = err.error;
      } else {
        this.mistake = "Došlo je do greške pri proveri korisnika!";
      }
      }
    });
      
  }
}
