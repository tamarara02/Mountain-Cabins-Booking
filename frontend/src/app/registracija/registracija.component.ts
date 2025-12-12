import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';
import { Router } from '@angular/router';
import { User } from '../models/Korisnik';

@Component({
  selector: 'app-registracija',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './registracija.component.html',
  styleUrl: './registracija.component.css'
})
export class RegistracijaComponent {
  username=""
  password=""
  name=""
  lastname=""
  gender=""
  address=""
  phone=""
  mail=""
  picture='unknownuser.jpg'
  card=""
  type=""
  
  mistake=""
  private service = inject(PrijavaRegistracijaService)
  private router = inject(Router)

  
  user: User = new User()

  register(){
    if(this.passwordError=="" && this.phoneError=="" && this.mailError=="" && this.cardError=="" && this.pictureError==""
      && this.username!="" && this.password!="" && this.name!="" && this.lastname!="" && this.gender!="" && this.address!=""
      && this.phone!="" && this.mail!="" && this.picture!="" && this.card!="" && this.type!=""){

        this.mistake=""

        const formData = new FormData();
        formData.append('username', this.username);
        formData.append('password', this.password);
        formData.append('name', this.name);
        formData.append('lastname', this.lastname);
        formData.append('gender', this.gender);
        formData.append('address', this.address);
        formData.append('phone', this.phone);
        formData.append('mail', this.mail);
        formData.append('card', this.card);
        formData.append('type', this.type);

        if (this.selectedPicture) {
          formData.append('picture', this.selectedPicture); 
        } else {
          formData.append('picture', 'unknownuser.jpg'); 
        }

        this.service.register(formData).subscribe({
          next: (res) => {
            console.log('Uspešno registrovan:', res);
            this.user.username = this.username
            this.user.password = this.password
            localStorage.setItem('username', this.username);
            alert("Zahtev za registraciju je uspešno napravljen! Moći ćete da se prijavite kada bude obradjen!")
            //this.router.navigate([`/${this.type}`], {state: {user: this.user}})
            this.router.navigate([''])
          },
          error: (err) => {
            console.error('Greška pri registraciji:', err);
            if (err.error && typeof err.error === 'string') {
              this.mistake = err.error;
            } else if (err.error && err.error.message) {
              this.mistake = err.error.message;
            } else {
              this.mistake = 'Došlo je do greške pri registraciji.';
            }
          }
        });
        
    } else{
      this.mistake="Unesite ispravne podatke!";
    }
  }


//------------------VALIDACIJE------------------
  passwordError=""
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
    const pw = this.password;
    const re = /^(?=[A-Za-z])(?=.*[A-Z])(?=(?:.*[a-z]){3,})(?=.*\d)(?=.*[\W_])[A-Za-z\d\W_]{6,10}$/;
    if (!re.test(pw)) {
      this.passwordError = "Lozinka mora imati 6-10 karaktera, počinje slovom, 1 veliko slovo, 3 mala slova, 1 broj i 1 specijalni karakter.";
    } else {
      this.passwordError = '';
    }
  }

  phoneError = '';
  phoneTouched = false;
  onPhoneBlur() {
    this.phoneTouched = true;
    this.validatePhone();
  }
  onPhoneInput() {
    if (this.phoneTouched) {
      this.validatePhone();
    }
  }
  validatePhone() {
    const phone = this.phone;
    const re = /^\+?\d{9,12}$/;
    if (!re.test(phone)) {
      this.phoneError = "Telefon mora sadržati samo cifre, bez razmaka i znakova, 9-12 cifara.";
    } else {
      this.phoneError = '';
    }
  }

  mailError = '';
  mailTouched = false;
  onMailBlur() {
    this.mailTouched = true;
    this.validateMail();
  }
  onMailInput() {
    if (this.mailTouched) {
      this.validateMail();
    }
  }
  validateMail() {
    const mail = this.mail;
    const re = /^[a-zA-Z0-9]+([._+-]?[a-zA-Z0-9]+)*@[a-zA-Z0-9-]+(\.[a-zA-Z]{2,})+$/;
    if (!re.test(mail)) {
      this.mailError = "Unesite validnu e-mail adresu.";
    } else {
      this.mailError = '';
    }
  }

  cardError = "";
  cardType: string | null = null;
  cardImage: string | null = null;
  cardTouched = false;
  onCardBlur() {
    this.cardTouched = true;
    this.validateCard();
  }
  onCardInput() {
    if (this.cardTouched) {
      this.validateCard();
    }
  }
  validateCard() {
    const c = this.card.replace(/\s+/g, ''); // ukloni sve razmake
    const diners = /^(300|301|302|303|36|38)\d{12}$/;
    const mastercard = /^5[1-5]\d{14}$/;
    const visa = /^(4539|4556|4916|4532|4929|4485|4716)\d{12}$/;
    if (diners.test(c)) {
      this.cardType = 'diners';
      this.cardError = '';
    } else if (mastercard.test(c)) {
      this.cardType = 'mastercard';
      this.cardError = '';
    } else if (visa.test(c)) {
      this.cardType = 'visa';
      this.cardError = '';
    } else {
      this.cardType = null;
      if (this.cardTouched) {
        this.cardError = 'Neispravan broj kartice';
      } else {
        this.cardError = '';
      }
    }
  }

  pictureError= '';
  selectedPicture: File | null = null;
  selectedPictureName: string = '';

  onFileSelected(event: any) {
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];

      // Proveri tip fajla
      const allowedTypes = ['image/jpeg', 'image/png'];
      if (!allowedTypes.includes(file.type)) {
        this.pictureError = 'Dozvoljeni formati su JPG i PNG.';
        this.selectedPicture = null;
        this.selectedPictureName = "";
        return;
      }

      // Proveri veličinu slike
      const img = new Image();
      img.onload = () => {
        if (img.width < 100 || img.height < 100) {
          this.pictureError = 'Slika je premala (minimum 100x100px).';
          this.selectedPicture = null;
          this.selectedPictureName = "";
        } else if (img.width > 300 || img.height > 300) {
          this.pictureError = 'Slika je prevelika (maksimum 300x300px).';
          this.selectedPicture = null;
          this.selectedPictureName = "";
        } else {
          //slika prihvaćena
          this.pictureError = '';
          this.selectedPicture = file;
          this.selectedPictureName = file.name;
          this.picture = this.selectedPictureName;
        }
      };
      img.onerror = () => {
        this.pictureError = 'Ne može se učitati slika.';
        this.selectedPicture = null;
        this.selectedPictureName = "";
      };
      img.src = URL.createObjectURL(file);
    } else {
      // Nije izabrana nijedna slika, koristi se default
      this.pictureError = '';
      this.selectedPicture = null;
      this.selectedPictureName = "";
      this.picture ='../../../public/img/unknownuser.jpg'

      fetch('../../../public/img/unknownuser.jpg')
        .then(res => res.blob())
        .then(blob => {
          this.selectedPicture = new File([blob], 'unknownuser.jpg', { type: blob.type });
          this.picture = 'unknownuser.jpg';
        })
        .catch(() => {
          this.selectedPicture = null;
          this.selectedPictureName = "";
        });
    }
  }

    
}
