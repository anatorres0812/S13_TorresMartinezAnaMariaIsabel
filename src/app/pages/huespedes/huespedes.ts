import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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

  nuevo: Omit<Guest, 'id'> = {
    name: '',
    email: '',
    phone: '',
    document: ''
  };

  constructor(public data: HotelDataService) {}

  get allGuests() {
    return this.data.getGuests();
  }

  get guests() {
    return this.allGuests.filter(g =>
      [
        g.name,
        g.email,
        g.document
      ].some(v =>
        v.toLowerCase().includes(
          this.busqueda.toLowerCase()
        )
      )
    );
  }

  abrirModal() {
    this.nuevo = {
      name: '',
      email: '',
      phone: '',
      document: ''
    };

    this.modalAbierto = true;
  }

  guardar() {

    if (
      !this.nuevo.name.trim() ||
      !this.nuevo.email.trim() ||
      !this.nuevo.document.trim()
    ) {
      alert(
        'Completa nombre, correo y documento.'
      );
      return;
    }

    const list = [
      ...this.allGuests,
      {
        ...this.nuevo,
        id: this.data.nextId(this.allGuests)
      }
    ];

    this.data.saveGuests(list);
    this.modalAbierto = false;
  }

  eliminar(guest: Guest) {

    if (confirm(`¿Eliminar el registro de ${guest.name}?`)) {

      this.data.saveGuests(
        this.allGuests.filter(g => g.id !== guest.id)
      );

    }
  }

  iniciales(name: string) {
    return name
      .split(' ')
      .slice(0, 2)
      .map(p => p[0])
      .join('')
      .toUpperCase();
  }
}