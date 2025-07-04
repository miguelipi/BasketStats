import { provideRouter, Routes } from '@angular/router';
import { MainPageComponent } from './pages/main/main-page.component';
import { JugadoresPageComponent } from './pages/jugadores/jugadores-page.component';
import { EquiposPageComponent } from './pages/equipos/equipos-page.component';
import { PartidosPageComponent } from './pages/partidos/partidos-page.component';
import { WhoIsPageComponent } from './pages/whois/whois-page.component';
import { EquipoDetallePageComponent } from './pages/equipoDetalle/equipoDetalle-page.component';
import { PartidoDetallePageComponent } from './pages/partidoDetalle/partidoDetalle-page.component';

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
        component: WhoIsPageComponent
    },
    {
        path: 'equipo',
        component: EquipoDetallePageComponent
    },
    { 
        path: 'partido',
        component: PartidoDetallePageComponent
    },
];
export const appRoutes = provideRouter(routes);