
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import {
  HotelDataService,
  Guest
} from '../../data/hotel-data.service';

@Component({
  selector: 'app-huespedes',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './huespedes.html',
  styleUrl: './huespedes.css'
})
export class Huespedes {

  busqueda = '';
  modalAbierto = false;
  enviado = false;

  // Nombre y apellidos: cada palabra empieza con mayúscula.
  readonly nombrePattern =
    /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)+$/;

  // Correo terminado en .com o .edu.pe.
  readonly correoPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)*\.(com|edu\.pe)$/i;

  // DNI peruano: exactamente 8 dígitos.
  readonly documentoPattern = /^[0-9]{8}$/;

  // Teléfono peruano: exactamente 9 dígitos.
  readonly telefonoPattern = /^[0-9]{9}$/;

  nuevo: Omit<Guest, 'id'> = this.nuevoHuesped();

  constructor(public data: HotelDataService) {}

  private nuevoHuesped(): Omit<Guest, 'id'> {
    return {
      name: '',
      email: '',
      phone: '',
      document: ''
    };
  }

  get allGuests(): Guest[] {
    return this.data.getGuests();
  }

  get guests(): Guest[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.allGuests.filter(g =>
      [
        g.name,
        g.email,
        g.document,
        g.phone
      ].some(value =>
        value.toLowerCase().includes(texto)
      )
    );
  }

  get nombreValido(): boolean {
    return this.nombrePattern.test(this.nuevo.name.trim());
  }

  get correoValido(): boolean {
    return this.correoPattern.test(this.nuevo.email.trim());
  }

  get documentoValido(): boolean {
    return this.documentoPattern.test(this.nuevo.document.trim());
  }

  get telefonoValido(): boolean {
    return this.telefonoPattern.test(this.nuevo.phone.trim());
  }

  get formularioValido(): boolean {
    return (
      this.nombreValido &&
      this.correoValido &&
      this.documentoValido &&
      this.telefonoValido
    );
  }

  abrirModal(): void {
    this.nuevo = this.nuevoHuesped();
    this.enviado = false;
    this.modalAbierto = true;
  }

  cerrarModal(): void {
    this.modalAbierto = false;
    this.enviado = false;
  }

  guardar(formulario: NgForm): void {
    this.enviado = true;

    if (formulario.invalid || !this.formularioValido) {
      formulario.control.markAllAsTouched();
      return;
    }

    // Evitar documentos o correos duplicados.
    const documentoExiste = this.allGuests.some(
      guest => guest.document === this.nuevo.document.trim()
    );

    if (documentoExiste) {
      alert('Este documento ya se encuentra registrado.');
      return;
    }

    const correoExiste = this.allGuests.some(
      guest => guest.email.toLowerCase() === this.nuevo.email.trim().toLowerCase()
    );

    if (correoExiste) {
      alert('Este correo electrónico ya se encuentra registrado.');
      return;
    }

    const nuevoHuesped: Guest = {
      ...this.nuevo,
      name: this.nuevo.name.trim(),
      email: this.nuevo.email.trim().toLowerCase(),
      document: this.nuevo.document.trim(),
      phone: this.nuevo.phone.trim(),
      id: this.data.nextId(this.allGuests)
    };

    this.data.saveGuests([
      ...this.allGuests,
      nuevoHuesped
    ]);

    this.cerrarModal();
  }

  eliminar(guest: Guest): void {
    if (confirm(`¿Eliminar el registro de ${guest.name}?`)) {
      this.data.saveGuests(
        this.allGuests.filter(g => g.id !== guest.id)
      );
    }
  }

  iniciales(name: string): string {
    return name
      .split(' ')
      .filter(p => p.length > 0)
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  }
}
