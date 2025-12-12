import { CommonModule, DatePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TuristaService } from '../services/turista.service';
import { Reservation } from '../models/Rezervacija';
import { Cottage } from '../models/Vikendica';
import { PocetnaService } from '../services/pocetna.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-rezervacije-turista',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe],
  templateUrl: './rezervacije-turista.component.html',
  styleUrl: './rezervacije-turista.component.css'
})
export class RezervacijeTuristaComponent {
  private tservice = inject(TuristaService)
  private service = inject(PocetnaService)
  allCottages: Cottage[] = []

  username: any=""
  reservations: Reservation[] = []
  activeRes: Reservation[] = []
  
  ngOnInit(){
    this.username = localStorage.getItem("username")
    this.tservice.getActiveRes(this.username).subscribe(data=>{
      if(data!=null){
        this.activeRes=data
      }
    })

    forkJoin({
          reservations: this.tservice.getArchiveRes(this.username),
          cottages: this.service.getAllCottages()
      }).subscribe(({reservations, cottages}) => {
          if(reservations != null) {
              this.reservations = reservations.sort((a, b) => {
                const dateA = new Date(a.startDate).getTime();
                const dateB = new Date(b.startDate).getTime();
                return dateB - dateA; // opadajući redosled
            });
          }
          this.allCottages = cottages;
          console.log('Sve je učitano!');
    });
  }

  getCotName(cottageid: number){
    return this.allCottages.find(c=>c.id ==cottageid)?.name
  }

  getCotLocation(cottageid: number){
    return this.allCottages.find(c=>c.id ==cottageid)?.location
  }

  getCotStatus(status: String){
    if(status=="prihvacena"){
      return "prihvaćena"
    } else{
      return "na čekanju"
    }
  }

//----------------------------PRIKAZ-------------------------------

  hasComment(reservation: any): boolean {
    return reservation.comment != null && reservation.comment.comment != null;
  }
  getCommentText(reservation: any): string {
      return reservation.comment?.comment || '';
  }
  getRating(reservation: any): number {
      return reservation.comment?.rating || 0;
  }
  getStars(avg: number): boolean[] {
    const stars: boolean[] = [];
    for (let i = 1; i <= 5; i++) {
        stars.push(i <= Math.floor(avg));
    }
    return stars;
  }

//-----------------KOMENTAR I OCENA-----------------
  showCommentForm = false;
  selectedReservationId: number | null = null;
  commentText = '';
  formRating: number | null = null;
  selectedRating = 0;
  selectedRatingCot = 0;

  setRating(n: number, id: number) {
    this.selectedRating = n
    this.selectedRatingCot = id
    this.formRating = n
  }

  openCommentForm(reservationId: number) {
    this.showCommentForm = true;
    this.selectedReservationId = reservationId;
    this.commentText = '';
  }

  saveComment(r: number){
    if (!this.commentText || !this.formRating) {
        alert('Molimo unesite i komentar i ocenu');
        return;
    }
    if(this.selectedReservationId != this.selectedRatingCot){
      alert('Molimo unesite i komentar i ocenu');
      return;
    }

    this.tservice.submitComment(r, this.commentText, this.formRating).subscribe(data=>{})
    this.showCommentForm = false;
    this.selectedReservationId = null;
    this.commentText = '';
    this.formRating = null;
    this.selectedRating = 0;
    this.selectedRatingCot = 0;
    window.location.reload()
  }
//--------------------OTKAZI----------------------

  canCancelReservation(startDate: string): boolean {
    const reservationDate = new Date(startDate);
    const today = new Date();
    
    today.setHours(0, 0, 0, 0);
    reservationDate.setHours(0, 0, 0, 0);
    
    const diffTime = reservationDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays >= 1;
  }

  cancelReservation(r: number) {
    this.tservice.cancelRes(r).subscribe(data=>{})
    console.log("obrisi rezervaciju: ", r)
    window.location.reload()
  }

  logOut(){
    localStorage.removeItem('username');
  }
}
