import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Renta {
  idPropiedad: number;
  nombre: string;
  correo: string;
  contrasena: string;
  tipoDoc: string;
  numeroDoc: string;
}

@Injectable({
  providedIn: 'root'
})
export class SolicitudService {
  
  private apiUrl = 'http://10.43.103.226/renta'; 

  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Enviar solicitud de renta
  enviarSolicitudRenta(solicitud: Renta): Observable<any> {
    console.log('🌐 Enviando solicitud a:', this.apiUrl);
    console.log('📝 Datos de la solicitud:', solicitud);
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