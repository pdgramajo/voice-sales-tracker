import { useState, useEffect, useCallback, useRef } from 'react';
import jsPDF from 'jspdf';

const getTodayKey = () => {
  const now = new Date();
  return `ventas_${now.getFullYear()}_${now.getMonth()}_${now.getDate()}`;
};

const getHistoricalKey = () => 'ventas_historico';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

export const generarPDF = (ventas, gastos, saldoInicial = 0) => {
  const ventasEfectivo = ventas.filter(v => v.metodoPago === 'efectivo').reduce((sum, v) => sum + v.monto, 0);
  const transferenciaTotal = ventas.filter(v => v.metodoPago === 'transferencia').reduce((sum, v) => sum + v.monto, 0);
  const efectivoTotal = saldoInicial + ventasEfectivo;
  const totalVentas = ventasEfectivo + transferenciaTotal;
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  const enCaja = efectivoTotal - totalGastos;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const now = new Date();
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const fechaCompleta = `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`;
  
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageWidth, 50, 'F');
  
  doc.setTextColor(212, 168, 83);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte del Día', pageWidth / 2, 22, { align: 'center' });
  
  doc.setTextColor(161, 161, 166);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(fechaCompleta, pageWidth / 2, 35, { align: 'center' });
  
  let yPos = 60;
   
  if (saldoInicial > 0) {
    doc.setFillColor(255, 251, 235);
    doc.rect(15, yPos - 5, pageWidth - 30, 14, 'F');
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Saldo Inicial: ${formatCurrency(saldoInicial)}`, 20, yPos + 4);
    yPos += 20;
  }
  
  doc.setTextColor(50, 50, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Ventas: ${formatCurrency(totalVentas)}`, 20, yPos);
  doc.text(`Total Gastos: ${formatCurrency(totalGastos)}`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 10;
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 105);
  doc.text(`Efectivo: ${formatCurrency(efectivoTotal)}`, 20, yPos);
  doc.text(`Transferencia: ${formatCurrency(transferenciaTotal)}`, pageWidth - 20, yPos, { align: 'right' });
  
  yPos += 10;
  doc.setTextColor(34, 197, 94);
  doc.setFont('helvetica', 'bold');
  doc.text(`En Caja: ${formatCurrency(enCaja)}`, pageWidth / 2, yPos, { align: 'center' });
  
  yPos += 15;
  
  if (ventas.length > 0) {
    doc.setTextColor(249, 115, 22);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('VENTAS', 20, yPos);
    
    yPos += 8;
    
    doc.setFillColor(249, 115, 22);
    doc.rect(15, yPos, pageWidth - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('HORA', 25, yPos + 7);
    doc.text('METODO', 100, yPos + 7);
    doc.text('MONTO', pageWidth - 25, yPos + 7, { align: 'right' });
    
    yPos += 15;
    
    doc.setFont('helvetica', 'normal');
    
    ventas.forEach((venta, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
      }
      
      doc.setTextColor(80, 80, 85);
      doc.setFontSize(10);
      doc.text(venta.fechaCompleta, 25, yPos + 3);
      
      const metodoLabel = venta.metodoPago === 'efectivo' ? 'Efectivo' : 'Transferencia';
      doc.text(metodoLabel, 100, yPos + 3);
      
      doc.setTextColor(52, 199, 89);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(venta.monto), pageWidth - 25, yPos + 3, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      yPos += 14;
    });
  }
  
  if (gastos.length > 0) {
    yPos += 10;
    
    doc.setTextColor(239, 68, 68);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('GASTOS (Retiros de Caja)', 20, yPos);
    
    yPos += 8;
    
    doc.setFillColor(239, 68, 68);
    doc.rect(15, yPos, pageWidth - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('DESCRIPCION', 25, yPos + 7);
    doc.text('MONTO', pageWidth - 25, yPos + 7, { align: 'right' });
    
    yPos += 15;
    
    doc.setFont('helvetica', 'normal');
    
    gastos.forEach((gasto, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      
      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(15, yPos - 5, pageWidth - 30, 12, 'F');
      }
      
      doc.setTextColor(80, 80, 85);
      doc.setFontSize(10);
      doc.text(gasto.descripcion, 25, yPos + 3);
      
      doc.setTextColor(239, 68, 68);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'bold');
      doc.text(`-${formatCurrency(gasto.monto)}`, pageWidth - 25, yPos + 3, { align: 'right' });
      
      doc.setFont('helvetica', 'normal');
      yPos += 14;
    });
  }
  
  yPos += 10;
  doc.setDrawColor(200, 200, 205);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 12;
  
  doc.setFillColor(34, 197, 94);
  doc.rect(pageWidth - 90, yPos, 75, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`EN CAJA: ${formatCurrency(enCaja)}`, pageWidth - 25, yPos + 9.5, { align: 'right' });
  
  const fileName = `reporte_${days[now.getDay()]}_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}.pdf`;
  doc.save(fileName);
};

const calcularTotales = (ventas, gastos, saldoInicial = 0) => {
  const ventasEfectivo = ventas
    .filter(v => v.metodoPago === 'efectivo')
    .reduce((sum, v) => sum + v.monto, 0);
  
  const transferenciaTotal = ventas
    .filter(v => v.metodoPago === 'transferencia')
    .reduce((sum, v) => sum + v.monto, 0);
  
  const efectivoTotal = saldoInicial + ventasEfectivo;
  const totalGastos = gastos.reduce((sum, g) => sum + g.monto, 0);
  
  return { efectivoTotal, transferenciaTotal, totalGastos };
};

const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [gastos, setGastos] = useState([]);
  const [saldoInicial, setSaldoInicial] = useState(0);
  const [totales, setTotales] = useState({ efectivoTotal: 0, transferenciaTotal: 0, totalGastos: 0 });

  const stateRef = useRef({ ventas: [], gastos: [], saldoInicial: 0 });

  const recalcularTotales = useCallback((v, g, s) => {
    const nuevosTotales = calcularTotales(v, g, s);
    setTotales(nuevosTotales);
    return nuevosTotales;
  }, []);

  useEffect(() => {
    const savedData = localStorage.getItem(getTodayKey());
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        const v = parsed.ventas || [];
        const g = parsed.gastos || [];
        const s = parsed.saldoInicial || 0;
        
        stateRef.current = { ventas: v, gastos: g, saldoInicial: s };
        setVentas([...v]);
        setGastos([...g]);
        setSaldoInicial(s);
        recalcularTotales(v, g, s);
      } catch (e) {
        localStorage.removeItem(getTodayKey());
      }
    }
  }, [recalcularTotales]);

  const saveState = useCallback(() => {
    localStorage.setItem(getTodayKey(), JSON.stringify({
      ventas: stateRef.current.ventas,
      gastos: stateRef.current.gastos,
      saldoInicial: stateRef.current.saldoInicial
    }));
  }, []);

  const guardarHistorico = useCallback(() => {
    if (stateRef.current.ventas.length === 0 && stateRef.current.gastos.length === 0 && stateRef.current.saldoInicial === 0) return;

    const { efectivoTotal, transferenciaTotal, totalGastos } = calcularTotales(
      stateRef.current.ventas,
      stateRef.current.gastos,
      stateRef.current.saldoInicial
    );
    const totalVentas = efectivoTotal - stateRef.current.saldoInicial;
    const enCaja = efectivoTotal - totalGastos;

    const now = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const year = now.getFullYear();
    
    const historial = JSON.parse(localStorage.getItem(getHistoricalKey()) || '[]');
    historial.push({
      fecha: `${dayName} ${day} ${year}`,
      saldoInicial: stateRef.current.saldoInicial,
      totalVentas,
      totalGastos,
      efectivoTotal,
      transferenciaTotal,
      gananciaNeta: enCaja,
      cantidadVentas: stateRef.current.ventas.length,
      cantidadGastos: stateRef.current.gastos.length
    });
    localStorage.setItem(getHistoricalKey(), JSON.stringify(historial));
  }, []);

  const agregarVenta = useCallback((monto, metodoPago = 'efectivo') => {
    const now = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    
    let hours = now.getHours();
    const ampm = hours >= 12 ? 'pm' : 'am';
    hours = hours % 12;
    hours = hours ? hours : 12;
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds} ${ampm}`;
    
    const dayName = days[now.getDay()];
    const day = now.getDate();
    
    const venta = {
      id: Date.now(),
      tipo: 'venta',
      monto: Number(monto),
      metodoPago,
      fechaCompleta: `${dayName} ${day} ${timeStr}`,
      timestamp: now.getTime()
    };

    stateRef.current.ventas = [venta, ...stateRef.current.ventas];
    setVentas([...stateRef.current.ventas]);
    recalcularTotales(stateRef.current.ventas, stateRef.current.gastos, stateRef.current.saldoInicial);
    saveState();
  }, [saveState, recalcularTotales]);

  const agregarGasto = useCallback((monto, descripcion) => {
    const gasto = {
      id: Date.now(),
      tipo: 'gasto',
      monto: Number(monto),
      descripcion,
      timestamp: Date.now()
    };

    stateRef.current.gastos = [gasto, ...stateRef.current.gastos];
    setGastos([...stateRef.current.gastos]);
    recalcularTotales(stateRef.current.ventas, stateRef.current.gastos, stateRef.current.saldoInicial);
    saveState();
  }, [saveState, recalcularTotales]);

  const agregarRetiro = useCallback((monto, comentario) => {
    const retiro = {
      id: Date.now(),
      tipo: 'retiro',
      monto: Number(monto),
      descripcion: comentario,
      timestamp: Date.now()
    };

    stateRef.current.gastos = [retiro, ...stateRef.current.gastos];
    setGastos([...stateRef.current.gastos]);
    recalcularTotales(stateRef.current.ventas, stateRef.current.gastos, stateRef.current.saldoInicial);
    saveState();
  }, [saveState, recalcularTotales]);

  const eliminarVenta = useCallback((id) => {
    stateRef.current.ventas = stateRef.current.ventas.filter(v => v.id !== id);
    setVentas([...stateRef.current.ventas]);
    recalcularTotales(stateRef.current.ventas, stateRef.current.gastos, stateRef.current.saldoInicial);
    saveState();
  }, [saveState, recalcularTotales]);

  const eliminarGasto = useCallback((id) => {
    stateRef.current.gastos = stateRef.current.gastos.filter(g => g.id !== id);
    setGastos([...stateRef.current.gastos]);
    recalcularTotales(stateRef.current.ventas, stateRef.current.gastos, stateRef.current.saldoInicial);
    saveState();
  }, [saveState, recalcularTotales]);

  const actualizarGasto = useCallback((id, updates) => {
    const index = stateRef.current.gastos.findIndex(g => g.id === id);
    if (index !== -1) {
      if (updates.monto !== undefined) {
        stateRef.current.gastos[index].monto = Number(updates.monto);
      }
      if (updates.descripcion !== undefined) {
        stateRef.current.gastos[index].descripcion = updates.descripcion;
      }
      setGastos([...stateRef.current.gastos]);
      recalcularTotales(stateRef.current.ventas, stateRef.current.gastos, stateRef.current.saldoInicial);
      saveState();
    }
  }, [saveState, recalcularTotales]);

  const obtenerHistorial = useCallback(() => {
    return JSON.parse(localStorage.getItem(getHistoricalKey()) || '[]');
  }, []);

  const actualizarSaldoInicial = useCallback((monto) => {
    const nuevoSaldo = Number(monto) || 0;
    stateRef.current.saldoInicial = nuevoSaldo;
    setSaldoInicial(nuevoSaldo);
    recalcularTotales(stateRef.current.ventas, stateRef.current.gastos, nuevoSaldo);
    saveState();
  }, [saveState, recalcularTotales]);

  const cerrarDia = useCallback(() => {
    if (stateRef.current.ventas.length > 0 || stateRef.current.gastos.length > 0 || stateRef.current.saldoInicial > 0) {
      generarPDF([...stateRef.current.ventas], [...stateRef.current.gastos], stateRef.current.saldoInicial);
    }
    guardarHistorico();
    stateRef.current = { ventas: [], gastos: [], saldoInicial: 0 };
    setVentas([]);
    setGastos([]);
    setSaldoInicial(0);
    setTotales({ efectivoTotal: 0, transferenciaTotal: 0, totalGastos: 0 });
    localStorage.removeItem(getTodayKey());
  }, [guardarHistorico]);

  return {
    ventas,
    gastos,
    saldoInicial,
    efectivoTotal: totales.efectivoTotal,
    transferenciaTotal: totales.transferenciaTotal,
    totalGastos: totales.totalGastos,
    agregarVenta,
    agregarGasto,
    agregarRetiro,
    eliminarVenta,
    eliminarGasto,
    actualizarGasto,
    actualizarSaldoInicial,
    obtenerHistorial,
    cerrarDia
  };
};

export default useVentas;
