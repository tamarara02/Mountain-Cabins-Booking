import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/Korisnik';

@Injectable({
  providedIn: 'root'
})
export class PrijavaRegistracijaService {
  http = inject(HttpClient)
  backPath = "http://localhost:8080"
  constructor() { }

  check(u: string){
    const data={
      username: u
    }
    return this.http.post(`${this.backPath}/users/check`, data, { responseType: 'text' });
  }

  logIn(u: string, p: string){
    const data={
      username: u,
      password: p
    }
    return this.http.post<User>(`${this.backPath}/users/login`, data)
  }

  register(userData: FormData){
    return this.http.post(`${this.backPath}/users/register`, userData, { responseType: 'text' });
  }

  getUser(usern: string){
    const data={
      username: usern
    }
    return this.http.post<User>(`${this.backPath}/users/getuser`, data)
  }

  updateUser(userData: FormData){
    return this.http.post(`${this.backPath}/users/update`, userData, { responseType: 'text' });
  }

  changeUserPass(username: string, oldPassword: string, newPassword: string){
    const data = {
        username: username,
        oldPassword: oldPassword,
        newPassword: newPassword
    };
  return this.http.post(`${this.backPath}/users/changepass`, data, { responseType: 'text' })
  }
}
