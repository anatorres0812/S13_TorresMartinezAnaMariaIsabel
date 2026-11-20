
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import {
  HotelDataService,
  Room
} from '../../data/hotel-data.service';

@Component({
  selector: 'app-habitaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './habitaciones.html',
  styleUrl: './habitaciones.css'
})
export class Habitaciones {

  busqueda = '';
  filtro = 'Todas';
  modalAbierto = false;
  enviado = false;

  readonly numeroPattern = /^[0-9]{3,4}$/;

  readonly tiposHabitacion = [
    'Individual',
    'Doble Superior',
    'Suite Deluxe',
    'Suite Ejecutiva',
    'Suite Presidencial'
  ];

  readonly estadosHabitacion = [
    'Disponible',
    'Ocupada',
    'Mantenimiento'
  ];

  nueva: Omit<Room, 'id'> = this.nuevaHabitacion();

  constructor(public data: HotelDataService) {}

  private nuevaHabitacion(): Omit<Room, 'id'> {
    return {
      number: '',
      type: 'Doble Superior',
      price: 190,
      status: 'Disponible'
    };
  }

  get allRooms(): Room[] {
    return this.data.getRooms();
  }

  get rooms(): Room[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.allRooms.filter(r =>
      (this.filtro === 'Todas' || r.status === this.filtro) &&
      (
        r.number.toLowerCase().includes(texto) ||
        r.type.toLowerCase().includes(texto)
      )
    );
  }

  get available(): number {
    return this.allRooms.filter(
      r => r.status === 'Disponible'
    ).length;
  }

  get occupied(): number {
    return this.allRooms.filter(
      r => r.status === 'Ocupada'
    ).length;
  }

  get maintenance(): number {
    return this.allRooms.filter(
      r => r.status === 'Mantenimiento'
    ).length;
  }

  get numeroValido(): boolean {
    return this.numeroPattern.test(this.nueva.number.trim());
  }

  get tipoValido(): boolean {
    return this.tiposHabitacion.includes(this.nueva.type);
  }

  get precioValido(): boolean {
    const precio = Number(this.nueva.price);

    return (
      this.nueva.price !== null &&
      this.nueva.price !== undefined &&
      Number.isFinite(precio) &&
      precio > 0 &&
      precio <= 100000 &&
      /^\d+(\.\d{1,2})?$/.test(String(this.nueva.price))
    );
  }

  get estadoValido(): boolean {
    return this.estadosHabitacion.includes(this.nueva.status);
  }

  get numeroDuplicado(): boolean {
    const numero = this.nueva.number.trim();

    return this.allRooms.some(
      room => room.number === numero
    );
  }

  get formularioValido(): boolean {
    return (
      this.numeroValido &&
      !this.numeroDuplicado &&
      this.tipoValido &&
      this.precioValido &&
      this.estadoValido
    );
  }

  abrirModal(): void {
    this.nueva = this.nuevaHabitacion();
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

    const habitacion: Room = {
      ...this.nueva,
      number: this.nueva.number.trim(),
      price: Number(this.nueva.price),
      id: this.data.nextId(this.allRooms)
    };

    this.data.saveRooms([
      ...this.allRooms,
      habitacion
    ]);

    this.cerrarModal();
  }

  cambiarEstado(room: Room, event: Event): void {
    const status = (
      event.target as HTMLSelectElement
    ).value as Room['status'];

    if (!this.estadosHabitacion.includes(status)) {
      return;
    }

    this.data.saveRooms(
      this.allRooms.map(r =>
        r.id === room.id
          ? { ...r, status }
          : r
      )
    );
  }

  eliminar(room: Room): void {
    if (confirm(`¿Eliminar la habitación ${room.number}?`)) {
      this.data.saveRooms(
        this.allRooms.filter(r => r.id !== room.id)
      );
    }
  }
}
