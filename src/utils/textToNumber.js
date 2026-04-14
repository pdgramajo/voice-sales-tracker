const textToNumber = (text) => {
  const cleanText = text.toLowerCase().replace(/[^\w\s]/g, '').trim();
  
  const units = {
    'cero': 0, 'uno': 1, 'dos': 2, 'tres': 3, 'cuatro': 4,
    'cinco': 5, 'seis': 6, 'siete': 7, 'ocho': 8, 'nueve': 9,
    'un': 1, 'una': 1
  };

  const tens = {
    'diez': 10, 'once': 11, 'doce': 12, 'trece': 13, 'catorce': 14,
    'quince': 15, 'dieciséis': 16, 'diecisiete': 17, 'dieciocho': 18, 'diecinueve': 19,
    'veinte': 20, 'veintiuno': 21, 'veintidós': 22, 'veintitrés': 23, 'veinticuatro': 24,
    'veinticinco': 25, 'veintiséis': 26, 'veintisiete': 27, 'veintiocho': 28, 'veintinueve': 29,
    'treinta': 30, 'cuarenta': 40, 'cincuenta': 50, 'sesenta': 60,
    'setenta': 70, 'ochenta': 80, 'noventa': 90
  };

  const hundreds = {
    'ciento': 100, 'doscientos': 200, 'trescientos': 300, 'cuatrocientos': 400,
    'quinientos': 500, 'seiscientos': 600, 'setecientos': 700, 'ochocientos': 800, 'novecientos': 900
  };

  const scales = {
    'mil': 1000, 'millón': 1000000, 'millones': 1000000,
    'billón': 1000000000, 'billones': 1000000000
  };

  const parts = cleanText.split(/\s+/).filter(p => p);
  let total = 0;
  let currentNumber = 0;

  for (let i = 0; i < parts.length; i++) {
    const word = parts[i];
    
    if (hundreds[word]) {
      currentNumber += hundreds[word];
    } else if (tens[word]) {
      currentNumber += tens[word];
    } else if (units[word]) {
      currentNumber += units[word];
    } else if (word === 'y' && i > 0) {
      continue;
    } else if (scales[word]) {
      if (word === 'mil') {
        if (currentNumber === 0) currentNumber = 1;
        currentNumber *= 1000;
      } else {
        currentNumber *= scales[word];
      }
      total += currentNumber;
      currentNumber = 0;
    } else if (word === 'con' || word === 'pesos' || word === 'peso') {
      continue;
    } else {
      const parsed = parseFloat(word);
      if (!isNaN(parsed)) {
        currentNumber = parsed;
      }
    }
  }

  total += currentNumber;
  return total;
};

export default textToNumber;
