export const shapeConfigs = {
  areaRectangle: {
    label: 'Persegi panjang',
    unit: 'Luas',
    fields: [
      { name: 'length', label: 'Panjang', symbol: 'p' },
      { name: 'width', label: 'Lebar', symbol: 'l' },
    ],
  },
  areaTriangle: {
    label: 'Segitiga',
    unit: 'Luas',
    fields: [
      { name: 'base', label: 'Alas', symbol: 'a' },
      { name: 'height', label: 'Tinggi', symbol: 't' },
    ],
  },
  areaCircle: {
    label: 'Lingkaran',
    unit: 'Luas',
    fields: [{ name: 'radius', label: 'Jari-jari', symbol: 'r' }],
  },
  volumeCuboid: {
    label: 'Balok',
    unit: 'Volume',
    fields: [
      { name: 'length', label: 'Panjang', symbol: 'p' },
      { name: 'width', label: 'Lebar', symbol: 'l' },
      { name: 'height', label: 'Tinggi', symbol: 't' },
    ],
  },
  volumeCylinder: {
    label: 'Tabung',
    unit: 'Volume',
    fields: [
      { name: 'radius', label: 'Jari-jari', symbol: 'r' },
      { name: 'height', label: 'Tinggi', symbol: 't' },
    ],
  },
  volumeSphere: {
    label: 'Bola',
    unit: 'Volume',
    fields: [{ name: 'radius', label: 'Jari-jari', symbol: 'r' }],
  },
};

const round = (value) => {
  if (!Number.isFinite(value)) throw new Error('Nilai tidak valid');
  return Number.parseFloat(value.toPrecision(12));
};

export const calculateGeometry = (shape, values) => {
  const numbers = Object.values(values).map(Number);
  if (numbers.some((value) => !Number.isFinite(value) || value <= 0)) {
    throw new Error('Semua ukuran harus lebih dari 0');
  }

  let result;
  switch (shape) {
    case 'areaRectangle':
      result = numbers[0] * numbers[1];
      break;
    case 'areaTriangle':
      result = 0.5 * numbers[0] * numbers[1];
      break;
    case 'areaCircle':
      result = Math.PI * numbers[0] ** 2;
      break;
    case 'volumeCuboid':
      result = numbers[0] * numbers[1] * numbers[2];
      break;
    case 'volumeCylinder':
      result = Math.PI * numbers[0] ** 2 * numbers[1];
      break;
    case 'volumeSphere':
      result = (4 / 3) * Math.PI * numbers[0] ** 3;
      break;
    default:
      throw new Error('Bentuk tidak dikenal');
  }

  return round(result);
};
