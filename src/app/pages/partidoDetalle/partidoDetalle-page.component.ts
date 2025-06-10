import { CommonModule } from "@angular/common";
import { Component, ElementRef, ViewChild, AfterViewInit, ChangeDetectorRef } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { PartidoDetalleService } from "../../services/partidoDetalle.service";
import { ActivatedRoute } from "@angular/router";
import { Chart } from "chart.js";

@Component({
    templateUrl: './partidoDetalle-page.component.html',
    styleUrls: ['./partidoDetalle-page.component.scss'],
    standalone: true,
    imports: [CommonModule, FormsModule]
})
export class PartidoDetallePageComponent implements AfterViewInit {

    equipo1: any = {};
    equipo2: any = {};
    partidoId: any;
    partido: any = {};

    graficosListos = false;
    datosListos = false;
    viewIniciada = false;

    @ViewChild('tripleChart') tripleChartRef!: ElementRef;
    @ViewChild('tirosCampoChart') tirosCampoChartRef!: ElementRef;
    @ViewChild('rebOfensivoChart') rebOfensivoChartRef!: ElementRef;
    @ViewChild('rebDefensivoChart') rebDefensivoChartRef!: ElementRef;
    @ViewChild('asistenciasChart') asistenciasChartRef!: ElementRef;
    @ViewChild('robosChart') robosChartRef!: ElementRef;
    @ViewChild('bloqueosChart') bloqueosChartRef!: ElementRef;
    @ViewChild('perdidasChart') perdidasChartRef!: ElementRef;

    private tripleChart!: Chart;
    private tirosCampoChart!: Chart;
    private rebOfsensivoChart!: Chart;
    private rebDefensivoChart!: Chart;
    private asistenciasChart!: Chart;
    private robosChart!: Chart;
    private bloqueosChart!: Chart;
    private perdidasChart!: Chart;

    constructor(
        private route: ActivatedRoute,
        private partidoDetalleService: PartidoDetalleService,
        private cdr: ChangeDetectorRef
    ) { }

    ngOnInit(): void {
        this.route.queryParams.subscribe(params => {
            this.partidoId = params['id'];

            this.partidoDetalleService.getPartidoStats(this.partidoId).subscribe(data => {
                this.equipo1 = data.response[0];
                this.equipo2 = data.response[1];
            });

            this.partidoDetalleService.getPartido(this.partidoId).subscribe(data => {
                this.partido = data.response[0];
            });
        });
    }

    ngAfterViewInit(): void {
        this.viewIniciada = true;
        this.checkGraficos();
    }

    checkGraficos(): void {
    if (this.datosListos && this.viewIniciada) {
        this.graficosListos = true;
        this.cdr.detectChanges();

        setTimeout(() => {
            this.generarGraficos(); 
        }, 100);
    }
}

    generarGraficos() {

        this.tripleChart = new Chart(this.tripleChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: '% Triples',
                    data: [
                        parseFloat(this.equipo1.statistics?.[0]?.tpp),
                        parseFloat(this.equipo2.statistics?.[0]?.tpp)
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });

        this.tirosCampoChart = new Chart(this.tirosCampoChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: '% Tiros de campo',
                    data: [
                        parseFloat(this.equipo1.statistics?.[0]?.fgp),
                        parseFloat(this.equipo2.statistics?.[0]?.fgp)
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        this.rebOfsensivoChart = new Chart(this.rebOfensivoChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: 'Rebotes ofensivos',
                    data: [
                        this.equipo1.statistics?.[0]?.offReb,
                        this.equipo2.statistics?.[0]?.offReb
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        this.rebDefensivoChart = new Chart(this.rebDefensivoChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: 'Rebotes defensivos',
                    data: [
                        this.equipo1.statistics?.[0]?.defReb,
                        this.equipo2.statistics?.[0]?.defReb
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        this.asistenciasChart = new Chart(this.asistenciasChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: 'Asistencias',
                    data: [
                        this.equipo1.statistics?.[0]?.assists,
                        this.equipo2.statistics?.[0]?.assists
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        this.robosChart = new Chart(this.robosChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: 'Robos',
                    data: [
                        this.equipo1.statistics?.[0]?.steals,
                        this.equipo2.statistics?.[0]?.steals
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        this.bloqueosChart = new Chart(this.bloqueosChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: 'Bloqueos',
                    data: [
                        this.equipo1.statistics?.[0]?.blocks,
                        this.equipo2.statistics?.[0]?.blocks
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
        this.perdidasChart = new Chart(this.perdidasChartRef.nativeElement, {
            type: 'bar',
            data: {
                labels: [this.equipo1.team.name, this.equipo2.team.name],
                datasets: [{
                    label: 'Pérdidas',
                    data: [
                        this.equipo1.statistics?.[0]?.turnovers,
                        this.equipo2.statistics?.[0]?.turnovers
                    ],
                    backgroundColor: ['#0099b0']
                }]
            },
            options: {
                responsive: true,
                scales: {
                    y: {
                        beginAtZero: true
                    }
                }
            }
        });
    }
}
