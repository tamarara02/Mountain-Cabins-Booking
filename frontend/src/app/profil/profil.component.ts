import { Component, inject } from '@angular/core';
import { User } from '../models/Korisnik';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-profil',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './profil.component.html',
  styleUrl: './profil.component.css'
})
export class ProfilComponent {
  private service = inject(PrijavaRegistracijaService)
  user: User = new User;
  username: string|null = ""
  name=""
  lastname=""
  address=""
  phone=""
  mail=""
  picture=""
  card=""
  type = ""
  profilePicture = ""

  ngOnInit(){
    this.username = localStorage.getItem('username');
    if(this.username){
      console.log(this.username)
      this.service.getUser(this.username).subscribe(data=>{
        this.user = data
        this.type = this.user.type
        this.name = this.user.name
        this.lastname = this.user.lastname
        this.address = this.user.address
        this.phone = this.user.phone
        this.mail = this.user.mail
        this.picture = this.user.picture
        this.card = this.user.card
        this.profilePicture = "http://localhost:8080/img/" + this.user.picture;
        console.log(this.user.type)
      })
    } else{
      console.log("Niko nije ulogovan")
    }
  }

  
  selectedFile: File | null = null;

  updateProfile(){
    if(this.phoneError=="" && this.mailError=="" && this.cardError=="" && this.pictureError==""
      && this.username!="" &&  this.name!="" && this.lastname!="" && this.address!=""
      && this.phone!="" && this.mail!="" && this.picture!="" && this.card!=""){

        const formData = new FormData();
        formData.append('username', this.user.username);
        formData.append('password', this.user.password);
        formData.append('name', this.name);
        formData.append('lastname', this.lastname);
        formData.append('gender', this.user.gender);
        formData.append('address', this.address);
        formData.append('phone', this.phone);
        formData.append('mail', this.mail);
        formData.append('card', this.card);
        formData.append('type', this.type);

        if (this.selectedPicture) {
          formData.append('picture', this.selectedPicture); 
        } else{

        }

        this.service.updateUser(formData).subscribe(()=>{
          window.location.reload();
        });
        
    }
  }

  logOut(){
    localStorage.removeItem('username')
  }


  //--------VALIDACIJE---------
  

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
      this.cardError = '';
    } else if (mastercard.test(c)) {
      this.cardError = '';
    } else if (visa.test(c)) {
      this.cardError = '';
    } else {
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
    }
  }

}
