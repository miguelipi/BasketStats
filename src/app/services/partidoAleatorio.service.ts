import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, map, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PartidoService {

  //Cabeceras de la API

  private headers = new HttpHeaders({
    'X-RapidAPI-Key': '6dc5174fe0msh92cd3293e89487dp196976jsn36819e90cab2', 
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
  });

  constructor(private http: HttpClient) {}

  //Obetenemos un partido aleatorio de la API

  getPartidoAleatorio(): Observable<any> {
    const url = 'https://api-nba-v1.p.rapidapi.com/games?league=standard&season=2024';
    return this.http.get<any>(url, { headers: this.headers }).pipe(
      map(res => {
        const games = res.response; //Obtenemos los partidos de la respuesta
        const randomGame = games[Math.floor(Math.random() * games.length)]; //Seleccionamos un partido aleatorio
        return randomGame.id; //Devolvemos el ID del partido aleatorio
      }),
      //Hacemos una segunda llamada a la API para conseguir las estadisticas del partido
      switchMap((gameId: number) =>
        this.getEstadisticasPorPartido(gameId)
      )
    );
  }

  //Obtenemos las estadisticas del partido aleatorio

  getEstadisticasPorPartido(id: number): Observable<any> {
    const url = `https://api-nba-v1.p.rapidapi.com/games/statistics?id=${id}`;
    return this.http.get<any>(url, { headers: this.headers });
  }
}


