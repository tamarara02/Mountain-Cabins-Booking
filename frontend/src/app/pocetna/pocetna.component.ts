import { Component, inject } from '@angular/core';
import { PocetnaService } from '../services/pocetna.service';
import { User } from '../models/Korisnik';
import { Router } from '@angular/router';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';
import { Cottage } from '../models/Vikendica';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-pocetna',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './pocetna.component.html',
  styleUrl: './pocetna.component.css'
})
export class PocetnaComponent {
  private service = inject(PocetnaService)
  private serviceUser = inject(PrijavaRegistracijaService)
  private router = inject(Router)
  private navig = this.router.getCurrentNavigation()
  user: User = new User()
  username: string | null = ""
  type: string = ""
  allCottages: Cottage[] = []

  reservations24h: Number = 0;
  reservations7d: Number = 0;
  reservations30d: Number = 0;
  
  ngOnInit(): void{
    this.service.getAllHosts().subscribe(data=>{
      this.hosts = data
    })
    this.service.getAllTourists().subscribe(data=>{
      this.tourists = data
    })
    this.service.getAllCottagesNum().subscribe(data=>{
      this.cottages = data
      console.log("Vikendice", this.allCottages)
    })
    this.service.getAllCottages().subscribe(data=>{
      this.allCottages = data
      console.log("Broj vikendica:", this.allCottages.length);
    })
    this.service.getRes24h().subscribe(data=>{
      this.reservations24h = data
    })
    this.service.getRes7d().subscribe(data=>{
      this.reservations7d = data
    })
    this.service.getRes30d().subscribe(data=>{
      this.reservations30d = data
    })

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

  hosts: Number=0
  tourists: Number=0
  cottages: Number=0

  logOut(){
    localStorage.removeItem('username');
  }

  //--------------FILTRIRANJE I SORTIRANJE---------------

  searchName: string = '';
  searchLocation: string = '';

  sortColumn: "name" | "location" = "name"
  sortDirection: 'asc' | 'desc' = 'asc';

  getFilteredAndSortedCottages() {
    let filtered = this.allCottages;

    // filtriranje
    if (this.searchName) {
      filtered = filtered.filter(c =>
        c.name.toLowerCase().includes(this.searchName.toLowerCase())
      );
    }
    if (this.searchLocation) {
      filtered = filtered.filter(c =>
        c.location.toLowerCase().includes(this.searchLocation.toLowerCase())
      );
    }

    // sortiranje
    if (this.sortColumn) {
      filtered = filtered.sort((a, b) => {
        const valA = a[this.sortColumn].toLowerCase();
        const valB = b[this.sortColumn].toLowerCase();

        if (valA < valB) return this.sortDirection === 'asc' ? -1 : 1;
        if (valA > valB) return this.sortDirection === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return filtered;
  }

  sortBy(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      if(column ==="name" || column ==="location"){
        this.sortColumn = column;
      }
      this.sortDirection = 'asc';
    }
  }



  //---------------SLAJDER ZA SLIKE KUCA -----------------
  activePictureIndex: {[cottageId: number]: number} = {};

  nextPicture(cottage: Cottage) {
    if (!cottage.pictures || cottage.pictures.length === 0) return;
    const current = this.activePictureIndex[cottage.id] || 0;
    this.activePictureIndex[cottage.id] = (current + 1) % cottage.pictures.length;
  }

  prevPicture(cottage: Cottage) {
    if (!cottage.pictures || cottage.pictures.length === 0) return;
    const current = this.activePictureIndex[cottage.id] || 0;
    this.activePictureIndex[cottage.id] = (current - 1 + cottage.pictures.length) % cottage.pictures.length;
  }

  // za prikaz aktivne slike
  getActivePicture(cottage: Cottage) {
    const index = this.activePictureIndex[cottage.id] || 0;
    return cottage.pictures && cottage.pictures.length > 0 ? cottage.pictures[index] : 'unknowncottage.jpg';
  }

}
