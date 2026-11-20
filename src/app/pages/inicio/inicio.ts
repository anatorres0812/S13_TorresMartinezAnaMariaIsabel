import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HotelDataService } from '../../data/hotel-data.service';

@Component({
  selector: 'app-inicio',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './inicio.html',
  styleUrl: './inicio.css'
})
export class Inicio {

  constructor(public data: HotelDataService) {}

  get rooms() {
    return this.data.getRooms();
  }

  get guests() {
    return this.data.getGuests();
  }

  get reservations() {
    return this.data.getReservations();
  }

  get occupied() {
    return this.rooms.filter(r => r.status === 'Ocupada').length;
  }

  get available() {
    return this.rooms.filter(r => r.status === 'Disponible').length;
  }

  get occupancy() {
    return this.rooms.length
      ? Math.round(this.occupied / this.rooms.length * 100)
      : 0;
  }

  get recent() {
    return this.reservations.slice(-4).reverse();
  }
}