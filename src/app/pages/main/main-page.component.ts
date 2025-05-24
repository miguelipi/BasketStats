import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { PartidoService } from '../../services/partidoAleatorio.service';
import { CommonModule } from '@angular/common';
import { Chart } from 'chart.js/auto';


@Component({
    standalone: true,
    imports: [CommonModule],
    templateUrl: './main-page.component.html',
    styleUrls: ['./main-page.component.scss']
})
export class MainPageComponent implements OnInit {
    isLoading: boolean = true;
    equipoLocal: any = null;
    equipoVisitante: any = null;

    @ViewChild('tripleChart') tripleChartRef!: ElementRef;
    @ViewChild('reboteChart') reboteChartRef!: ElementRef;

    private tripleChart!: Chart;
    private reboteChart!: Chart;
  
    constructor(private partidoService: PartidoService) {}
  
    ngOnInit() {
      this.isLoading = true;
  
      this.partidoService.getPartidoAleatorio().subscribe({
        next: (res) => {
          const [equipo1, equipo2] = res.response;
  
          this.equipoLocal = {
            team: equipo1.team,
            points: equipo1.statistics[0]?.points ?? 0,
            triples: equipo1.statistics[0]?.tpp ?? '0',
            rebotes: equipo1.statistics[0]?.totReb ?? 0
          };
  
          this.equipoVisitante = {
            team: equipo2.team,
            points: equipo2.statistics[0]?.points ?? 0,
            triples: equipo2.statistics[0]?.tpp ?? '0',
            rebotes: equipo2.statistics[0]?.totReb ?? 0
          };
  
          this.isLoading = false;
  
          // Esperamos un poco para asegurarnos que el DOM está cargado
          setTimeout(() => this.generarGraficos(), 0);
        },
        error: (err) => {
          console.error('Error al cargar datos del partido:', err);
          this.isLoading = false;
        }
      });
    }
  
    generarGraficos() {
      this.tripleChart = new Chart(this.tripleChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: [this.equipoLocal.team.code, this.equipoVisitante.team.code],
          datasets: [{
            label: '% Triples',
            data: [
              parseFloat(this.equipoLocal.triples),
              parseFloat(this.equipoVisitante.triples)
            ],
            backgroundColor: ['#0099b0']
          }]
        }
      });
  
      this.reboteChart = new Chart(this.reboteChartRef.nativeElement, {
        type: 'bar',
        data: {
          labels: [this.equipoLocal.team.code, this.equipoVisitante.team.code],
          datasets: [{
            label: 'Rebotes Totales',
            data: [
              this.equipoLocal.rebotes,
              this.equipoVisitante.rebotes
            ],
            backgroundColor: ['#0099b0']
          }]
        }
      });
    }
  }