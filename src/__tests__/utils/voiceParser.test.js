import { parseVoiceCommand } from '../../utils/voiceParser';

describe('voiceParser - Mensajes de Error', () => {
  describe('Errores con prefijo ❌', () => {
    test('"venta abc efectivo" retorna error con ❌', () => {
      const result = parseVoiceCommand('venta abc efectivo');
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^❌/);
      expect(result.error).toContain('Monto no válido');
    });

    test('"venta mil" sin método retorna error con ❌', () => {
      const result = parseVoiceCommand('venta mil');
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^❌/);
      expect(result.error).toContain('Indica Efec o Trans');
    });

    test('"quinientos efectivo" sin tipo retorna error con ❌', () => {
      const result = parseVoiceCommand('quinientos efectivo');
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^❌/);
      expect(result.error).toContain('Indica Venta o Gasto');
    });

    test('"treinta transferencia" sin tipo retorna error con ❌', () => {
      const result = parseVoiceCommand('treinta transferencia');
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^❌/);
      expect(result.error).toContain('Indica Venta o Gasto');
    });

    test('"inicio de caja abc" monto inválido retorna error con ❌', () => {
      const result = parseVoiceCommand('inicio de caja abc');
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^❌/);
      expect(result.error).toContain('Monto no válido');
    });

    test('"retiro abc Juan" monto inválido retorna error con ❌', () => {
      const result = parseVoiceCommand('retiro abc Juan');
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^❌/);
      expect(result.error).toContain('Monto no válido');
    });

    test('"gasto abc en papel" monto inválido retorna error con ❌', () => {
      const result = parseVoiceCommand('gasto abc en papel');
      expect(result.success).toBe(false);
      expect(result.error).toMatch(/^❌/);
      expect(result.error).toContain('Monto no válido');
    });
  });
});

describe('voiceParser - Ventas', () => {
  test('"venta mil efectivo" retorna sale con amount 1000', () => {
    const result = parseVoiceCommand('venta mil efectivo');
    expect(result.success).toBe(true);
    expect(result.type).toBe('sale');
    expect(result.amount).toBe(1000);
    expect(result.method).toBe('efectivo');
  });

  test('"venta dos mil transferencia" retorna sale con transferencia', () => {
    const result = parseVoiceCommand('venta dos mil transferencia');
    expect(result.success).toBe(true);
    expect(result.type).toBe('sale');
    expect(result.amount).toBe(2000);
    expect(result.method).toBe('transferencia');
  });

  test('"venta trescientos efectivo" reconoce efectivo', () => {
    const result = parseVoiceCommand('venta trescientos efectivo');
    expect(result.success).toBe(true);
    expect(result.type).toBe('sale');
    expect(result.amount).toBe(300);
    expect(result.method).toBe('efectivo');
  });

  test('"venta transferir mil" reconoce transferir como transferencia', () => {
    const result = parseVoiceCommand('venta transferir mil');
    expect(result.success).toBe(true);
    expect(result.type).toBe('sale');
    expect(result.amount).toBe(1000);
    expect(result.method).toBe('transferencia');
  });

  test('números grandes funcionan correctamente', () => {
    const result = parseVoiceCommand('venta cinco mil efectivo');
    expect(result.success).toBe(true);
    expect(result.amount).toBe(5000);
  });
});

describe('voiceParser - Gastos', () => {
  test('"gasto doscientos en papel" retorna expense', () => {
    const result = parseVoiceCommand('gasto doscientos en papel');
    expect(result.success).toBe(true);
    expect(result.type).toBe('expense');
    expect(result.amount).toBe(200);
    expect(result.description).toBe('papel');
  });

  test('"gasto mil" sin descripción retorna expense', () => {
    const result = parseVoiceCommand('gasto mil');
    expect(result.success).toBe(true);
    expect(result.type).toBe('expense');
    expect(result.amount).toBe(1000);
    expect(result.description).toBe('');
  });

  test('"gasto quinientos en servilletas" extrae descripción completa', () => {
    const result = parseVoiceCommand('gasto quinientos en servilletas');
    expect(result.success).toBe(true);
    expect(result.amount).toBe(500);
    expect(result.description).toBe('servilletas');
  });
});

describe('voiceParser - Retiros', () => {
  test('"retiro trescientos Juan Pérez" retorna withdrawal', () => {
    const result = parseVoiceCommand('retiro trescientos Juan Pérez');
    expect(result.success).toBe(true);
    expect(result.type).toBe('withdrawal');
    expect(result.amount).toBe(300);
    expect(result.description).toContain('juan');
    expect(result.description).toContain('pérez');
  });

  test('"retiro mil" sin descripción retorna withdrawal', () => {
    const result = parseVoiceCommand('retiro mil');
    expect(result.success).toBe(true);
    expect(result.type).toBe('withdrawal');
    expect(result.amount).toBe(1000);
    expect(result.description).toBe('Retiro');
  });
});

describe('voiceParser - Inicio de Caja', () => {
  test('"inicio de caja cinco mil" retorna initial-balance', () => {
    const result = parseVoiceCommand('inicio de caja cinco mil');
    expect(result.success).toBe(true);
    expect(result.type).toBe('initial-balance');
    expect(result.amount).toBe(5000);
  });

  test('"inicio de caja diez mil" funciona correctamente', () => {
    const result = parseVoiceCommand('inicio de caja diez mil');
    expect(result.success).toBe(true);
    expect(result.amount).toBe(10000);
  });
});

describe('voiceParser - Casos Borde', () => {
  test('texto vacío retorna error', () => {
    const result = parseVoiceCommand('');
    expect(result.success).toBe(false);
  });

  test('solo texto sin números retorna error', () => {
    const result = parseVoiceCommand('hola mundo');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^❌/);
  });

  test('"venta" sin monto ni método retorna error', () => {
    const result = parseVoiceCommand('venta');
    expect(result.success).toBe(false);
    expect(result.error).toMatch(/^❌/);
  });
});
