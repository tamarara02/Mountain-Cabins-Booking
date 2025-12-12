import { Routes } from '@angular/router';
import { PrijavaComponent } from './prijava/prijava.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { RegistracijaComponent } from './registracija/registracija.component';
import { PrijavaAdminComponent } from './prijava-admin/prijava-admin.component';
import { VlasnikComponent } from './vlasnik/vlasnik.component';
import { TuristaComponent } from './turista/turista.component';
import { AdminComponent } from './admin/admin.component';
import { ProfilComponent } from './profil/profil.component';
import { VikendiceVlasnikComponent } from './vikendice-vlasnik/vikendice-vlasnik.component';
import { PromenaLozinkeComponent } from './promena-lozinke/promena-lozinke.component';
import { VikendiceTuristaComponent } from './vikendice-turista/vikendice-turista.component';
import { VikendicaComponent } from './vikendica/vikendica.component';
import { RezervacijeTuristaComponent } from './rezervacije-turista/rezervacije-turista.component';
import { RezervacijeVlasnikComponent } from './rezervacije-vlasnik/rezervacije-vlasnik.component';
import { StatistikaComponent } from './statistika/statistika.component';

export const routes: Routes = [
    {path: "", component: PocetnaComponent},
    {path: "prijava", component: PrijavaComponent},
    {path: "registracija", component: RegistracijaComponent},
    {path: "prijava_admin", component: PrijavaAdminComponent},
    {path: "vlasnik", component: VlasnikComponent},
    {path: "turista", component: TuristaComponent},
    {path: "admin", component: AdminComponent},
    {path: "profil", component: ProfilComponent},
    {path: "moje_vikendice", component: VikendiceVlasnikComponent},
    {path: "promena_lozinke", component: PromenaLozinkeComponent},
    {path: "vikendice", component: VikendiceTuristaComponent},
    {path: "vikendica", component: VikendicaComponent},
    {path: "rezervacije_t", component: RezervacijeTuristaComponent},
    {path: "rezervacije_v", component: RezervacijeVlasnikComponent},
    {path: "statistika", component: StatistikaComponent}
];
