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
        }).subscribe(async data => {
            const jugadoresRaw = data.response || [];

            // Buscar imagen de cada jugador por nombre
            this.jugadores = await Promise.all(jugadoresRaw.map(async (jugador: { firstname: any; lastname: any; }) => {
                const nombreCompleto = `${jugador.firstname} ${jugador.lastname}`;
                const imageUrl = await this.getImagenDesdeWikipedia(nombreCompleto);
                return {
                    ...jugador,
                    image: imageUrl
                };
            }));
        });
    }


    seleccionarJugador(id: number, imagen: string): void {
        this.jugadoresService.getJugadorPorId(id).subscribe(data => {
            this.jugadorSeleccionado = {
                ...data.response[0],
                image: imagen // Guardamos la imagen para la modal
            };

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
