import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cottage } from '../models/Vikendica';
import { Reservation } from '../models/Rezervacija';

@Injectable({
  providedIn: 'root'
})
export class VlasnikService {
  http = inject(HttpClient)
  backPath = "http://localhost:8080"
  constructor() { }

  getMyCottages(user: string){
    const data={
      username : user
    }
    return this.http.post<Array<Cottage>>(`${this.backPath}/owner/mycottages`, data)
  }

  newCottage(cotdata: FormData){
    return this.http.post(`${this.backPath}/owner/newcottage`, cotdata, { responseType: 'text' })
  }

  updateCottage(cotdata: FormData){
    return this.http.post(`${this.backPath}/owner/updatecottage`, cotdata)
  }

  deleteCottage(cid: Number){
    return this.http.post(`${this.backPath}/owner/deletecottage`, cid)
  }

  getMyReservations(u: String){
    const data={
      owner: u
    }
    return this.http.post<Reservation[]>(`${this.backPath}/owner/getmyres`, u)
  }

  acceptReservation(rid: number){
    const data={
      id: rid
    }
    return this.http.post(`${this.backPath}/owner/acceptres`, data)
  }

  declineReservation(rid: number, reason: String){
    const data={
      id: rid,
      rejectionReason: reason
    }
    return this.http.post(`${this.backPath}/owner/declineres`, data)
  }
}
