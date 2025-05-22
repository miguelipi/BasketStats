import { CommonModule } from "@angular/common";
import { Component } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PartidoService } from "../../services/partidos.service";
import { RouterModule } from "@angular/router";


@Component({
    templateUrl: './partidos-page.component.html',
    styleUrls: ['./partidos-page.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
})
export class PartidosPageComponent {

    partidos: any[] = [];
    seasons: number[] = [];
    selectedSeason = '2024';
    partidosPaginados: any[] = [];
    paginaActual = 1;
    partidosPorPagina = 10;
    totalPaginas = 0;


    constructor(private partidosService: PartidoService) { }

    ngOnInit(): void {
        this.cargarFiltros();
    }

    cargarFiltros(): void {
        this.partidosService.getSeasons().subscribe(data => {
            console.log('Seasons cargados:', data);
            this.seasons = data.response;
        });

        this.buscarPartidos();
    }

    buscarPartidos(): void {
        if (!this.selectedSeason) {
            this.partidos = [];
            this.partidosPaginados = [];
            return;
        }

        this.partidosService.getPartidos(Number(this.selectedSeason)).subscribe(data => {
            this.partidos = data.response;
            this.totalPaginas = Math.ceil(this.partidos.length / this.partidosPorPagina);
            this.paginaActual = 1;
            this.actualizarPartidosPaginados();
        });
    }

    actualizarPartidosPaginados(): void {
        const inicio = (this.paginaActual - 1) * this.partidosPorPagina;
        const fin = inicio + this.partidosPorPagina;
        this.partidosPaginados = this.partidos.slice(inicio, fin);
    }

    paginaSiguiente(): void {
        if (this.paginaActual < this.totalPaginas) {
            this.paginaActual++;
            this.actualizarPartidosPaginados();
        }
    }

    paginaAnterior(): void {
        if (this.paginaActual > 1) {
            this.paginaActual--;
            this.actualizarPartidosPaginados();
        }
    }
}