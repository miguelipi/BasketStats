import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { EquipoDetalleService } from "../../services/equipoDetalle.service";
import { ActivatedRoute } from "@angular/router";

@Component({
    templateUrl: './equipoDetalle-page.component.html',
    styleUrls: ['./equipoDetalle-page.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule],

})

export class EquipoDetallePageComponent implements OnInit {

    stats: any = {};
    equipo: any = {};
    jugadores: any[] = [];
    id!: number;
    season!: number;

    constructor(
        private route: ActivatedRoute,
        private equipoDetalleService: EquipoDetalleService
    ) { }

    ngOnInit(): void {
        // Obtener parámetros de la URL
        this.route.queryParams.subscribe(params => {
            this.id = params['id'];
            this.season = params['season'];
            console.log('ID:', this.id);
            console.log('Season:', this.season);

            this.equipoDetalleService.getEquipoStats(this.id, this.season).subscribe(data => {
                this.stats = data.response[0];
                console.log('Stats:', this.stats);

            });
            this.equipoDetalleService.getEquipo(this.id).subscribe(data => {
                this.equipo = data.response[0];
                console.log('Equipo:', this.equipo);
            });

            this.equipoDetalleService.getJugadores(this.id, this.season).subscribe(data => {
                this.jugadores = data.response;
                console.log('Jugadores:', this.jugadores);
            });
        });
    }

    get leagueKeys(): string[] {
        return Object.keys(this.equipo.leagues || {});
    }
}
