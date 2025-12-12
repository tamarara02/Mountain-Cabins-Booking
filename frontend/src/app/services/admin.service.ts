import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { User } from '../models/Korisnik';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  http = inject(HttpClient)
  backPath = "http://localhost:8080"
  constructor() { }

  isCritical(cid: number){
    const data={
      id: cid
    }
    return this.http.post<boolean>(`${this.backPath}/admin/iscritical`, data)
  }

  blockCottage(cid: number){
    const data={
      id: cid
    }
    return this.http.post(`${this.backPath}/admin/blockcottage`, data)
  }

  getUsers(){
    return this.http.get<User[]>(`${this.backPath}/admin/getusers`)
  }

  updateUser(userData: FormData){
    return this.http.post(`${this.backPath}/admin/updateuser`, userData);
  }

  deactivateUser(user: string){
    const data={
      username: user
    }
    return this.http.post(`${this.backPath}/admin/deactuser`, data)
  }

  acceptUser(user: string){
    const data={
      username: user
    }
    return this.http.post(`${this.backPath}/admin/acceptuser`, data)
  }

  declineUser(user: string){
    const data={
      username: user
    }
    return this.http.post(`${this.backPath}/admin/declineuser`, data)
  }
}
