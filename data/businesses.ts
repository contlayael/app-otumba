export const businessesData: Record<string, {
    name: string;
    description: string;
    address: string;
    phone: string;
    hours: string;
    image: string;
    latitude: number;
    longitude: number;
  }> = {
    'comida-1': {
      name: 'Tacos El Güero',
      description: 'Tacos al pastor, bistec y suadero con tortillas hechas a mano.',
      address: 'Calle Juárez #12, Otumba, Edo. Méx.',
      phone: '5551234567',
      hours: 'Lun-Dom 12:00pm - 11:00pm',
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60',
      latitude: 19.7005,
      longitude: -98.7542,
    },
    'comida-2': {
      name: 'Gorditas Doña Mary',
      description: 'Gorditas rellenas de chicharrón, requesón y más, estilo casero.',
      address: 'Calle Hidalgo #45, Otumba Centro',
      phone: '5549876543',
      hours: 'Lun-Sáb 9:00am - 6:00pm',
      image: 'https://images.unsplash.com/photo-1600891964599-f61ba0e24092?auto=format&fit=crop&w=800&q=60',
      latitude: 19.7005,
      longitude: -98.7542,
    },
    // agrega más...
  };
  