import { Injectable } from '@angular/core';

export interface Room {
  id: number;
  number: string;
  type: string;
  price: number;
  status: 'Disponible' | 'Ocupada' | 'Mantenimiento';
}

export interface Guest {
  id: number;
  name: string;
  email: string;
  phone: string;
  document: string;
}

export interface Reservation {
  id: number;
  guest: string;
  room: string;
  checkIn: string;
  checkOut: string;
  status: 'Confirmada' | 'Pendiente' | 'Cancelada';
}

@Injectable({
  providedIn: 'root'
})
export class HotelDataService {

  private readonly roomKey = 'tinky_rooms';
  private readonly guestKey = 'tinky_guests';
  private readonly reservationKey = 'tinky_reservations';

  private initialRooms: Room[] = [
    { id: 1, number: '101', type: 'Suite Deluxe', price: 280, status: 'Ocupada' },
    { id: 2, number: '102', type: 'Doble Superior', price: 190, status: 'Disponible' },
    { id: 3, number: '103', type: 'Individual', price: 130, status: 'Disponible' },
    { id: 4, number: '201', type: 'Suite Ejecutiva', price: 350, status: 'Ocupada' },
    { id: 5, number: '202', type: 'Doble Superior', price: 190, status: 'Mantenimiento' },
    { id: 6, number: '301', type: 'Suite Presidencial', price: 520, status: 'Disponible' }
  ];

  private initialGuests: Guest[] = [
    { id: 1, name: 'Sofía Martínez', email: 'sofia@email.com', phone: '987 654 321', document: '74851236' },
    { id: 2, name: 'Carlos Mendoza', email: 'carlos@email.com', phone: '965 321 874', document: '71234568' },
    { id: 3, name: 'Valeria Torres', email: 'valeria@email.com', phone: '956 789 123', document: '75612349' },
    { id: 4, name: 'Andrés Flores', email: 'andres@email.com', phone: '944 222 111', document: '73456781' }
  ];

  private initialReservations: Reservation[] = [
    { id: 1, guest: 'Sofía Martínez', room: '101', checkIn: '2026-11-20', checkOut: '2026-11-23', status: 'Confirmada' },
    { id: 2, guest: 'Carlos Mendoza', room: '204', checkIn: '2026-11-20', checkOut: '2026-11-22', status: 'Pendiente' },
    { id: 3, guest: 'Valeria Torres', room: '301', checkIn: '2026-11-21', checkOut: '2026-11-25', status: 'Confirmada' }
  ];

  private read<T>(key: string, initial: T[]): T[] {
    const raw = localStorage.getItem(key);

    if (!raw) {
      localStorage.setItem(key, JSON.stringify(initial));
      return [...initial];
    }

    try {
      return JSON.parse(raw) as T[];
    } catch {
      return [...initial];
    }
  }

  private write<T>(key: string, data: T[]): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getRooms(): Room[] {
    return this.read(this.roomKey, this.initialRooms);
  }

  saveRooms(data: Room[]): void {
    this.write(this.roomKey, data);
  }

  getGuests(): Guest[] {
    return this.read(this.guestKey, this.initialGuests);
  }

  saveGuests(data: Guest[]): void {
    this.write(this.guestKey, data);
  }

  getReservations(): Reservation[] {
    return this.read(this.reservationKey, this.initialReservations);
  }

  saveReservations(data: Reservation[]): void {
    this.write(this.reservationKey, data);
  }

  nextId(items: { id: number }[]): number {
    return items.length
      ? Math.max(...items.map(item => item.id)) + 1
      : 1;
  }
}