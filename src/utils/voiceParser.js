import textToNumber from './textToNumber';

export const parseVoiceCommand = (text) => {
  const words = text.toLowerCase();
  
  if (words.includes('inicio de caja')) {
    const amount = textToNumber(text);
    if (!amount || amount <= 0) {
      return { success: false, error: 'Monto no válido' };
    }
    return { success: true, type: 'initial-balance', amount };
  }
  
  if (words.includes('retiro')) {
    const amount = textToNumber(text);
    if (!amount || amount <= 0) {
      return { success: false, error: 'Monto no válido' };
    }
    const remaining = words.replace('retiro', '').replace(/\d+/g, '').trim();
    const wordList = remaining.split(/\s+/).filter(w => w.length > 0 && !['mil', 'cientos', 'ciento', 'quinientos', 'quinientas'].includes(w));
    const comment = wordList.join(' ') || 'Retiro';
    return { success: true, type: 'withdrawal', amount, description: comment };
  }
  
  let type = null;
  let method = null;
  
  if (words.includes('venta')) {
    type = 'sale';
  } else if (words.includes('gasto')) {
    type = 'expense';
  }
  
  if (words.includes('efectivo')) {
    method = 'efectivo';
  } else if (words.includes('transferencia') || words.includes('transferir')) {
    method = 'transferencia';
  }
  
  const amount = textToNumber(text);
  
  if (!amount || amount <= 0) {
    return { success: false, error: 'Monto no válido' };
  }
  
  if (type === 'expense') {
    let description = '';
    const wordList = words.split(' ');
    const expenseIndex = wordList.indexOf('gasto');
    const inIndex = wordList.indexOf('en', expenseIndex);
    if (inIndex !== -1) {
      description = wordList.slice(inIndex + 1).join(' ');
    }
    return { success: true, type: 'expense', amount, description };
  }
  
  if (type === 'sale') {
    if (!method) {
      return { success: false, error: 'Indica Efec o Trans' };
    }
    return { success: true, type: 'sale', method, amount };
  }
  
  if (method && !type) {
    return { success: false, error: 'Indica Venta o Gasto' };
  }
  
  return { success: false, error: 'Indica Venta o Gasto' };
};
