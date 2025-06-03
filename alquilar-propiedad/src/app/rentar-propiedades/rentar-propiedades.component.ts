import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Propiedad } from '../models/propiedad.model';
import { PropiedadService } from '../services/propiedad.service';
import { SolicitudService, Renta } from '../services/renta.service';

interface Cliente {
  nombre: string;
  contrasena: string;
  correo: string;
  tipoDoc: string;
  numeroDoc: string;
}

@Component({
  selector: 'app-rentar-propiedades',
  templateUrl: './rentar-propiedades.component.html',
  styleUrls: ['./rentar-propiedades.component.css']
})
export class RentarPropiedadesComponent implements OnInit {

  idPropiedad: number = 0; 
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
    correo: string;
    tipoDoc: string;
    numeroDoc: string;
  } = {
    nombre: '',
    contrasena: '',
    correo: '',
    tipoDoc: '',
    numeroDoc: ''
  };

  // Controlar si los campos han sido tocados
  camposTocados: {
    nombre: boolean;
    contrasena: boolean;
    correo: boolean;
    tipoDoc: boolean;
    numeroDoc: boolean;
  } = {
    nombre: false,
    contrasena: false,
    correo: false,
    tipoDoc: false,
    numeroDoc: false
  };

  // Regex para validar email
  private emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Datos del formulario
  cliente: Cliente = {
    nombre: '',
    contrasena: '',
    correo: '',
    tipoDoc: '',
    numeroDoc: ''
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private propiedadService: PropiedadService,
    private solicitudService: SolicitudService
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.idPropiedad = +params['id']; // Conservando idPropiedad
      this.cargarPropiedad();
    });
  }

  cargarPropiedad() {
    this.cargandoPropiedad = true;
    this.error = '';
    
    this.propiedadService.obtenerPropiedadPorId(this.idPropiedad).subscribe({
      next: (propiedad) => {
        console.log('Propiedad cargada desde API:', propiedad);
        this.propiedadSeleccionada = propiedad;
        this.cargandoPropiedad = false;
      },
      error: (error) => {
        console.error('Error al cargar la propiedad:', error);
        this.error = 'Error al cargar la propiedad. Verifique la conexión con el servidor.';
        this.cargandoPropiedad = false;
        
        // Redirigir después de 3 segundos si hay error
        setTimeout(() => {
          this.router.navigate(['/propiedades']);
        }, 3000);
      }
    });
  }

  // ...existing code... (mantener todas las funciones de validación exactamente igual)
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
    if (!this.camposTocados.correo) return true;
    
    const email = this.cliente.correo.trim();
    
    if (!email) {
      this.errores.correo = 'El correo electrónico es obligatorio';
      return false;
    }
    
    if (!this.emailRegex.test(email)) {
      this.errores.correo = 'Por favor ingrese un correo electrónico válido (ejemplo: usuario@dominio.com)';
      return false;
    }
    
    this.errores.correo = '';
    return true;
  }

  validarTipoIdentificacion(): boolean {
    if (!this.camposTocados.tipoDoc) return true;
    
    if (!this.cliente.tipoDoc) {
      this.errores.tipoDoc = 'Debe seleccionar un tipo de identificación';
      return false;
    }
    this.errores.tipoDoc = '';
    return true;
  }

  validarNumeroIdentificacion(): boolean {
    if (!this.camposTocados.numeroDoc) return true;
    
    const numero = this.cliente.numeroDoc.trim();
    
    if (!numero) {
      this.errores.numeroDoc = 'El número de identificación es obligatorio';
      return false;
    }
    
    if (numero.length < 5) {
      this.errores.numeroDoc = 'El número de identificación debe tener al menos 5 caracteres';
      return false;
    }
    
    if (!/^[0-9a-zA-Z-]+$/.test(numero)) {
      this.errores.numeroDoc = 'El número de identificación solo puede contener números, letras y guiones';
      return false;
    }
    
    this.errores.numeroDoc = '';
    return true;
  }

  // Validación sin mostrar errores (para habilitar/deshabilitar botón)
  validarFormularioSinErrores(): boolean {
    const nombreValido = this.cliente.nombre.trim().length >= 2 && 
                        /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(this.cliente.nombre.trim());
    const contrasenaValida = this.cliente.contrasena.trim().length >= 6;
    const correoValido = this.emailRegex.test(this.cliente.correo.trim());
    const tipoIdValido = this.cliente.tipoDoc !== '';
    const numeroIdValido = this.cliente.numeroDoc.trim().length >= 5 &&
                          /^[0-9a-zA-Z-]+$/.test(this.cliente.numeroDoc.trim());

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
    this.camposTocados.correo = true;
    this.validarCorreoElectronico();
  }

  onBlurTipoId() {
    this.camposTocados.tipoDoc = true;
    this.validarTipoIdentificacion();
  }

  onBlurNumeroId() {
    this.camposTocados.numeroDoc = true;
    this.validarNumeroIdentificacion();
  }

  // Validación completa al enviar
  validarFormularioCompleto(): boolean {
    // Marcar todos los campos como tocados
    this.camposTocados = {
      nombre: true,
      contrasena: true,
      correo: true,
      tipoDoc: true,
      numeroDoc: true
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

    // Preparar solicitud usando idPropiedad pero mapeando a propiedadId para el backend
    const solicitud: Renta = {
      idPropiedad: this.idPropiedad, // Backend espera propiedadId
      nombre: this.cliente.nombre,
      correo: this.cliente.correo,
      contrasena: this.cliente.contrasena,
      tipoDoc: this.cliente.tipoDoc,
      numeroDoc: this.cliente.numeroDoc
    };

    /*const solicitud: Renta = {
      idPropiedad: 1,
      nombre: "Juanita Franco",
      correo: "franco_juanita@javeriana.edu.co",
      contrasena: "1234",
      tipoDoc: "CC",
      numeroDoc: "123456"  
    }*/

    // Enviar al backend
    this.solicitudService.enviarSolicitudRenta(solicitud).subscribe({
      next: (response: any) => {
        console.log('Solicitud enviada exitosamente:', response);
        
        
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

  // Funciones para obtener información del propietario (sin parámetros)
  obtenerPropietario(): string {
    console.log('Verificando propietario de propiedadSeleccionada:', this.propiedadSeleccionada);
    return this.propiedadSeleccionada?.cliente?.nombre || 'Propietario no disponible';
  }

  obtenerEmailPropietario(): string {
    return this.propiedadSeleccionada?.cliente?.correo || 'Email no disponible';
  }

  obtenerIdentificacionPropietario(): string {
    if (this.propiedadSeleccionada?.cliente) {
      return `${this.propiedadSeleccionada.cliente.tipoDoc} ${this.propiedadSeleccionada.cliente.numeroDoc}`;
    }
    return 'ID no disponible';
  }

  obtenerTelefonoPropietario(): string {
    return '+57 300 123 4567'; // Temporal
  }
}