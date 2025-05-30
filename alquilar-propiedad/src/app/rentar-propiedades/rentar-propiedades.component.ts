import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../models/propiedad.model';

interface Cliente {
  nombre: string;
  correoElectronico: string;
  tipoIdentificacion: string;
  numeroIdentificacion: string;
}

@Component({
  selector: 'app-rentar-propiedades',
  templateUrl: './rentar-propiedades.component.html',
  styleUrls: ['./rentar-propiedades.component.css']
})
export class RentarPropiedadesComponent implements OnInit {

  propiedadId: number = 0;
  propiedadSeleccionada: Propiedad | null = null;
  mostrarFormulario: boolean = true;
  solicitudEnviada: boolean = false;
  procesando: boolean = false;

  // Nuevas propiedades para fecha y número de referencia
  fechaSolicitud: string = '';
  numeroReferencia: string = '';

  // Datos del formulario
  cliente: Cliente = {
    nombre: '',
    correoElectronico: '',
    tipoIdentificacion: '',
    numeroIdentificacion: ''
  };

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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Obtener el ID de la propiedad de la URL
    this.route.params.subscribe(params => {
      this.propiedadId = +params['id'];
      this.cargarPropiedad();
    });
  }

  cargarPropiedad() {
    this.propiedadSeleccionada = this.propiedades.find(p => p.id === this.propiedadId) || null;
    if (!this.propiedadSeleccionada) {
      // Si no encuentra la propiedad, redirigir a buscar
      this.router.navigate(['/propiedades']);
    }
  }

  validarFormulario(): boolean {
    return this.cliente.nombre.trim() !== '' &&
           this.cliente.correoElectronico.trim() !== '' &&
           this.cliente.tipoIdentificacion !== '' &&
           this.cliente.numeroIdentificacion.trim() !== '';
  }

  enviarSolicitud() {
    if (!this.validarFormulario()) {
      alert('Por favor, complete todos los campos requeridos.');
      return;
    }

    this.procesando = true;

    // Generar fecha y número de referencia al momento de enviar
    this.fechaSolicitud = new Date().toLocaleDateString('es-CO');
    this.numeroReferencia = `ALQ${this.propiedadSeleccionada?.id}${Date.now()}`;

    // Simular procesamiento (3 segundos)
    setTimeout(() => {
      this.procesando = false;
      this.mostrarFormulario = false;
      this.solicitudEnviada = true;
      
      console.log('Solicitud enviada:', {
        propiedad: this.propiedadSeleccionada,
        cliente: this.cliente,
        fecha: this.fechaSolicitud,
        referencia: this.numeroReferencia
      });
    }, 3000);
  }

  volverABuscar() {
    this.router.navigate(['/propiedades']);
  }

  formatearPrecio(precio: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(precio);
  }
}