
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

import {
  HotelDataService,
  Reservation
} from '../../data/hotel-data.service';

@Component({
  selector: 'app-reservas',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './reservas.html',
  styleUrl: './reservas.css'
})
export class Reservas {

  busqueda = '';
  filtro = 'Todas';
  modalAbierto = false;
  enviado = false;

  // Cada palabra inicia con mayúscula y continúa en minúsculas.
  readonly nombrePattern =
    /^[A-ZÁÉÍÓÚÑ][a-záéíóúñ]+(?: [A-ZÁÉÍÓÚÑ][a-záéíóúñ]+)*$/;

  // Solo números positivos, sin letras ni signos.
  readonly habitacionPattern = /^[1-9][0-9]*$/;

  readonly estadosPermitidos = [
    'Pendiente',
    'Confirmada',
    'Cancelada'
  ];

  hoy = this.obtenerFechaLocal();

  nueva: Omit<Reservation, 'id'> = this.nuevaReserva();

  constructor(public data: HotelDataService) {}

  private obtenerFechaLocal(): string {
    const fecha = new Date();
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
    const dia = String(fecha.getDate()).padStart(2, '0');

    return `${anio}-${mes}-${dia}`;
  }

  private nuevaReserva(): Omit<Reservation, 'id'> {
    return {
      guest: '',
      room: '',
      checkIn: '',
      checkOut: '',
      status: 'Pendiente'
    };
  }

  get allReservations(): Reservation[] {
    return this.data.getReservations();
  }

  get confirmedCount(): number {
    return this.allReservations.filter(
      r => r.status === 'Confirmada'
    ).length;
  }

  get pendingCount(): number {
    return this.allReservations.filter(
      r => r.status === 'Pendiente'
    ).length;
  }

  get cancelledCount(): number {
    return this.allReservations.filter(
      r => r.status === 'Cancelada'
    ).length;
  }

  get reservations(): Reservation[] {
    const texto = this.busqueda.trim().toLowerCase();

    return this.allReservations.filter(r =>
      (this.filtro === 'Todas' || r.status === this.filtro) &&
      (
        r.guest.toLowerCase().includes(texto) ||
        r.room.toLowerCase().includes(texto)
      )
    );
  }

  get nombreValido(): boolean {
    return this.nombrePattern.test(this.nueva.guest.trim());
  }

  get habitacionValida(): boolean {
    return this.habitacionPattern.test(this.nueva.room.trim());
  }

  get entradaValida(): boolean {
    return !!this.nueva.checkIn &&
      this.nueva.checkIn >= this.hoy;
  }

  get salidaValida(): boolean {
    return !!this.nueva.checkOut &&
      !!this.nueva.checkIn &&
      this.nueva.checkOut > this.nueva.checkIn;
  }

  get estadoValido(): boolean {
    return this.estadosPermitidos.includes(this.nueva.status);
  }

  get formularioValido(): boolean {
    return (
      this.nombreValido &&
      this.habitacionValida &&
      this.entradaValida &&
      this.salidaValida &&
      this.estadoValido
    );
  }

  abrirModal(): void {
    this.nueva = this.nuevaReserva();
    this.enviado = false;
    this.hoy = this.obtenerFechaLocal();
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

    const reserva: Reservation = {
      ...this.nueva,
      guest: this.nueva.guest.trim(),
      room: this.nueva.room.trim(),
      id: this.data.nextId(this.allReservations)
    };

    this.data.saveReservations([
      ...this.allReservations,
      reserva
    ]);

    this.cerrarModal();
  }

  cambiarEstado(
    reservation: Reservation,
    event: Event
  ): void {
    const status = (
      event.target as HTMLSelectElement
    ).value as Reservation['status'];

    if (!this.estadosPermitidos.includes(status)) {
      return;
    }

    this.data.saveReservations(
      this.allReservations.map(r =>
        r.id === reservation.id
          ? { ...r, status }
          : r
      )
    );
  }

  eliminar(reservation: Reservation): void {
    if (confirm(`¿Eliminar la reserva de ${reservation.guest}?`)) {
      this.data.saveReservations(
        this.allReservations.filter(
          r => r.id !== reservation.id
        )
      );
    }
  }
}
