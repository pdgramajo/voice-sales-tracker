/**
 * Tests para la lógica de cálculos del Home
 *
 * Variables críticas que se prueban:
 * - Ventas en Efectivo: suma de ventas con paymentMethod === 'efectivo'
 * - Transferencias: suma de ventas con paymentMethod === 'transferencia'
 * - Total Ventas: efectivo + transferencias
 * - Efectivo en Caja: initialBalance + efectivo - totalExpenses
 */

describe('Home Calculations - Variables Críticas', () => {
  /**
   * Helper que replica exactamente la lógica del App.jsx
   */
  const calculateTotals = (sales, initialBalance, expenses, transferTotal) => {
    const efectivo = sales
      .filter((s) => s.paymentMethod === 'efectivo')
      .reduce((sum, s) => sum + s.amount, 0);

    const transferencias = transferTotal;

    const totalVentas = efectivo + transferencias;

    const totalExpenses = expenses.reduce((sum, e) => sum + e.amount, 0);

    const efectivoEnCaja = initialBalance + efectivo - totalExpenses;

    return { efectivo, transferencias, totalVentas, efectivoEnCaja };
  };

  // ============================================
  // VENTAS EN EFECTIVO
  // ============================================
  describe('Ventas en Efectivo', () => {
    test('día vacío retorna 0', () => {
      const result = calculateTotals([], 0, [], 0);
      expect(result.efectivo).toBe(0);
    });

    test('una venta efectivo retorna el monto correcto', () => {
      const sales = [{ id: 1, amount: 1000, paymentMethod: 'efectivo' }];
      const result = calculateTotals(sales, 0, [], 0);
      expect(result.efectivo).toBe(1000);
    });

    test('múltiples ventas efectivo suma correctamente', () => {
      const sales = [
        { id: 1, amount: 500, paymentMethod: 'efectivo' },
        { id: 2, amount: 300, paymentMethod: 'efectivo' },
        { id: 3, amount: 200, paymentMethod: 'efectivo' },
      ];
      const result = calculateTotals(sales, 0, [], 0);
      expect(result.efectivo).toBe(1000);
    });

    test('ignora ventas transferencia al calcular efectivo', () => {
      const sales = [
        { id: 1, amount: 500, paymentMethod: 'efectivo' },
        { id: 2, amount: 1000, paymentMethod: 'transferencia' },
        { id: 3, amount: 300, paymentMethod: 'efectivo' },
      ];
      const result = calculateTotals(sales, 0, [], 1000);
      expect(result.efectivo).toBe(800);
    });
  });

  // ============================================
  // TRANSFERENCIAS
  // ============================================
  describe('Transferencias', () => {
    test('día vacío retorna 0', () => {
      const result = calculateTotals([], 0, [], 0);
      expect(result.transferencias).toBe(0);
    });

    test('retorna el valor directo de transferTotal', () => {
      const result = calculateTotals([], 0, [], 2500);
      expect(result.transferencias).toBe(2500);
    });
  });

  // ============================================
  // TOTAL VENTAS
  // ============================================
  describe('Total Ventas', () => {
    test('solo efectivo retorna efectivo', () => {
      const sales = [{ id: 1, amount: 1500, paymentMethod: 'efectivo' }];
      const result = calculateTotals(sales, 0, [], 0);
      expect(result.totalVentas).toBe(1500);
    });

    test('solo transferencias retorna transferencias', () => {
      const result = calculateTotals([], 0, [], 2000);
      expect(result.totalVentas).toBe(2000);
    });

    test('ventas mixtas suma efectivo + transferencias', () => {
      const sales = [{ id: 1, amount: 1000, paymentMethod: 'efectivo' }];
      const result = calculateTotals(sales, 0, [], 500);
      expect(result.totalVentas).toBe(1500);
    });

    test('sin ventas retorna 0', () => {
      const result = calculateTotals([], 0, [], 0);
      expect(result.totalVentas).toBe(0);
    });
  });

  // ============================================
  // EFECTIVO EN CAJA (CRÍTICO)
  // ============================================
  describe('Efectivo en Caja (CRÍTICO)', () => {
    test('sin saldo inicial ni ventas retorna 0', () => {
      const result = calculateTotals([], 0, [], 0);
      expect(result.efectivoEnCaja).toBe(0);
    });

    test('con efectivo sin gastos ni inicial = efectivo', () => {
      const sales = [{ id: 1, amount: 1000, paymentMethod: 'efectivo' }];
      const result = calculateTotals(sales, 0, [], 0);
      expect(result.efectivoEnCaja).toBe(1000);
    });

    test('con saldo inicial sin ventas ni gastos = inicial', () => {
      const result = calculateTotals([], 5000, [], 0);
      expect(result.efectivoEnCaja).toBe(5000);
    });

    test('con saldo inicial y ventas sin gastos = inicial + efectivo', () => {
      const sales = [{ id: 1, amount: 2000, paymentMethod: 'efectivo' }];
      const result = calculateTotals(sales, 5000, [], 0);
      expect(result.efectivoEnCaja).toBe(7000);
    });

    test('con efectivo y gastos sin inicial = efectivo - gastos', () => {
      const sales = [{ id: 1, amount: 1000, paymentMethod: 'efectivo' }];
      const expenses = [{ id: 1, amount: 300, type: 'expense' }];
      const result = calculateTotals(sales, 0, expenses, 0);
      expect(result.efectivoEnCaja).toBe(700);
    });

    test('con inicial + efectivo - gastos = correcto', () => {
      const sales = [{ id: 1, amount: 2000, paymentMethod: 'efectivo' }];
      const expenses = [
        { id: 1, amount: 300, type: 'expense' },
        { id: 2, amount: 200, type: 'withdrawal' },
      ];
      const result = calculateTotals(sales, 5000, expenses, 0);
      expect(result.efectivoEnCaja).toBe(6500);
    });

    test('puede ser negativo si gastos > efectivo', () => {
      const sales = [{ id: 1, amount: 500, paymentMethod: 'efectivo' }];
      const expenses = [{ id: 1, amount: 1000, type: 'expense' }];
      const result = calculateTotals(sales, 0, expenses, 0);
      expect(result.efectivoEnCaja).toBe(-500);
    });

    test('transferencias no afectan efectivo en caja', () => {
      const sales = [{ id: 1, amount: 1000, paymentMethod: 'efectivo' }];
      const result = calculateTotals(sales, 0, [], 5000);
      expect(result.efectivoEnCaja).toBe(1000);
    });

    test('solo gastos sin ventas ni inicial = negativo', () => {
      const expenses = [{ id: 1, amount: 300, type: 'expense' }];
      const result = calculateTotals([], 0, expenses, 0);
      expect(result.efectivoEnCaja).toBe(-300);
    });
  });

  // ============================================
  // ESCENARIOS REALES
  // ============================================
  describe('Escenarios Reales', () => {
    test('mañana típica: saldo inicial + ventas - gastos pequeños', () => {
      // Iniciaste con $3000
      // Vendiste $1500 en efectivo, $800 transferencia
      // Gastaste $200 en papelería
      const sales = [{ id: 1, amount: 1500, paymentMethod: 'efectivo' }];
      const expenses = [{ id: 1, amount: 200, type: 'expense' }];

      const result = calculateTotals(sales, 3000, expenses, 800);

      expect(result.efectivo).toBe(1500);
      expect(result.transferencias).toBe(800);
      expect(result.totalVentas).toBe(2300);
      expect(result.efectivoEnCaja).toBe(4300); // 3000 + 1500 - 200
    });

    test('día ocupado: múltiples transacciones', () => {
      // Iniciaste con $10000
      // Ventas efectivo: $500 + $300 + $800 + $450 = $2050
      // Ventas transferencia: $1200 + $2000 = $3200
      // Gastos: $150 + $250 + $100 = $500
      const sales = [
        { id: 1, amount: 500, paymentMethod: 'efectivo' },
        { id: 2, amount: 1200, paymentMethod: 'transferencia' },
        { id: 3, amount: 300, paymentMethod: 'efectivo' },
        { id: 4, amount: 800, paymentMethod: 'efectivo' },
        { id: 5, amount: 2000, paymentMethod: 'transferencia' },
        { id: 6, amount: 450, paymentMethod: 'efectivo' },
      ];
      const expenses = [
        { id: 1, amount: 150, type: 'expense' },
        { id: 2, amount: 250, type: 'withdrawal' },
        { id: 3, amount: 100, type: 'expense' },
      ];

      const result = calculateTotals(sales, 10000, expenses, 3200);

      expect(result.efectivo).toBe(2050);
      expect(result.transferencias).toBe(3200);
      expect(result.totalVentas).toBe(5250);
      expect(result.efectivoEnCaja).toBe(11550); // 10000 + 2050 - 500
    });

    test('solo ventas transferencia no afecta caja', () => {
      // Solo vendiste por transferencia
      // No hay efectivo nuevo, solo el inicial
      const sales = [{ id: 1, amount: 5000, paymentMethod: 'transferencia' }];

      const result = calculateTotals(sales, 2000, [], 5000);

      expect(result.efectivo).toBe(0);
      expect(result.transferencias).toBe(5000);
      expect(result.totalVentas).toBe(5000);
      expect(result.efectivoEnCaja).toBe(2000); // Solo el inicial
    });

    test('solo gastos sin ventas', () => {
      // Día lento, solo gastos
      const expenses = [
        { id: 1, amount: 500, type: 'expense' },
        { id: 2, amount: 300, type: 'withdrawal' },
      ];

      const result = calculateTotals([], 5000, expenses, 0);

      expect(result.efectivo).toBe(0);
      expect(result.transferencias).toBe(0);
      expect(result.totalVentas).toBe(0);
      expect(result.efectivoEnCaja).toBe(4200); // 5000 - 800
    });
  });

  // ============================================
  // CASOS BORDE
  // ============================================
  describe('Casos Borde', () => {
    test('números grandes', () => {
      const sales = [{ id: 1, amount: 999999, paymentMethod: 'efectivo' }];
      const expenses = [{ id: 1, amount: 500000, type: 'expense' }];

      const result = calculateTotals(sales, 1000000, expenses, 0);

      expect(result.efectivoEnCaja).toBe(1499999);
    });

    test('números decimales', () => {
      const sales = [{ id: 1, amount: 100.5, paymentMethod: 'efectivo' }];
      const expenses = [{ id: 1, amount: 50.25, type: 'expense' }];

      const result = calculateTotals(sales, 100, expenses, 0);

      expect(result.efectivoEnCaja).toBe(150.25); // 100 + 100.5 - 50.25
    });

    test('múltiples gastos de diferentes tipos', () => {
      const sales = [{ id: 1, amount: 1000, paymentMethod: 'efectivo' }];
      const expenses = [
        { id: 1, amount: 100, type: 'expense' },
        { id: 2, amount: 200, type: 'withdrawal' },
        { id: 3, amount: 50, type: 'expense' },
      ];

      const result = calculateTotals(sales, 0, expenses, 0);

      expect(result.efectivoEnCaja).toBe(650); // 0 + 1000 - 350
    });
  });

  // ============================================
  // INVARIANTES
  // ============================================
  describe('Invariantes', () => {
    test('efectivoEnCaja nunca debe ser undefined', () => {
      const result = calculateTotals([], 0, [], 0);
      expect(result.efectivoEnCaja).toBeDefined();
      expect(typeof result.efectivoEnCaja).toBe('number');
    });

    test('totalVentas = efectivo + transferencias', () => {
      const sales = [{ id: 1, amount: 500, paymentMethod: 'efectivo' }];
      const result = calculateTotals(sales, 1000, [], 300);

      expect(result.totalVentas).toBe(result.efectivo + result.transferencias);
      expect(result.totalVentas).toBe(800);
    });

    test('agregar gasto siempre reduce efectivoEnCaja', () => {
      const sales = [{ id: 1, amount: 1000, paymentMethod: 'efectivo' }];

      const sinGastos = calculateTotals(sales, 0, [], 0);
      const conGasto = calculateTotals(sales, 0, [{ id: 1, amount: 100, type: 'expense' }], 0);

      expect(conGasto.efectivoEnCaja).toBe(sinGastos.efectivoEnCaja - 100);
    });
  });
});
