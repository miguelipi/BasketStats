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

  selectedEquipo = '';
  selectedSeason = '';
  searchTerm = '';

  jugadorSeleccionado: any = null;
  showModal = false;

  constructor(private jugadoresService: JugadoresService) {}

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
    this.jugadoresService.getJugadores({
      team: this.selectedEquipo,
      season: this.selectedSeason,
      search: this.searchTerm,
    }).subscribe(data => {
      this.jugadores = data.response;
    });
  }

  seleccionarJugador(id: number): void {
    this.jugadoresService.getJugadorPorId(id).subscribe(data => {
      this.jugadorSeleccionado = data.response;
      this.showModal = true;
    });
  }

  cerrarModal(): void {
    this.showModal = false;
    this.jugadorSeleccionado = null;
  }
}
