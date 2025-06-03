import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Renta {
  propiedadId: number;
  nombreSolicitante: string;
  correoElectronico: string;
  contrasena: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
  fechaSolicitud?: Date;
  numeroReferencia?: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  
  private apiUrl = 'http://localhost:8080/api/renta'; 
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Enviar solicitud de renta
  enviarSolicitudRenta(solicitud: Renta): Observable<any> {
    return this.http.post<any>(this.apiUrl, solicitud, this.httpOptions);
  }

  // Obtener solicitudes por usuario
  obtenerSolicitudesPorUsuario(correo: string): Observable<Renta[]> {
    return this.http.get<Renta[]>(`${this.apiUrl}/usuario/${correo}`);
  }

  // Obtener solicitud por número de referencia
  obtenerSolicitudPorReferencia(referencia: string): Observable<Renta> {
    return this.http.get<Renta>(`${this.apiUrl}/referencia/${referencia}`);
  }
}