import { Component } from '@angular/core';
import { WhoIsService } from '../../services/whoIs.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
    standalone: true,
    templateUrl: './whois-page.component.html',
    styleUrls: ['./whois-page.component.scss'],
    imports: [CommonModule, FormsModule]
})
export class WhoIsPageComponent {
    jugadores: any[] = [];
    jugadorActual: any = null;
    pistas: string[] = [];
    pistasMostradas: string[] = [];
    intento: string = '';
    juegoFinalizado = false;
    mensajeResultado = '';
    sugerencias: string[] = [];
    imagenJugador: string | null = null;
    imagenJugadorHD: string | null = null;

    constructor(private whoIsService: WhoIsService) { }

    ngOnInit(): void {
        this.cargarTodosLosJugadores();
    }

    cargarTodosLosJugadores() {
        this.whoIsService.getEquipos().subscribe(equiposData => {
            const equipos = equiposData.response || [];
            let jugadoresTotales: any[] = [];
            let peticionesCompletadas = 0;

            equipos.forEach((equipo: any) => {
                this.whoIsService.getJugadores(equipo.id).subscribe(jugadoresData => {
                    if (jugadoresData.results > 0) {
                        const jugadoresValidos = jugadoresData.response.filter((jugador: any) =>
                            jugador.birth?.date &&
                            jugador.birth?.country &&
                            jugador.height?.meters &&
                            jugador.college &&
                            jugador.leagues?.standard?.pos
                        );

                        jugadoresTotales = jugadoresTotales.concat(jugadoresValidos);
                    }

                    peticionesCompletadas++;

                    if (peticionesCompletadas === equipos.length) {
                        this.jugadores = jugadoresTotales;
                        this.seleccionarJugadorAleatorio();
                    }
                }, error => {
                    // Si una petición falla, igual contamos para continuar
                    peticionesCompletadas++;

                    if (peticionesCompletadas === equipos.length) {
                        this.jugadores = jugadoresTotales;
                        this.seleccionarJugadorAleatorio();
                    }
                });
            });
        });
    }

    seleccionarJugadorAleatorio() {
        const index = Math.floor(Math.random() * this.jugadores.length);
        this.jugadorActual = this.jugadores[index];

        console.log('Jugador seleccionado:', this.jugadorActual);
        this.pistas = [
            `Nacimiento: ${this.jugadorActual.birth.date}`,
            `País: ${this.jugadorActual.birth.country}`,
            `Altura: ${this.jugadorActual.height.meters}m`,
            `Universidad: ${this.jugadorActual.college}`,
            `Posición: ${this.jugadorActual.leagues.standard.pos}`
        ];

        this.intento = '';
        this.imagenJugador = null;

        // Buscar imagen del jugador
        const nombreCompleto = `${this.jugadorActual.firstname} ${this.jugadorActual.lastname}`;
        this.getImagenDesdeWikipedia(nombreCompleto).then(urls => {
            this.imagenJugador = urls.low;
            this.imagenJugadorHD = urls.high;
        });

        this.pistasMostradas = [];
        this.juegoFinalizado = false;
        this.mensajeResultado = '';
        this.intento = '';
    }

    verificarIntento() {
        const nombreCompleto = `${this.jugadorActual.firstname} ${this.jugadorActual.lastname}`.toLowerCase().trim();
        const intentoUsuario = this.intento.toLowerCase().trim();

        if (intentoUsuario === nombreCompleto) {
            this.mensajeResultado = '¡Correcto! 🎉';
            this.juegoFinalizado = true;
        } else {
            this.revelarPista();
        }

        this.intento = '';
    }

    revelarPista() {
        if (this.pistas.length > 0) {
            this.pistasMostradas.push(this.pistas.shift()!);
        } else {
            this.mensajeResultado = `No adivinaste. El jugador era: ${this.jugadorActual.firstname} ${this.jugadorActual.lastname}`;
            this.juegoFinalizado = true;
        }
    }

    reiniciarJuego() {
        this.seleccionarJugadorAleatorio();
    }

    actualizarSugerencias() {
        const texto = this.intento.toLowerCase().trim();

        if (texto.length < 2) {
            this.sugerencias = [];
            return;
        }

        this.sugerencias = this.jugadores
            .map(j => `${j.firstname} ${j.lastname}`)
            .filter(nombre => nombre.toLowerCase().includes(texto))
            .slice(0, 5); // Opcional: solo mostrar 5 sugerencias
    }

    seleccionarSugerencia(nombre: string) {
        this.intento = nombre;
        this.sugerencias = [];
    }

    getImagenDesdeWikipedia(nombre: string): Promise<{ low: string | null, high: string | null }> {
        const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(nombre)}&format=json&origin=*`;

        return fetch(searchUrl)
            .then(res => res.json())
            .then(searchData => {
                const page = searchData?.query?.search?.[0];
                if (!page) return { low: null, high: null };

                const title = page.title;
                const lowResUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=32&origin=*`;
                const highResUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=pageimages&titles=${encodeURIComponent(title)}&format=json&pithumbsize=400&origin=*`;

                return Promise.all([
                    fetch(lowResUrl).then(r => r.json()),
                    fetch(highResUrl).then(r => r.json())
                ]).then(([lowData, highData]) => {
                    const lowPage = Object.values(lowData.query.pages)[0] as any;
                    const highPage = Object.values(highData.query.pages)[0] as any;
                    return {
                        low: lowPage?.thumbnail?.source || null,
                        high: highPage?.thumbnail?.source || null
                    };
                });
            })
            .catch(err => {
                console.error('Error obteniendo imagen de Wikipedia:', err);
                return { low: null, high: null };
            });
    }

}
