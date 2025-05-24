import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EquiposService } from "../../services/equipos.service";
import { RouterModule } from "@angular/router";

@Component({
  templateUrl: './equipos-page.component.html', 
  styleUrls: ['./equipos-page.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
})
export class EquiposPageComponent implements OnInit {

  equipos: any[] = [];
  seasons: number[] = [];

  selectedSeason: number = 2024;
  selectedConferencia: string = '';
  selectedDivision: string = '';

  eastDivisions = ['Atlantic', 'Central', 'Southeast'];
  westDivisions = ['Northwest', 'Pacific', 'Southwest'];

  currentPage: number = 1;
  itemsPerPage: number = 9;

  // Getter para mostrar divisiones según la conferencia seleccionada
  get filteredDivisions(): string[] {
    if (this.selectedConferencia === 'East') return this.eastDivisions;
    if (this.selectedConferencia === 'West') return this.westDivisions;
    return [];
  }

  // Getter para filtrar equipos según conferencia y división
  get filteredEquipos(): any[] {
    return this.equipos.filter(e => {
      const matchConf = this.selectedConferencia ? e.leagues?.standard?.conference === this.selectedConferencia : true;
      const matchDiv = this.selectedDivision ? e.leagues?.standard?.division === this.selectedDivision : true;
      return matchConf && matchDiv;
    });
  }

  // Getter para obtener solo los equipos de la página actual
  get pagedEquipos(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEquipos.slice(start, start + this.itemsPerPage);
  }

  // Getter para calcular el total de páginas necesarias
  get totalPages(): number {
    return Math.ceil(this.filteredEquipos.length / this.itemsPerPage);
  }

  // Inyección del servicio EquiposService en el constructor
  constructor(private equiposService: EquiposService) {}

  // Hook que se ejecuta al inicializar el componente
  ngOnInit(): void {
    this.cargarFiltros(); // Carga inicial de equipos y temporadas
  }

  // Método para obtener los datos de equipos y temporadas desde el servicio
  cargarFiltros(): void {
    this.equiposService.getEquipos().subscribe(data => {
      this.equipos = data.response; // Asigna la respuesta de equipos
    });

    this.equiposService.getSeasons().subscribe(data => {
      this.seasons = data.response; // Asigna la respuesta de temporadas
    });
  }

  // Evento que se dispara al cambiar la conferencia seleccionada
  onConferenciaChange(): void {
    this.selectedDivision = ''; // Se limpia la división seleccionada
    this.currentPage = 1; // Se reinicia la paginación
  }

  // Avanza a la siguiente página si no está en la última
  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  // Retrocede a la página anterior si no está en la primera
  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
