import { CommonModule, DatePipe } from '@angular/common';
import { AfterViewInit, Component, inject } from '@angular/core';
import { FormBuilder, FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TuristaService } from '../services/turista.service';
import { Cottage } from '../models/Vikendica';
import { User } from '../models/Korisnik';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';
import { Reservation } from '../models/Rezervacija';
import { CotComment } from '../models/Komentar';
import * as L from 'leaflet';

@Component({
  selector: 'app-vikendica',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './vikendica.component.html',
  styleUrl: './vikendica.component.css'
})
export class VikendicaComponent implements AfterViewInit{
  private tservice = inject(TuristaService)
  private uservice = inject(PrijavaRegistracijaService)

  cottageid: any=0
  cottage: any = null;
  username: any=""
  user: User = new User
  activePictureIndex = 0;

  reservation: Reservation = new Reservation
  message=""
  comments: CotComment[] = [];
  map!:L.Map
  


  ngOnInit(){
    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
    this.cottageid = localStorage.getItem("cottage")
    this.tservice.getCottage(this.cottageid).subscribe(data => {
      if(data!=null){
        this.cottage = data;
        setTimeout(() => this.waitForMapDiv(), 0);
      }
    });
    this.username = localStorage.getItem("username")
    this.uservice.getUser(this.username).subscribe(data=>{
      if(data!=null){
        this.user = data
        this.cardNumber = this.user.card
        this.validateCard()
      }
    })
    this.tservice.comments(this.cottageid).subscribe(data=>{
      if(data!=null){
        this.comments = data
      }
    })
  }

  ngAfterViewInit(): void {
    
  }
  waitForMapDiv() {
    const interval = setInterval(() => {
      const mapDiv = document.getElementById('map');
      if (mapDiv) {
        clearInterval(interval);
        this.initMap();
      }
    }, 50); // proverava svakih 50ms
  }
  initMap() {
    this.map = L.map('map', {
      center: [ this.cottage.coord_x, this.cottage.coord_y ],
      zoom: 13
    });

    const tiles = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 18,
      minZoom: 3,
      attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    });
    tiles.addTo(this.map);

    L.marker([this.cottage.coord_x, this.cottage.coord_y])
    .addTo(this.map)
    .bindPopup(`<b>${this.cottage.name}</b><br>Planinska vikendica`)
    .openPopup();
  }

  

  submitBooking() {
  console.log('Rezervacija:', {
    tourist: this.user.username,
    cottageid: this.cottageid,
    startDate: this.startDate,
    endDate: this.endDate,
    adults: this.adults,
    children: this.children,
    cardNumber: this.cardNumber,
    notes: this.notes
  });

  this.reservation.tourist = this.user.username
  this.reservation.cottageid = this.cottageid
  this.reservation.startDate = this.startDate
  this.reservation.endDate = this.endDate
  this.reservation.adults = this.adults
  this.reservation.children = this.children
  this.reservation.cardNumber = this.cardNumber
  this.reservation.notes = this.notes
  
  this.tservice.bookCottage(this.reservation).subscribe({
          next: (res) => {
            console.log('Uspešno bukirano:', res);
            this.message=""
            alert("Datumi su uspešno bukirani!")
            this.bookingStep = 1;
            this.startDate = '';
            this.endDate = '';
            this.adults = 1;
            this.children = 0;
            this.cardNumber = '';
            this.notes = '';
          },
          error: (err) => {
            console.error('Greška pri bukiranju:', err);
            this.message = err.error;
          }
        });
}

  //------------------OCENE VIKENDICA--------------------

  getStars(avg: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= Math.floor(avg));  // puni koliko treba
    }
    return stars;
  }

  //------------GALERIJA SLIKA-----------

  nextPicture() {
    if (!this.cottage) return;
    this.activePictureIndex = (this.activePictureIndex + 1) % this.cottage.pictures.length;
  }

  prevPicture() {
    if (!this.cottage) return;
    this.activePictureIndex =
      (this.activePictureIndex - 1 + this.cottage.pictures.length) % this.cottage.pictures.length;
  }

  //-----------------KORACI-----------------
startDate = '';
endDate = '';
adults = 1;
children = 0;
cardNumber = '';
notes = '';

bookingStep = 1;
totalPrice = 0;
bookingError = ""

nextStep() {
  if (!this.startDate || !this.endDate) {
    this.bookingError = "Unesite početni i krajnji datum!";
    return false;
  }
  
  if (this.startDate >= this.endDate) {
    this.bookingError = "Krajnji datum mora biti posle početnog datuma!";
    return false;
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const start = new Date(this.startDate);
  start.setHours(0, 0, 0, 0);
  const startHour = Number(this.startDate.split('T')[1].split(':')[0]);
  const endHour = Number(this.endDate.split('T')[1].split(':')[0]);

  if (start <= today) {
    this.bookingError = "Početni datum mora biti sutra ili kasnije!";
    return false;
  }

  if (startHour < 14) {
    this.bookingError = "Vreme ulaska mora biti posle 14h!";
    return false;
  }

  if (endHour > 10) {
    this.bookingError = "Vreme izlaska mora biti pre 10h!";
    return false;
  }

  this.bookingError = "";
  this.calculatePrice();
  this.bookingStep++;
  return true;
}


previousStep() {
  this.message = ""
  if (this.bookingStep > 1) this.bookingStep--;
}

calculatePrice() {
  if (!this.cottage || !this.startDate || !this.endDate) return;

  const start = new Date(this.startDate);
  const end = new Date(this.endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime())) return;

  const nights = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
  if (nights <= 0) return;

  const month = start.getMonth(); // 0 = januar, 1 = februar, ..., 11 = decembar
  let pricePerNight = 0;

  // Letnji period: maj, jun, jul, avgust
  if (month >= 4 && month <= 7) {
    pricePerNight = this.cottage.price_summer;
  }
  // Zimski period: decembar, januar, februar
  else if (month === 11 || month === 0 || month === 1) {
    pricePerNight = this.cottage.price_winter;
  }
  // Ostalo: radni dan / vikend
  else {
    const day = start.getDay(); // 0 = nedelja, 6 = subota
    if (day === 0 || day === 6) {
      pricePerNight = this.cottage.price_weekend;
    } else {
      pricePerNight = this.cottage.price_weekday;
    }
  }

  this.totalPrice = nights * pricePerNight;
}


//----------------VALIDACIJA KARTICE-----------------


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
    const c = this.cardNumber.replace(/\s+/g, ''); // ukloni sve razmake
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

  logOut(){
    localStorage.removeItem('username');
  }
}
