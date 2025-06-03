import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Propiedad } from '../models/propiedad.model';
import { PropiedadService } from '../services/propiedad.service';

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
  propiedadesOriginales: Propiedad[] = [];
  
  // Propiedades filtradas que se muestran
  propiedades: Propiedad[] = [];

  // Estado de carga
  cargando: boolean = false;
  error: string = '';

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

  constructor(
    private router: Router,
    private propiedadService: PropiedadService
  ) {}

  ngOnInit() {
    this.cargarPropiedades();
  }

  cargarPropiedades() {
    this.cargando = true;
    this.error = '';
    
    this.propiedadService.obtenerPropiedades().subscribe({
      next: (propiedades) => {
        console.log('Propiedades recibidas del backend:', propiedades);
        this.propiedadesOriginales = propiedades;
        this.inicializarDatos();
        this.generarOpcionesFiltros();
        this.aplicarFiltros();
        console
        this.cargando = false;
      },
      error: (error) => {
        console.error('Error al cargar propiedades:', error);
        this.error = 'Error al cargar las propiedades. Verifique la conexión con el servidor.';
        this.cargando = false;
        this.propiedadesOriginales = [];
        this.propiedades = [];
      }
    });
  }

  inicializarDatos() {
    this.propiedades = [...this.propiedadesOriginales];
    this.contadorResultados = this.propiedades.length;
    console.log('Propiedades inicializadas:', this.propiedades);
  }

  generarOpcionesFiltros() {
    this.opcionesTipo = [...new Set(this.propiedadesOriginales.map(p => p.tipo))];
    this.opcionesUbicacion = [...new Set(this.propiedadesOriginales.map(p => p.ubicacion))];
    this.opcionesCuartos = [...new Set(this.propiedadesOriginales.map(p => p.numeroCuartos))].sort((a, b) => a - b);
  }

  toggleFiltros() {
    this.mostrarFiltros = !this.mostrarFiltros;
  }

  aplicarFiltros() {
    let propiedadesFiltradas = [...this.propiedadesOriginales];

    if (this.filtros.tipo) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.tipo === this.filtros.tipo);
    }

    if (this.filtros.ubicacion) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.ubicacion === this.filtros.ubicacion);
    }

    if (this.filtros.numeroCuartos) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.numeroCuartos === +this.filtros.numeroCuartos);
    }

    if (this.filtros.rentaMin > 0 || this.filtros.rentaMax > 0) {
      propiedadesFiltradas = propiedadesFiltradas.filter(p => {
        const cumpleMin = this.filtros.rentaMin === 0 || p.renta >= this.filtros.rentaMin;
        const cumpleMax = this.filtros.rentaMax === 0 || p.renta <= this.filtros.rentaMax;
        return cumpleMin && cumpleMax;
      });
    }

    if (this.filtros.fechaConstruccionDesde) {
      const fechaDesde = new Date(this.filtros.fechaConstruccionDesde);
      propiedadesFiltradas = propiedadesFiltradas.filter(p => p.fechaConstruccion >= fechaDesde);
    }

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
    return new Date(fecha).toLocaleDateString('es-CO');
  }

  recargarPropiedades() {
    this.cargarPropiedades();
  }

  // Funciones para obtener información del propietario
  obtenerPropietario(propiedad: Propiedad): string {
    console.log('Verificando propietario de propiedad:', propiedad.cliente);
    return propiedad.cliente.nombre || 'Propietario no disponible';
  }

  obtenerTelefonoPropietario(propiedad: Propiedad): string {
    return 'Sin telefono'; 
  }

  obtenerEmailPropietario(propiedad: Propiedad): string {
    return propiedad.cliente?.correo || 'Email no disponible';
  }

  obtenerIdentificacionPropietario(propiedad: Propiedad): string {
    if (propiedad.cliente) {
      return `${propiedad.cliente.tipoDoc} ${propiedad.cliente.numeroDoc}`;
    }
    return 'ID no disponible';
  }
}