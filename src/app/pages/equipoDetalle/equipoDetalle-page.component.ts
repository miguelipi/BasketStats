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

            this.equipoDetalleService.getJugadores(this.id, this.season).subscribe(async data => {
                const jugadoresRaw = data.response || [];

                this.jugadores = await Promise.all(jugadoresRaw.map(async (jugador: any) => {
                    const nombreCompleto = `${jugador.firstname} ${jugador.lastname}`;
                    const imageUrl = await this.getImagenDesdeWikipedia(nombreCompleto);
                    return {
                        ...jugador,
                        image: imageUrl
                    };
                }));

                console.log('Jugadores con imagen:', this.jugadores);
            });
        });
    }

    get leagueKeys(): string[] {
        return Object.keys(this.equipo.leagues || {});
    }

    seleccionarJugador(id: number, imagen: string): void {
        // Aquí puedes implementar lógica adicional si deseas abrir un modal o mostrar detalles
    }

    // 🔽 FUNCION AÑADIDA: Obtener imagen desde Wikipedia
    getImagenDesdeWikipedia(nombre: string): Promise<string | null> {
        const apiUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(nombre)}&format=json&origin=*`;

        return fetch(apiUrl)
            .then(res => res.json())
            .then(searchData => {
                const page = searchData?.query?.search?.[0];
                if (!page) return null;

                const title = page.title;
                const imageUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=300&origin=*`;

                return fetch(imageUrl)
                    .then(res => res.json())
                    .then(imageData => {
                        const pageData = Object.values(imageData.query.pages)[0] as { thumbnail?: { source: string } };
                        return pageData.thumbnail?.source || null;
                    });
            })
            .catch(err => {
                console.error('Error obteniendo imagen de Wikipedia:', err);
                return null;
            });
    }
}
