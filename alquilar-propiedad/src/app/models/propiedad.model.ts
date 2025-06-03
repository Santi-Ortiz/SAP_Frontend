import { Cliente } from './cliente.model';

export interface Propiedad {
    id: number;
    tipo: 'casa' | 'apartamento';
    direccion: string;
    ubicacion: string;
    numeroCuartos: number;
    renta: number;
    fotoPrincipal: string;
    fechaRegistroCompra: Date;
    fechaConstruccion: Date;
    descripcion: string;
    usuarioId: number;
    cliente: Cliente;
}