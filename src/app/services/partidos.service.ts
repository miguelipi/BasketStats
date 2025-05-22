import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class PartidoService {

    private baseUrl = 'https://api-nba-v1.p.rapidapi.com';
    private headers = new HttpHeaders({
        'X-RapidAPI-Key': '6dc5174fe0msh92cd3293e89487dp196976jsn36819e90cab2',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
    });

    getPartidos(season: number): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/games?season=${season}`, { headers: this.headers });
    }

    getSeasons(): Observable<any> {
        return this.http.get<any>(`${this.baseUrl}/seasons`, { headers: this.headers });
    }

    constructor(private http: HttpClient) { }

}