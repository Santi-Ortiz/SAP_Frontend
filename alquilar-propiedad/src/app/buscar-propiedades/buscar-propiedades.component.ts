import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Propiedad } from '../models/propiedad.model';

interface FiltrosBusqueda {
  tipo: string;
  ubicacion: string;
  numeroCuartos: string;
  rentaMin: number;
  rentaMax: number;
  fechaConstruccionDesde: string;
  fechaConstruccionHasta: string;
}

@Component({
  selector: 'app-buscar-propiedades',
  templateUrl: './buscar-propiedades.component.html',
  styleUrls: ['./buscar-propiedades.component.css']
})
export class BuscarPropiedadesComponent implements OnInit {

  // Propiedades originales (sin filtrar)
  propiedadesOriginales: Propiedad[] = [
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
    },
    {
      id: 5,
      tipo: 'casa',
      direccion: 'Avenida 70 #15-25',
      ubicacion: 'Occidente - Robledo',
      numeroCuartos: 5,
      renta: 2000000,
      identificacionDueno: '99887766',
      nombreDueno: 'Luis Fernando García',
      telefonoDueno: '+57 304 555 6789',
      emailDueno: 'luis.garcia@email.com',
      fotoPrincipal: 'assets/casa3.jpg',
      fechaRegistroCompra: new Date('2022-12-05'),
      fechaConstruccion: new Date('2017-08-15'),
      descripcion: 'Casa campestre con amplio jardín y vista panorámica'
    },
    {
      id: 6,
      tipo: 'apartamento',
      direccion: 'Carrera 43A #20-50 Apto 801',
      ubicacion: 'Centro - El Poblado',
      numeroCuartos: 3,
      renta: 1100000,
      identificacionDueno: '44556677',
      nombreDueno: 'Patricia Ramírez',
      telefonoDueno: '+57 318 444 5555',
      emailDueno: 'patricia.ramirez@email.com',
      fotoPrincipal: 'assets/apto3.jpg',
      fechaRegistroCompra: new Date('2023-08-18'),
      fechaConstruccion: new Date('2020-12-10'),
      descripcion: 'Moderno apartamento con balcón y excelente vista a la ciudad'
    }
  ];

  // Propiedades filtradas que se muestran
  propiedades: Propiedad[] = [];

  // Filtros
  filtros: FiltrosBusqueda = {
    tipo: '',
    ubicacion: '',
    numeroCuartos: '',
    rentaMin: 0,
    rentaMax: 0,
    fechaConstruccionDesde: '',
    fechaConstruccionHasta: ''
  };

  // Opciones para los dropdowns (se generan dinámicamente)
  opcionesTipo: string[] = [];
  opcionesUbicacion: string[] = [];
  opcionesCuartos: number[] = [];
  rangosRenta = [
    { label: 'Cualquier precio', min: 0, max: 0 },
    { label: 'Hasta $500,000', min: 0, max: 500000 },
    { label: '$500,000 - $1,000,000', min: 500000, max: 1000000 },
    { label: '$1,000,000 - $1,500,000', min: 1000000, max: 1500000 },
    { label: '$1,500,000 - $2,000,000', min: 1500000, max: 2000000 },
    { label: 'Más de $2,000,000', min: 2000000, max: 0 }
  ];

  // Estado UI
  mostrarFiltros: boolean = false;
  contadorResultados: number = 0;
  filtrosActivos: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    this.inicializarDatos();
    this.generarOpcionesFiltros();
    this.aplicarFiltros();
  }

  inicializarDatos() {
    this.propiedades = [...this.propiedadesOriginales];
    this.contadorResultados = this.propiedades.length;
  }

  generarOpcionesFiltros() {
    // Generar opciones únicas para tipo
    this.opcionesTipo = [...new Set(this.propiedadesOriginales.map(p => p.tipo))];
    
    // Generar opciones únicas para ubicación
    this.opcionesUbicacion = [...new Set(this.propiedadesOriginales.map(p => p.ubicacion))];
    
    // Generar opciones únicas para número de cuartos
    this.opcionesCuartos = [...new Set(this.propiedadesOriginales.map(p => p.numeroCuartos))].sort((a, b) => a - b);
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros() {
    let propiedadesFiltradas = [...this.propiedadesOriginales];

    // Filtro por tipo
    if (this.filtros.tipo) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.tipo === this.filtros.tipo);
    }

    // Filtro por ubicación
    if (this.filtros.ubicacion) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.ubicacion === this.filtros.ubicacion);
    }

    // Filtro por número de cuartos
    if (this.filtros.numeroCuartos) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.numeroCuartos === +this.filtros.numeroCuartos);
    }

    // Filtro por rango de renta
    if (this.filtros.rentaMin > 0 || this.filtros.rentaMax > 0) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => {
        const cumpleMin = this.filtros.rentaMin === 0 || p.renta >= this.filtros.rentaMin;
        const cumpleMax = this.filtros.rentaMax === 0 || p.renta <= this.filtros.rentaMax;
        return cumpleMin && cumpleMax;
      });
    }

    // Filtro por fecha de construcción desde
    if (this.filtros.fechaConstruccionDesde) {
      const fechaDesde = new Date(this.filtros.fechaConstruccionDesde);
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.fechaConstruccion >= fechaDesde);
    }

    // Filtro por fecha de construcción hasta
    if (this.filtros.fechaConstruccionHasta) {
      const fechaHasta = new Date(this.filtros.fechaConstruccionHasta);
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.fechaConstruccion <= fechaHasta);
    }

    this.propiedades = propiedadesFiltradas;
    this.contadorResultados = this.propiedades.length;
    this.verificarFiltrosActivos();
  }

  onRangoRentaChange(event: any) {
    const rango = this.rangosRenta[event.target.value];
    this.filtros.rentaMin = rango.min;
    this.filtros.rentaMax = rango.max;
    this.aplicarFiltros();
  }

  limpiarFiltros() {
    this.filtros = {
      tipo: '',
      ubicacion: '',
      numeroCuartos: '',
      rentaMin: 0,
      rentaMax: 0,
      fechaConstruccionDesde: '',
      fechaConstruccionHasta: ''
    };
    this.aplicarFiltros();
  }

  verificarFiltrosActivos() {
    this.filtrosActivos = !!(
      this.filtros.tipo ||
      this.filtros.ubicacion ||
      this.filtros.numeroCuartos ||
      this.filtros.rentaMin > 0 ||
      this.filtros.rentaMax > 0 ||
      this.filtros.fechaConstruccionDesde ||
      this.filtros.fechaConstruccionHasta
    );
  }

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