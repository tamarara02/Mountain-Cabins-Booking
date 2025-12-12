import { Component, inject } from '@angular/core';
import { Cottage } from '../models/Vikendica';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { VlasnikService } from '../services/vlasnik.service';

@Component({
  selector: 'app-vikendice-vlasnik',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './vikendice-vlasnik.component.html',
  styleUrl: './vikendice-vlasnik.component.css'
})
export class VikendiceVlasnikComponent {
  private service = inject(VlasnikService)
  allCottages: Cottage[] = []
  editingCottage: Cottage | null = null
  selectedFiles: File[] = []
  selectedImageNames: string[] = []
  username: string|null=""

  ngOnInit(){
    this.username = localStorage.getItem('username');
    console.log(this.username)
    if(this.username != null){
      this.service.getMyCottages(this.username).subscribe(data=>{
        this.allCottages = data
        console.log("Moje vikendice:", this.allCottages);
        console.log("Broj vikendica:", this.allCottages.length);
      })
    }
  }

  addNew(){
    this.editingCottage = new Cottage
    setTimeout(() => {
      const formCard = document.querySelector('.cottage-form-card');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 0);
  }

  edit(c: Cottage){
    this.editingCottage = new Cottage
    this.editingCottage.id = c.id
    this.editingCottage.name = c.name
    this.editingCottage.location = c.location
    this.editingCottage.services = c.services
    this.editingCottage.phone = c.phone
    this.editingCottage.price_summer = c.price_summer
    this.editingCottage.price_winter = c.price_winter
    this.editingCottage.price_weekday = c.price_weekday
    this.editingCottage.price_weekend = c.price_weekend
    this.editingCottage.coord_x = c.coord_x
    this.editingCottage.coord_y = c.coord_y
    this.selectedImageNames = c.pictures;

    setTimeout(() => {
      const formCard = document.querySelector('.cottage-form-card');
      if (formCard) {
        formCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }
    }, 0);
  }

  remove(id: number){
    this.service.deleteCottage(id).subscribe({})
    window.location.reload();
  }
  
  onJsonUpload(event: any){
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (e: any) => {
      try {
        // Parsiranje JSON fajla
        const data = JSON.parse(e.target.result);
        this.editingCottage = new Cottage
        // Popunjavanje forme (editingCottage) osim slika
        this.editingCottage.name = data.name || '';
        this.editingCottage.location = data.location || '';
        this.editingCottage.services = data.services || '';
        this.editingCottage.price_summer = data.price_summer || 0;
        this.editingCottage.price_winter = data.price_winter || 0;
        this.editingCottage.price_weekday = data.price_weekday || 0;
        this.editingCottage.price_weekend = data.price_weekend || 0;
        this.editingCottage.phone = data.phone || '';
        this.editingCottage.coord_x = data.coord_x || 0;
        this.editingCottage.coord_y = data.coord_y || 0;

        // Slike ne diramo (pictures ostaje prazno)
        this.selectedImageNames = [];
        setTimeout(() => {
          const formCard = document.querySelector('.cottage-form-card');
          if (formCard) {
            formCard.scrollIntoView({ behavior: 'smooth', block: 'end' });
          }
        }, 0);

      } catch (err) {
        console.error('Nevalidan JSON fajl', err);
        alert('Nevalidan JSON fajl!');
      }
    };

    reader.readAsText(file);
    event.target.value = '';
  }



  saveCottage(){
    if(!this.editingCottage) return

    const formData = new FormData();

    // Dodavanje svih podataka o vikendici
    formData.append('name', this.editingCottage.name);
    formData.append('location', this.editingCottage.location);
    formData.append('services', this.editingCottage.services);
    formData.append('price_summer', this.editingCottage.price_summer.toString());
    formData.append('price_winter', this.editingCottage.price_winter.toString());
    formData.append('price_weekday', this.editingCottage.price_weekday?.toString() || '0');
    formData.append('price_weekend', this.editingCottage.price_weekend?.toString() || '0');
    formData.append('phone', this.editingCottage.phone);
    formData.append('coord_x', this.editingCottage.coord_x.toString());
    formData.append('coord_y', this.editingCottage.coord_y.toString());
    if(this.username){
      formData.append('owner', this.username);
    }

    // Dodavanje slika
    this.selectedImageFiles.forEach(file => {
      formData.append('pictures', file, file.name);
    });

    this.selectedImageNames.forEach(name=>{
      formData.append('picture_names', name)
    })
    

    if(this.editingCottage.id){
      formData.append('id', this.editingCottage.id.toString());
      this.service.updateCottage(formData).subscribe(()=>{
        window.location.reload();
      })
    } else{
      this.service.newCottage(formData).subscribe(()=>{
        window.location.reload();
      })
    }
  }

  cancelEdit(){
    if(this.editingCottage){
      this.editingCottage = null
    }
    this.selectedImageNames = []
  }

  //------------UKLANJANJE/DODAVANJE SLIKA----------------

  selectedImageFiles: File[] = [];

  onImagesSelected(event: any) {
    const files: FileList = event.target.files;
    for (let i = 0; i < files.length; i++) {
      this.selectedImageFiles.push(files[i]);
      this.selectedImageNames.push(files[i].name);
    }
    // resetujemo input da bi mogli ponovo da izaberemo iste fajlove
    event.target.value = '';
  }

  removeSelectedImage(index: number) {
    this.selectedImageFiles.splice(index, 1);
    this.selectedImageNames.splice(index, 1);
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


  logOut(){
    localStorage.removeItem('username');
  }

}

