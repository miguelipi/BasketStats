import { Component, OnInit } from '@angular/core';
import { JugadoresService } from '../../services/jugadores.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
    standalone: true,
    templateUrl: './jugadores-page.component.html',
    styleUrls: ['./jugadores-page.component.scss'],
    imports: [FormsModule, CommonModule]
})
export class JugadoresPageComponent implements OnInit {
    equipos: any[] = [];
    seasons: number[] = [];
    jugadores: any[] = [];
    mostrarMensajeSeleccion: boolean = false;
    
    selectedEquipo = '';
    selectedSeason = '';
    searchTerm = '';

    equipoSeleccionado: any = null;
    jugadorSeleccionado: any = null;
    showModal = false;

    constructor(private jugadoresService: JugadoresService) { }

    ngOnInit(): void {
        this.cargarFiltros();
    }

    cargarFiltros(): void {
        this.jugadoresService.getEquipos().subscribe(data => {
            console.log('Equipos cargados:', data);
            this.equipos = data.response;
        });

        this.jugadoresService.getSeasons().subscribe(data => {
            console.log('Seasons cargados:', data);
            this.seasons = data.response;
        });

        this.buscarJugadores();
    }

    
    buscarJugadores(): void {
        if (!this.selectedEquipo || !this.selectedSeason) {
          this.mostrarMensajeSeleccion = true;
          this.jugadores = [];
          return;
        }
      
        this.mostrarMensajeSeleccion = false;
      
        this.jugadoresService.getJugadores({
          team: this.selectedEquipo,
          season: this.selectedSeason,
          search: this.searchTerm,
        }).subscribe(data => {
          this.jugadores = data.response || [];
        });
      }

    seleccionarJugador(id: number): void {
        this.jugadoresService.getJugadorPorId(id).subscribe(data => {
            this.jugadorSeleccionado = data.response;

            console.log('Jugador seleccionado:', this.jugadorSeleccionado);

            this.jugadoresService.getEquipoPorId(Number(this.selectedEquipo)).subscribe(data => {
                this.equipoSeleccionado = data.response[0];

                console.log('Equipo seleccionado:', this.equipoSeleccionado);

                this.showModal = true;
            });
        });
    }

    cerrarModal(): void {
        this.showModal = false;
        this.jugadorSeleccionado = null;
    }
}
