import { Component, inject } from '@angular/core';
import { PocetnaService } from '../services/pocetna.service';
import { Router } from '@angular/router';
import { User } from '../models/Korisnik';
import { Cottage } from '../models/Vikendica';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { findIndex } from 'rxjs';
import { TuristaService } from '../services/turista.service';

@Component({
  selector: 'app-vikendice-turista',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vikendice-turista.component.html',
  styleUrl: './vikendice-turista.component.css'
})
export class VikendiceTuristaComponent {
  private service = inject(PocetnaService)
  private tservice = inject(TuristaService)
  private router = inject(Router)
  user: User = new User()
  username: string | null = ""
  type: string = ""
  allCottages: Cottage[] = []
  cottage: Cottage= new Cottage

  ngOnInit(): void{
    this.service.getAllCottages().subscribe(data=>{
      this.allCottages = data
      console.log("Broj vikendica:", this.allCottages.length);
      this.allCottages.forEach(cott => {
          this.tservice.getAvgCotRating(cott.id).subscribe(data=>{
          if(data!=null){
            cott.rating = data
          }
        })
      });
      console.log(this.allCottages)
    })
    
    this.username = localStorage.getItem('username');
    localStorage.removeItem("cottage")
  }

  goTo(cid: number){
    localStorage.setItem("cottage", String(cid))
    this.router.navigate([`/vikendica`])
    
  }

  logOut(){
    localStorage.removeItem('username');
  }

  //------------------OCENE VIKENDICA--------------------

  getStars(avg: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= Math.floor(avg));  // puni koliko treba
    }
    return stars;
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
