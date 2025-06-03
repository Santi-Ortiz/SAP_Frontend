import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../models/propiedad.model';
import { PropiedadService } from '../services/propiedad.service';
import { SolicitudService, Renta } from '../services/renta.service';

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
  cargandoPropiedad: boolean = false;
  error: string = '';

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

  // Controlar si los campos han sido tocados
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

  // Regex para validar email
  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Datos del formulario
  cliente: Cliente = {
    nombre: '',
    contrasena: '',
    correoElectronico: '',
    tipoIdentificacion: '',
    numeroIdentificacion: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadService: PropiedadService,
    private solicitudService: SolicitudService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.propiedadId = +params['id'];
      this.cargarPropiedad();
    });
  }

  cargarPropiedad() {
    this.cargandoPropiedad = true;
    this.error = '';
    
    this.propiedadService.obtenerPropiedadPorId(this.propiedadId).subscribe({
      next: (propiedad) => {
        this.propiedadSeleccionada = propiedad;
        this.cargandoPropiedad = false;
      },
      error: (error) => {
        console.error('Error al cargar la propiedad:', error);
        this.error = 'Error al cargar la propiedad. Redirigiendo...';
        this.cargandoPropiedad = false;
        // Redirigir después de 3 segundos
        setTimeout(() => {
          this.router.navigate(['/propiedades']);
        }, 3000);
      }
    });
  }

  // ...existing code... (mantener todas las funciones de validación)
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

    const solicitud: Renta = {
      propiedadId: this.propiedadId,
      nombreSolicitante: this.cliente.nombre,
      correoElectronico: this.cliente.correoElectronico,
      contrasena: this.cliente.contrasena,
      tipoIdentificacion: this.cliente.tipoIdentificacion,
      numeroIdentificacion: this.cliente.numeroIdentificacion
    };

    // Enviar al backend
    this.solicitudService.enviarSolicitudRenta(solicitud).subscribe({
      next: (response: { numeroReferencia: string; }) => {
        console.log('Solicitud enviada exitosamente:', response);
        
        // Generar datos para mostrar
        this.fechaSolicitud = new Date().toLocaleDateString('es-CO');
        this.numeroReferencia = response.numeroReferencia || `ALQ${this.propiedadId}${Date.now()}`;
        
        this.procesando = false;
        this.mostrarFormulario = false;
        this.solicitudEnviada = true;
      },
      error: (error: { status: number; error: { message: any; }; message: any; }) => {
        console.error('Error al enviar solicitud:', error);
        this.procesando = false;
        
        // Mostrar mensaje de error específico
        if (error.status === 0) {
          alert('Error de conexión. No se pudo conectar con el servidor. Verifique su conexión a internet.');
        } else if (error.status === 500) {
          alert('Error del servidor. Por favor, intente nuevamente más tarde.');
        } else {
          alert('Error al enviar la solicitud: ' + (error.error?.message || error.message));
        }
      }
    });
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