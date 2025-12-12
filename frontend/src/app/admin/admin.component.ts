import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '../models/Korisnik';
import { Cottage } from '../models/Vikendica';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PocetnaService } from '../services/pocetna.service';
import { TuristaService } from '../services/turista.service';
import { AdminService } from '../services/admin.service';
import { PrijavaRegistracijaService } from '../services/prijava-registracija.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  private router = inject(Router)
  private navig = this.router.getCurrentNavigation()
  user: User = new User()
  username = ""

  
  private pservice = inject(PocetnaService)
  private tservice = inject(TuristaService)
  private aservice = inject(AdminService)
  private uservice = inject(PrijavaRegistracijaService)
  
  allCottages: Cottage[] = []
  criticalMap: { [id: number]: boolean } = {};
  allUsers: User[] = []
  currUsers: User[] = []
  regReq: User[] = []

  ngOnInit(): void{
    if(this.navig?.extras?.state){
      this.user = this.navig.extras.state['user']
      this.username = this.user.username
    }
    this.pservice.getAllCottages().subscribe(data=>{
      this.allCottages = data
      console.log("Broj vikendica:", this.allCottages.length);
      this.allCottages.forEach(cott => {
          this.tservice.getAvgCotRating(cott.id).subscribe(data=>{
          if(data!=null){
            cott.rating = data
          }
          this.aservice.isCritical(cott.id).subscribe(res => {
            this.criticalMap[cott.id] = res;  // snimi true/false
          });
        })
      });
    })
    this.aservice.getUsers().subscribe(data=>{
      if(data!=null){
        this.allUsers = data
        console.log("Broj korisnika:", this.allUsers.length);

        this.currUsers = this.allUsers.filter(u => u.status === "aktivan" || u.status === "deaktiviran");
        this.regReq = this.allUsers.filter(u => u.status === "neobradjen" || u.status === "odbijen");
      }
    })
  }

  blockCottage(id: number){
    this.aservice.blockCottage(id).subscribe(data=>{})
    window.location.reload()
  }

  updateUser(user: User) {
    const formData = new FormData();
        formData.append('username', user.username);
        formData.append('password', user.password);
        formData.append('name', user.name);
        formData.append('lastname', user.lastname);
        formData.append('gender', user.gender);
        formData.append('address', user.address);
        formData.append('phone', user.phone);
        formData.append('mail', user.mail);
        formData.append('card', user.card);
        formData.append('type', user.type);
    this.uservice.updateUser(formData).subscribe(res => {});
    window.location.reload()
  }

  deactivateUser(user: User) {
    this.aservice.deactivateUser(user.username).subscribe(res => {});
    window.location.reload()
  }

  acceptUser(user: string){
    this.aservice.acceptUser(user).subscribe()
    window.location.reload()
  }
  declineUser(user: string){
    this.aservice.declineUser(user).subscribe()
    window.location.reload()
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

    //------------------OCENE VIKENDICA--------------------

  getStars(avg: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= Math.floor(avg));  // puni koliko treba
    }
    return stars;
  }

  isCritical(id: number) {
    this.aservice.isCritical(id).subscribe(data=>{
      if(data!=null){
        return data;
      }
      return data
    })
  }


  logOut(){
    localStorage.removeItem('username');
  }
}
