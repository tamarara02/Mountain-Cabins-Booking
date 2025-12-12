import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Cottage } from '../models/Vikendica';

@Injectable({
  providedIn: 'root'
})
export class PocetnaService {
  http = inject(HttpClient)
  backPath = "http://localhost:8080"
  constructor() { }

  getAllHosts(){
    return this.http.get<Number>(`${this.backPath}/gethosts`);
  }

  getAllTourists(){
    return this.http.get<Number>(`${this.backPath}/gettourists`);
  }

  getAllCottagesNum(){
    return this.http.get<Number>(`${this.backPath}/getcottagesnum`);
  }

  getAllCottages(){
    return this.http.get<Array<Cottage>>(`${this.backPath}/getcottages`)
  }

  getRes24h(){
    return this.http.get<Number>(`${this.backPath}/getres24h`)
  }

  getRes7d(){
    return this.http.get<Number>(`${this.backPath}/getres7d`)
  }

  getRes30d(){
    return this.http.get<Number>(`${this.backPath}/getres30d`)
  }
}
