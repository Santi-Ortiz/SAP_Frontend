import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Propiedad } from '../models/propiedad.model';

@Injectable({
  providedIn: 'root'
})
export class PropiedadService {
  
  private apiUrl = 'http://localhost:8080/api/propiedades'; 
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Obtener todas las propiedades
  obtenerPropiedades(): Observable<Propiedad[]> {
    return this.http.get<Propiedad[]>(this.apiUrl);
  }

  // Obtener una propiedad por ID
  obtenerPropiedadPorId(id: number): Observable<Propiedad> {
    return this.http.get<Propiedad>(`${this.apiUrl}/${id}`);
  }

  // Crear una nueva propiedad
  crearPropiedad(propiedad: Propiedad): Observable<Propiedad> {
    return this.http.post<Propiedad>(this.apiUrl, propiedad, this.httpOptions);
  }

  // Actualizar una propiedad
  actualizarPropiedad(id: number, propiedad: Propiedad): Observable<Propiedad> {
    return this.http.put<Propiedad>(`${this.apiUrl}/${id}`, propiedad, this.httpOptions);
  }

  // Eliminar una propiedad
  eliminarPropiedad(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // Filtrar propiedades 
  filtrarPropiedades(filtros: any): Observable<Propiedad[]> {
    return this.http.post<Propiedad[]>(`${this.apiUrl}/filtrar`, filtros, this.httpOptions);
  }
}