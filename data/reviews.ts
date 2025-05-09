export const reviewsData: Record<string, {
    username: string;
    rating: number; // de 1 a 5
    comment: string;
  }[]> = {
    'comida-1': [
      {
        username: 'Luis G.',
        rating: 5,
        comment: 'Los mejores tacos de Otumba, sin duda. Tortilla recién hecha 🔥',
      },
      {
        username: 'Ana R.',
        rating: 4,
        comment: 'Muy ricos, aunque algo tardado el servicio.',
      },
    ],
    'comida-2': [
      {
        username: 'Pedro M.',
        rating: 5,
        comment: 'La doña cocina delicioso. Súper casero y económico.',
      },
    ],
  };
  