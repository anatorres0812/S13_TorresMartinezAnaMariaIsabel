import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
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

  nueva: Omit<Room, 'id'> = {
    number: '',
    type: 'Doble Superior',
    price: 190,
    status: 'Disponible'
  };

  constructor(public data: HotelDataService) {}

  get rooms() {
    return this.data.getRooms().filter(r =>
      (this.filtro === 'Todas' || r.status === this.filtro) &&
      (
        r.number.toLowerCase().includes(this.busqueda.toLowerCase()) ||
        r.type.toLowerCase().includes(this.busqueda.toLowerCase())
      )
    );
  }

  get allRooms() {
    return this.data.getRooms();
  }

  get available() {
    return this.allRooms.filter(r => r.status === 'Disponible').length;
  }

  get occupied() {
    return this.allRooms.filter(r => r.status === 'Ocupada').length;
  }

  get maintenance() {
    return this.allRooms.filter(r => r.status === 'Mantenimiento').length;
  }

  abrirModal() {
    this.nueva = {
      number: '',
      type: 'Doble Superior',
      price: 190,
      status: 'Disponible'
    };

    this.modalAbierto = true;
  }

  guardar() {

    if (
      !this.nueva.number.trim() ||
      this.allRooms.some(
        r => r.number === this.nueva.number.trim()
      )
    ) {
      alert(
        'Ingresa un número de habitación válido y que no esté registrado.'
      );
      return;
    }

    const list = [
      ...this.allRooms,
      {
        ...this.nueva,
        number: this.nueva.number.trim(),
        id: this.data.nextId(this.allRooms)
      }
    ];

    this.data.saveRooms(list);
    this.modalAbierto = false;
  }

  cambiarEstado(room: Room, event: Event) {

    const status = (
      event.target as HTMLSelectElement
    ).value as Room['status'];

    this.data.saveRooms(
      this.allRooms.map(r =>
        r.id === room.id
          ? { ...r, status }
          : r
      )
    );
  }

  eliminar(room: Room) {

    if (confirm(`¿Eliminar la habitación ${room.number}?`)) {

      this.data.saveRooms(
        this.allRooms.filter(r => r.id !== room.id)
      );

    }
  }
}