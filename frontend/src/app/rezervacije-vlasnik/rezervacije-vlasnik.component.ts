import { Component, inject } from '@angular/core';
import { Reservation } from '../models/Rezervacija';
import { FormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { PocetnaService } from '../services/pocetna.service';
import { Cottage } from '../models/Vikendica';
import { VlasnikService } from '../services/vlasnik.service';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { CalendarOptions } from '@fullcalendar/core/index.js';
import { forkJoin } from 'rxjs';

const srLatin = {
  code: 'sr-latn'
};

@Component({
  selector: 'app-rezervacije-vlasnik',
  standalone: true,
  imports: [FormsModule, CommonModule, DatePipe, FullCalendarModule],
  templateUrl: './rezervacije-vlasnik.component.html',
  styleUrl: './rezervacije-vlasnik.component.css'
})

export class RezervacijeVlasnikComponent {
  private vservice = inject(VlasnikService)
  private service = inject(PocetnaService)
  username: any=""
  reservations: Reservation[] = []
  allCottages: Cottage[] = []
    
  ngOnInit(){
    this.username = localStorage.getItem("username")

    forkJoin({
          reservations: this.vservice.getMyReservations(this.username),
          cottages: this.service.getAllCottages()
      }).subscribe(({reservations, cottages}) => {
          if(reservations != null) {
              this.reservations = reservations.sort((a, b) => {
                const dateA = new Date(a.startDate).getTime();
                const dateB = new Date(b.startDate).getTime();
                return dateA - dateB; // rastući redosled
            });
          }
          this.allCottages = cottages;

          this.showOnCalendar();
              
          console.log(reservations)
          console.log('Sve je učitano!');
    });
  }

  getCotName(cottageid: number){
    return this.allCottages.find(c=>c.id ==cottageid)?.name
  }

//------------------KALENDAR---------------------


  calendarOptions: CalendarOptions = {
      plugins: [dayGridPlugin, interactionPlugin],
      initialView: 'dayGridMonth',
      headerToolbar: {
        left: 'prev',
        center: 'title',
        right: 'next'
      },
      dayMaxEvents: true,
      height: 'auto',
      locale: srLatin,
      contentHeight: 'auto',
      fixedWeekCount: false,
      editable: true,
      displayEventTime: false, 
      eventClick: this.onEventClick.bind(this)
  };

  onEventClick(info: any) {
    const clickedReservation = this.reservations.find(r => 
            new Date(r.startDate).toDateString() === info.event.start.toDateString()
        );
    if (clickedReservation) {
        this.selectedReservation = clickedReservation;
        this.showModal = true;
    }
  }


  refreshReservations() {
      // Ponovo učitaj rezervacije
      this.vservice.getMyReservations(this.username).subscribe(reservations => {
          if (reservations != null) {
              this.reservations = reservations.sort((a, b) => {
                  const dateA = new Date(a.startDate).getTime();
                  const dateB = new Date(b.startDate).getTime();
                  return dateB - dateA;
              });
              
              // Ažuriraj kalendar
              this.showOnCalendar()
          }
      });
  }

  showOnCalendar(){
    this.calendarOptions.events = this.reservations
      .filter(r => r.status !== 'odbijena' && r.status !== 'zavrsena')
            .map(r => ({
              title: this.getCotName(r.cottageid) || 'Rezervacija',
              start: r.startDate,
              end: r.endDate,
              color: r.status === 'neobradjena' ? 'rgba(247, 202, 24, 1)' : 'rgba(46, 111, 64, 1)'
          }));
  }

//------------------REZERVACIJE TABELA---------------------

  showModal = false;
  selectedReservation: any = null;
  showReject: {[key: number]: boolean} = {};
  rejectComment: {[key: number]: string} = {};

  approveReservation(rid: number) {
    const selected = this.reservations.find(r => r.id === rid);
    if (!selected) {
      console.error("Rezervacija nije pronađena!");
      return;
    }

    // Provera preklapanja sa već prihvaćenim rezervacijama za istu vikendicu
    const overlaps = this.reservations.some(r => {
      if (r.status !== "prihvacena" || r.cottageid !== selected.cottageid) return false;

      const startA = new Date(r.startDate).getTime();
      const endA = new Date(r.endDate).getTime();
      const startB = new Date(selected.startDate).getTime();
      const endB = new Date(selected.endDate).getTime();

      // preklapanje ako se datumi dodiruju ili seku
      return startA < endB && startB < endA;
    });

    if (overlaps) {
      alert("Ne možete prihvatiti ovu rezervaciju jer se preklapa sa već prihvaćenom!");
      return;
    }
    this.vservice.acceptReservation(rid).subscribe({});
    window.location.reload()
  }

  showRejectForm(reservationId: number) {
      this.showReject[reservationId] = true;
  }

  cancelReject(reservationId: number) {
      this.showReject[reservationId] = false;
      this.rejectComment[reservationId] = '';
  }



//------------------REZERVACIJE MODAL---------------------

  showTableRejectForm: {[key: number]: boolean} = {};
  tableRejectComment: {[key: number]: string} = {};
  
  // Za modal
  showModalRejectForm = false;
  modalRejectComment = '';

  // Tabela funkcije
  showTableReject(reservationId: number) {
    this.showTableRejectForm[reservationId] = true;
  }

  cancelTableReject(reservationId: number) {
    this.showTableRejectForm[reservationId] = false;
    this.tableRejectComment[reservationId] = '';
  }

  rejectFromTable(rid: number) {
    if (!this.tableRejectComment[rid]?.trim()) {
        alert('Molimo unesite razlog odbijanja!');
        return;
    }

    this.vservice.declineReservation(rid, this.tableRejectComment[rid]).subscribe(data=>{})
    window.location.reload()
  }

  // Modal funkcije
  showModalReject() {
      this.showModalRejectForm = true;
  }

  cancelModalReject() {
      this.showModalRejectForm = false;
      this.modalRejectComment = '';
  }

  rejectFromModal() {
      if (!this.modalRejectComment.trim()) {
          alert('Molimo unesite razlog odbijanja!');
          return;
      }

      const data = {
          reservationId: this.selectedReservation.id,
          status: 'odbijena',
          rejectionReason: this.modalRejectComment
      };
      this.vservice.declineReservation(this.selectedReservation.id, this.modalRejectComment).subscribe(data=>{})
      window.location.reload()
  }

  closeModal() {
      this.showModal = false;
      this.selectedReservation = null;
      this.showModalRejectForm = false;
      this.modalRejectComment = '';
  }

  logOut(){
    localStorage.removeItem('username');
  }
}
