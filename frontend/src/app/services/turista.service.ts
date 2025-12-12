import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cottage } from '../models/Vikendica';
import { Reservation } from '../models/Rezervacija';
import { CotComment } from '../models/Komentar';

@Injectable({
  providedIn: 'root'
})
export class TuristaService {
  http = inject(HttpClient)
  backPath = "http://localhost:8080"
  constructor() { }

  getAvgCotRating(cid: number){
    const data={
      id: cid
    }
    return this.http.post<number>(`${this.backPath}/tourist/getavgrating`, data)
  }
  
  getCottage(cid: number){
    const data={
      id: cid
    }
    return this.http.post<Cottage>(`${this.backPath}/tourist/getcottage`, data)
  }

  bookCottage(res: Reservation){
    const data={
      tourist: res.tourist,
      cottageid: res.cottageid,
      startDate: res.startDate,
      endDate: res.endDate,
      adults: res.adults,
      children: res.children,
      cardNumber: res.cardNumber,
      notes: res.notes
    }
    return this.http.post(`${this.backPath}/tourist/bookcottage`, data, { responseType: 'text' })
  }

  comments(cottageid: Number){
    const data={
      cotid: cottageid
    }
    return this.http.post<CotComment[]>(`${this.backPath}/tourist/comments`, cottageid, {
      headers: { 'Content-Type': 'application/json' }
    })
  }

  getArchiveRes(user: String){
    const data={
      tourist: user
    }
    return this.http.post<Reservation[]>(`${this.backPath}/tourist/getarchiveres`, data)
  }

  getActiveRes(user: String){
    const data={
      tourist: user
    }
    return this.http.post<Reservation[]>(`${this.backPath}/tourist/getactiveres`, data)
  }

  submitComment(r: number, text: String, stars: number){
    const data = {
        cotid: r,
        comment: text,
        rating: stars
    };
    return this.http.post(`${this.backPath}/tourist/addcomment`, data)
  }

  cancelRes(rid: number){
    return this.http.post(`${this.backPath}/tourist/deleteres`, rid)
  }
}
