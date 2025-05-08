import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class JugadoresService {
  private baseUrl = 'https://api-nba-v1.p.rapidapi.com';
  private headers = new HttpHeaders({
    'X-RapidAPI-Key': '6dc5174fe0msh92cd3293e89487dp196976jsn36819e90cab2', 
    'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
  });

  constructor(private http: HttpClient) {}

  getEquipos(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/teams/`, { headers: this.headers });
  }

  getSeasons(): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/seasons/`, { headers: this.headers });
  }

  getJugadores(filtros: { team?: string; season?: string; search?: string }): Observable<any> {
    let params = new HttpParams();
    if (filtros.team) params = params.set('team', filtros.team);
    if (filtros.season) params = params.set('season', filtros.season);
    if (filtros.search) params = params.set('search', filtros.search);

    return this.http.get<any>(`${this.baseUrl}/players`, {
      headers: this.headers,
      params
    });
  }

  getJugadorPorId(id: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/player?id=${id}`, { headers: this.headers });
  }
}
