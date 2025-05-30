import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../models/propiedad.model';

interface Cliente {
  nombre: string;
  contrasena: string;
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

  // Estado de validación
  errores: {
    nombre: string;
    contrasena: string;
    correoElectronico: string;
    tipoIdentificacion: string;
    numeroIdentificacion: string;
  } = {
    nombre: '',
    contrasena: '',
    correoElectronico: '',
    tipoIdentificacion: '',
    numeroIdentificacion: ''
  };

  // Controlar si los campos han sido cambiados
  camposTocados: {
    nombre: boolean;
    contrasena: boolean;
    correoElectronico: boolean;
    tipoIdentificacion: boolean;
    numeroIdentificacion: boolean;
  } = {
    nombre: false,
    contrasena: false,
    correoElectronico: false,
    tipoIdentificacion: false,
    numeroIdentificacion: false
  };

  // Regex para validar el correo electrónico
  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Datos del formulario
  cliente: Cliente = {
    nombre: '',
    contrasena: '',
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

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propiedadId = +params['id'];
      this.cargarPropiedad();
    });
  }

  cargarPropiedad() {
    this.propiedadSeleccionada = this.propiedades.find(p => p.id === this.propiedadId) || null;
    if (!this.propiedadSeleccionada) {
      this.router.navigate(['/propiedades']);
    }
  }

  // Validación individual de campos
  validarNombre(): boolean {
    if (!this.camposTocados.nombre) return true;
    
    if (this.cliente.nombre.trim().length < 2) {
      this.errores.nombre = 'El nombre debe tener al menos 2 caracteres';
      return false;
    }
    if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.cliente.nombre.trim())) {
      this.errores.nombre = 'El nombre solo puede contener letras y espacios';
      return false;
    }
    this.errores.nombre = '';
    return true;
  }

  validarContrasena(): boolean {
    if (!this.camposTocados.contrasena) return true;
    
    if (this.cliente.contrasena.trim().length < 6) {
      this.errores.contrasena = 'La contraseña debe tener al menos 6 caracteres';
      return false;
    }
    this.errores.contrasena = '';
    return true;
  }

  validarCorreoElectronico(): boolean {
    if (!this.camposTocados.correoElectronico) return true;
    
    const email = this.cliente.correoElectronico.trim();
    
    if (!email) {
      this.errores.correoElectronico = 'El correo electrónico es obligatorio';
      return false;
    }
    
    if (!this.emailRegex.test(email)) {
      this.errores.correoElectronico = 'Por favor ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)';
      return false;
    }
    
    this.errores.correoElectronico = '';
    return true;
  }

  validarTipoIdentificacion(): boolean {
    if (!this.camposTocados.tipoIdentificacion) return true;
    
    if (!this.cliente.tipoIdentificacion) {
      this.errores.tipoIdentificacion = 'Debe seleccionar un tipo de identificación';
      return false;
    }
    this.errores.tipoIdentificacion = '';
    return true;
  }

  validarNumeroIdentificacion(): boolean {
    if (!this.camposTocados.numeroIdentificacion) return true;
    
    const numero = this.cliente.numeroIdentificacion.trim();
    
    if (!numero) {
      this.errores.numeroIdentificacion = 'El número de identificación es obligatorio';
      return false;
    }
    
    if (numero.length < 5) {
      this.errores.numeroIdentificacion = 'El número de identificación debe tener al menos 5 caracteres';
      return false;
    }
    
    if (!/^[0-9a-zA-Z-]+$/.test(numero)) {
      this.errores.numeroIdentificacion = 'El número de identificación solo puede contener números, letras y guiones';
      return false;
    }
    
    this.errores.numeroIdentificacion = '';
    return true;
  }

  // Validación sin mostrar errores (para habilitar/deshabilitar botón)
  validarFormularioSinErrores(): boolean {
    const nombreValido = this.cliente.nombre.trim().length >= 2 && 
                        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.cliente.nombre.trim());
    const contrasenaValida = this.cliente.contrasena.trim().length >= 6;
    const correoValido = this.emailRegex.test(this.cliente.correoElectronico.trim());
    const tipoIdValido = this.cliente.tipoIdentificacion !== '';
    const numeroIdValido = this.cliente.numeroIdentificacion.trim().length >= 5 &&
                          /^[0-9a-zA-Z-]+$/.test(this.cliente.numeroIdentificacion.trim());

    return nombreValido && contrasenaValida && correoValido && tipoIdValido && numeroIdValido;
  }

  // Eventos cuando el usuario sale de un campo (blur)
  onBlurNombre() {
    this.camposTocados.nombre = true;
    this.validarNombre();
  }

  onBlurContrasena() {
    this.camposTocados.contrasena = true;
    this.validarContrasena();
  }

  onBlurCorreo() {
    this.camposTocados.correoElectronico = true;
    this.validarCorreoElectronico();
  }

  onBlurTipoId() {
    this.camposTocados.tipoIdentificacion = true;
    this.validarTipoIdentificacion();
  }

  onBlurNumeroId() {
    this.camposTocados.numeroIdentificacion = true;
    this.validarNumeroIdentificacion();
  }

  // Validación completa al enviar
  validarFormularioCompleto(): boolean {
    // Marcar todos los campos como tocados
    this.camposTocados = {
      nombre: true,
      contrasena: true,
      correoElectronico: true,
      tipoIdentificacion: true,
      numeroIdentificacion: true
    };

    // Validar todos los campos
    const nombreValido = this.validarNombre();
    const contrasenaValida = this.validarContrasena();
    const correoValido = this.validarCorreoElectronico();
    const tipoIdValido = this.validarTipoIdentificacion();
    const numeroIdValido = this.validarNumeroIdentificacion();

    return nombreValido && contrasenaValida && correoValido && tipoIdValido && numeroIdValido;
  }

  enviarSolicitud() {
    if (!this.validarFormularioCompleto()) {
      alert('Por favor, corrija los errores en el formulario antes de continuar.');
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