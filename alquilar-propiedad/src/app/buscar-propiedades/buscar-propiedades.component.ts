import { Component } from '@angular/core';
import { Router } from '@angular/router';

interface Propiedad {
  id: number;
  tipo: 'casa' | 'apartamento';
  direccion: string;
  ubicacion: string;
  numeroCuartos: number;
  renta: number;
  identificacionDueno: string;
  nombreDueno: string;
  telefonoDueno: string;
  emailDueno: string;
  fotoPrincipal: string;
  fechaRegistroCompra: Date;
  fechaConstruccion: Date;
  descripcion: string;
}

@Component({
  selector: 'app-buscar-propiedades',
  templateUrl: './buscar-propiedades.component.html',
  styleUrls: ['./buscar-propiedades.component.css']
})
export class BuscarPropiedadesComponent {

  propiedades: Propiedad[] = [
    {
      id: 1,
      tipo: 'casa',
      direccion: 'Calle 123 #45-67',
      ubicacion: 'Zona Norte - Barrio Laureles',
      numeroCuartos: 3,
      renta: 1200000,
      identificacionDueno: '12345678',
      nombreDueno: 'Juanita Franco Sánchez',
      telefonoDueno: '+57 301 234 5678',
      emailDueno: 'juanita.franco@email.com',
      fotoPrincipal: 'assets/casa1.jpg',
      fechaRegistroCompra: new Date('2023-01-15'),
      fechaConstruccion: new Date('2020-03-10'),
      descripcion: 'Hermosa casa familiar con jardín amplio y garage para 2 vehículos'
    },
    {
      id: 2,
      tipo: 'apartamento',
      direccion: 'Carrera 80 #25-30 Apto 502',
      ubicacion: 'Centro - El Poblado',
      numeroCuartos: 2,
      renta: 800000,
      identificacionDueno: '87654321',
      nombreDueno: 'Gabriel Espitia',
      telefonoDueno: '+57 312 987 6543',
      emailDueno: 'gaby_esp@gmail.com',
      fotoPrincipal: 'assets/apto1.jpg',
      fechaRegistroCompra: new Date('2023-06-20'),
      fechaConstruccion: new Date('2019-11-15'),
      descripcion: 'Moderno apartamento en zona céntrica con excelente ubicación'
    },
    {
      id: 3,
      tipo: 'casa',
      direccion: 'Calle 45 #12-89',
      ubicacion: 'Sur - Envigado',
      numeroCuartos: 4,
      renta: 1500000,
      identificacionDueno: '11223344',
      nombreDueno: 'Santiago Ortiz Alarcón',
      telefonoDueno: '+57 320 456 7890',
      emailDueno: 'santiago.ortiz@email.com',
      fotoPrincipal: 'assets/casa2.jpg',
      fechaRegistroCompra: new Date('2022-09-10'),
      fechaConstruccion: new Date('2018-05-20'),
      descripcion: 'Amplia casa de dos pisos con piscina y zona social'
    },
    {
      id: 4,
      tipo: 'apartamento',
      direccion: 'Carrera 15 #78-90 Apto 301',
      ubicacion: 'Norte - La Candelaria',
      numeroCuartos: 1,
      renta: 600000,
      identificacionDueno: '55667788',
      nombreDueno: 'Ana Sofía Martínez',
      telefonoDueno: '+57 315 123 4567',
      emailDueno: 'ana.martinez@email.com',
      fotoPrincipal: 'assets/apto2.jpg',
      fechaRegistroCompra: new Date('2023-03-12'),
      fechaConstruccion: new Date('2021-07-22'),
      descripcion: 'Acogedor apartamento tipo estudio, perfecto para estudiantes'
    }
  ];
  
  constructor(private router: Router) {}

  rentar(propiedad: Propiedad) {
    this.router.navigate(['/renta', propiedad.id]);
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }

  formatearFecha(fecha: Date): string {
    return fecha.toLocaleDateString('es-CO');
  }

}
