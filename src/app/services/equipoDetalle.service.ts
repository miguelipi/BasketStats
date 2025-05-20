    import { Injectable } from '@angular/core';
    import { HttpClient, HttpHeaders } from '@angular/common/http';
    import { Observable } from 'rxjs';

    @Injectable({
    providedIn: 'root'
    })
    export class EquipoDetalleService {

    private baseUrl = 'https://api-nba-v1.p.rapidapi.com';
    private headers = new HttpHeaders({
        'X-RapidAPI-Key': '6dc5174fe0msh92cd3293e89487dp196976jsn36819e90cab2', 
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    });

        getEquipoStats(id: number, season: number): Observable<any> {
            return this.http.get<any>(`${this.baseUrl}/teams/statistics?id=${id}&season=${season}`, { headers: this.headers });
        }

        getEquipo(id: number): Observable<any> {
            return this.http.get<any>(`${this.baseUrl}/teams?id=${id}`, { headers: this.headers });
        }

        getJugadores(id: number,season: number): Observable<any> {
            return this.http.get<any>(`${this.baseUrl}/players?team=${id}&season=${season}`, { headers: this.headers });
        }


    constructor(private http: HttpClient) {}
        
    }