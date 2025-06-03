import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cliente } from '../models/cliente.model';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {
  
  private apiUrl = 'http://10.43.103.226:8080/MSBuscarPropiedad-0.0.1-SNAPSHOT/api/clientes';
  
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };

  constructor(private http: HttpClient) { }

  // Obtener todos los clientes
  obtenerClientes(): Observable<Cliente[]> {
    return this.http.get<Cliente[]>(this.apiUrl);
  }

  // Obtener un cliente por ID
  obtenerClientePorId(id: number): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/${id}`);
  }

  // Crear un nuevo cliente
  crearCliente(cliente: Cliente): Observable<Cliente> {
    return this.http.post<Cliente>(this.apiUrl, cliente, this.httpOptions);
  }

  // Actualizar un cliente
  actualizarCliente(id: number, cliente: Cliente): Observable<Cliente> {
    return this.http.put<Cliente>(`${this.apiUrl}/${id}`, cliente, this.httpOptions);
  }

  // Eliminar un cliente
  eliminarCliente(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, this.httpOptions);
  }

  // Buscar cliente por correo
  buscarPorCorreo(correo: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/correo/${correo}`);
  }

  // Buscar cliente por número de identificación
  buscarPorIdentificacion(numeroIdentificacion: string): Observable<Cliente> {
    return this.http.get<Cliente>(`${this.apiUrl}/identificacion/${numeroIdentificacion}`);
  }

  // Validar login de cliente
  validarLogin(correo: string, contrasena: string): Observable<Cliente> {
    return this.http.post<Cliente>(`${this.apiUrl}/login`, { correo, contrasena }, this.httpOptions);
  }
}