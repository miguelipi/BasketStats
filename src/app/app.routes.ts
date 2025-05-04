import { provideRouter, Routes } from '@angular/router';
import { MainPageComponent } from './pages/main/main-page.component';
import { JugadoresPageComponent } from './pages/jugadores/jugadores-page.component';
import { EquiposPageComponent } from './pages/equipos/equipos-page.component';
import { PartidosPageComponent } from './pages/partidos/partidos-page.component';
import { WhoisPageComponent } from './pages/whois/whois-page.component';


export const routes: Routes = [

    // rutas de la aplicación
    {
        path: '',
        component: MainPageComponent
    },
    {
        path: 'jugadores',
        component: JugadoresPageComponent
    },
    {  
        path: 'equipos',
        component: EquiposPageComponent
    },
    {
        path: 'partidos',
        component: PartidosPageComponent
    },
    {
        path: 'whois',
        component: WhoisPageComponent
    },
];
export const appRoutes = provideRouter(routes);