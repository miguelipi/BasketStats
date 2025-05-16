import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EquiposService } from "../../services/equipos.service";

@Component({
  templateUrl: './equipos-page.component.html',
  styleUrls: ['./equipos-page.component.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class EquiposPageComponent implements OnInit {

  equipos: any[] = [];
  seasons: number[] = [];

  selectedSeason: string = '';
  selectedConferencia: string = '';
  selectedDivision: string = '';

  eastDivisions = ['Atlantic', 'Central', 'Southeast'];
  westDivisions = ['Northwest', 'Pacific', 'Southwest'];

  currentPage: number = 1;
  itemsPerPage: number = 9;

  get filteredDivisions(): string[] {
    if (this.selectedConferencia === 'East') return this.eastDivisions;
    if (this.selectedConferencia === 'West') return this.westDivisions;
    return [];
  }

  get filteredEquipos(): any[] {
    return this.equipos.filter(e => {
      const matchConf = this.selectedConferencia ? e.leagues?.standard?.conference === this.selectedConferencia : true;
      const matchDiv = this.selectedDivision ? e.leagues?.standard?.division === this.selectedDivision : true;
      return matchConf && matchDiv;
    });
  }

  get pagedEquipos(): any[] {
    const start = (this.currentPage - 1) * this.itemsPerPage;
    return this.filteredEquipos.slice(start, start + this.itemsPerPage);
  }

  get totalPages(): number {
    return Math.ceil(this.filteredEquipos.length / this.itemsPerPage);
  }

  constructor(private equiposService: EquiposService) {}

  ngOnInit(): void {
    this.cargarFiltros();
  }

  cargarFiltros(): void {
    this.equiposService.getEquipos().subscribe(data => {
      this.equipos = data.response;
    });

    this.equiposService.getSeasons().subscribe(data => {
      this.seasons = data.response;
    });
  }

  onConferenciaChange(): void {
    this.selectedDivision = '';
    this.currentPage = 1;
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
    }
  }

  prevPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
    }
  }
}
