import { Component, inject } from '@angular/core';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';
import { User } from '../models/Korisnik';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-promena-lozinke',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './promena-lozinke.component.html',
  styleUrl: './promena-lozinke.component.css'
})
export class PromenaLozinkeComponent {
  private serviceUser = inject(PrijavaRegistracijaService)
  user: User = new User()
  username: string | null = ""
  type: string = ""
  password=""
  password1=""
  password2=""
  mistake=""
  
  ngOnInit(): void{
    this.username = localStorage.getItem('username');
    if(this.username){
      console.log(this.username)
      this.serviceUser.getUser(this.username).subscribe(data=>{
      this.user = data
      this.type = this.user.type
      console.log(this.user.type)
      })
    } else{
      console.log("Niko nije ulogovan")
    }
  }

  changePass(){
    if(this.password1 === this.password){
        this.mistake = "Nova lozinka se mora razlikovati od stare lozinke.";
        return;
    } else if(this.password1 != this.password2){
      this.mistake="Lozinke se ne poklapaju."
    } else{
      this.mistake=""
      this.validatePassword()
    }
    if(this.mistake==""){
      this.serviceUser.changeUserPass(this.user.username, this.password, this.password1).subscribe({
        next: (data: string) => {
          alert(data);
          this.password=""
          this.password1=""
          this.password2=""
        },
        error: (err) => {
          console.error(err);
          if (typeof err.error === 'string') {
            this.mistake = err.error;
          } else if (err.error?.message) {
            this.mistake = err.error.message;
          } else {
            this.mistake = "Došlo je do greške!";
          }
        }
      });

    }
    
  }

  passwordTouched = false;
  onPasswordBlur() {
    this.passwordTouched = true;
    this.validatePassword();
  }
  onPasswordInput() {
    if (this.passwordTouched) {
      this.validatePassword();
    }
  }
  validatePassword() {
    const pw = this.password1;
    const re = /^(?=[A-Za-z])(?=.*[A-Z])(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,10}$/;
    if (!re.test(pw)) {
      this.mistake = "Nova lozinka mora imati 6-10 karaktera, počinje slovom, 1 veliko slovo, 3 mala slova, 1 broj i 1 specijalni karakter.";
    } else {
      this.mistake = '';
    }
  }

  logOut(){
    localStorage.removeItem('username');
  }
}
