export interface Propiedad {
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