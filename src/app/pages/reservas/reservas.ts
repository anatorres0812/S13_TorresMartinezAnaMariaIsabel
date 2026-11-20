import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  nueva: Omit<Reservation, 'id'> = {
    guest: '',
    room: '',
    checkIn: '',
    checkOut: '',
    status: 'Pendiente'
  };

  constructor(public data: HotelDataService) {}

  get allReservations() {
    return this.data.getReservations();
  }

  get confirmedCount() {
    return this.allReservations.filter(
      r => r.status === 'Confirmada'
    ).length;
  }

  get pendingCount() {
    return this.allReservations.filter(
      r => r.status === 'Pendiente'
    ).length;
  }

  get cancelledCount() {
    return this.allReservations.filter(
      r => r.status === 'Cancelada'
    ).length;
  }

  get reservations() {
    return this.allReservations.filter(r =>
      (this.filtro === 'Todas' || r.status === this.filtro) &&
      (
        r.guest.toLowerCase().includes(
          this.busqueda.toLowerCase()
        ) ||
        r.room.toLowerCase().includes(
          this.busqueda.toLowerCase()
        )
      )
    );
  }

  abrirModal() {
    this.nueva = {
      guest: '',
      room: '',
      checkIn: '',
      checkOut: '',
      status: 'Pendiente'
    };

    this.modalAbierto = true;
  }

  guardar() {

    if (
      !this.nueva.guest.trim() ||
      !this.nueva.room.trim() ||
      !this.nueva.checkIn ||
      !this.nueva.checkOut
    ) {
      alert('Completa todos los datos de la reserva.');
      return;
    }

    if (this.nueva.checkOut <= this.nueva.checkIn) {
      alert(
        'La fecha de salida debe ser posterior a la fecha de entrada.'
      );
      return;
    }

    const list = [
      ...this.allReservations,
      {
        ...this.nueva,
        id: this.data.nextId(this.allReservations)
      }
    ];

    this.data.saveReservations(list);
    this.modalAbierto = false;
  }

  cambiarEstado(
    reservation: Reservation,
    event: Event
  ) {

    const status = (
      event.target as HTMLSelectElement
    ).value as Reservation['status'];

    this.data.saveReservations(
      this.allReservations.map(r =>
        r.id === reservation.id
          ? { ...r, status }
          : r
      )
    );
  }

  eliminar(reservation: Reservation) {

    if (confirm(`¿Eliminar la reserva de ${reservation.guest}?`)) {

      this.data.saveReservations(
        this.allReservations.filter(
          r => r.id !== reservation.id
        )
      );

    }
  }
}