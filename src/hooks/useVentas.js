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

export const generarPDF = (ventas, totalDia) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  
  const now = new Date();
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  
  const fechaCompleta = `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`;
  
  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageWidth, 45, 'F');
  
  doc.setTextColor(212, 168, 83);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte de Ventas', pageWidth / 2, 22, { align: 'center' });
  
  doc.setTextColor(161, 161, 166);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(fechaCompleta, pageWidth / 2, 33, { align: 'center' });
  
  doc.setTextColor(50, 50, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total del Día: ${formatCurrency(totalDia)}`, pageWidth / 2, 60, { align: 'center' });
  
  doc.setTextColor(110, 110, 115);
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text(`${ventas.length} transacción${ventas.length !== 1 ? 'es' : ''}`, pageWidth / 2, 68, { align: 'center' });
  
  let yPos = 85;
  
  doc.setFillColor(245, 245, 247);
  doc.rect(15, yPos, pageWidth - 30, 10, 'F');
  doc.setTextColor(100, 100, 105);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('HORA', 25, yPos + 7);
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
    
    doc.setTextColor(52, 199, 89);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.text(formatCurrency(venta.monto), pageWidth - 25, yPos + 3, { align: 'right' });
    
    doc.setFont('helvetica', 'normal');
    yPos += 14;
  });
  
  doc.setDrawColor(230, 230, 235);
  doc.line(15, yPos, pageWidth - 15, yPos);
  yPos += 10;
  
  doc.setFillColor(212, 168, 83);
  doc.rect(pageWidth - 80, yPos, 65, 14, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text(`TOTAL: ${formatCurrency(totalDia)}`, pageWidth - 25, yPos + 9.5, { align: 'right' });
  
  const fileName = `ventas_${days[now.getDay()]}_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}.pdf`;
  doc.save(fileName);
};

const useVentas = () => {
  const [ventas, setVentas] = useState([]);
  const [totalDia, setTotalDia] = useState(0);
  const [currentDate, setCurrentDate] = useState(new Date());

  const guardarHistoricoRef = useRef(null);

  useEffect(() => {
    const savedVentas = localStorage.getItem(getTodayKey());
    if (savedVentas) {
      const parsed = JSON.parse(savedVentas);
      setVentas(parsed.ventas || []);
      setTotalDia(parsed.total || 0);
    }
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      if (now.getDate() !== currentDate.getDate() || 
          now.getMonth() !== currentDate.getMonth() || 
          now.getFullYear() !== currentDate.getFullYear()) {
        if (guardarHistoricoRef.current) guardarHistoricoRef.current();
        setVentas([]);
        setTotalDia(0);
        setCurrentDate(now);
        localStorage.removeItem(getTodayKey());
      }
    }, 60000);

    return () => clearInterval(interval);
  }, [currentDate]);

  const guardarHistorico = useCallback(() => {
    setVentas(prevVentas => {
      if (prevVentas.length === 0) return prevVentas;

      const now = new Date();
      const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
      const dayName = days[now.getDay()];
      const day = now.getDate();
      const year = now.getFullYear();
      
      const historial = JSON.parse(localStorage.getItem(getHistoricalKey()) || '[]');
      historial.push({
        fecha: `${dayName} ${day} ${year}`,
        total: totalDia,
        cantidadVentas: prevVentas.length
      });
      localStorage.setItem(getHistoricalKey(), JSON.stringify(historial));
      return prevVentas;
    });
  }, [totalDia]);

  useEffect(() => {
    guardarHistoricoRef.current = guardarHistorico;
  }, [guardarHistorico]);

  const agregarVenta = useCallback((monto) => {
    setVentas(prevVentas => {
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
        monto,
        fechaCompleta: `${dayName} ${day} ${timeStr}`,
        timestamp: now.getTime()
      };

      const nuevasVentas = [venta, ...prevVentas];
      const nuevoTotal = totalDia + monto;
      
      localStorage.setItem(getTodayKey(), JSON.stringify({
        ventas: nuevasVentas,
        total: nuevoTotal
      }));
      
      setTotalDia(nuevoTotal);
      return nuevasVentas;
    });
  }, [totalDia]);

  const eliminarVenta = useCallback((id) => {
    setVentas(prevVentas => {
      const ventaAEliminar = prevVentas.find(v => v.id === id);
      if (!ventaAEliminar) return prevVentas;

      const nuevasVentas = prevVentas.filter(v => v.id !== id);
      const nuevoTotal = totalDia - ventaAEliminar.monto;
      
      localStorage.setItem(getTodayKey(), JSON.stringify({
        ventas: nuevasVentas,
        total: nuevoTotal
      }));
      
      setTotalDia(nuevoTotal);
      return nuevasVentas;
    });
  }, [totalDia]);

  const obtenerHistorial = useCallback(() => {
    return JSON.parse(localStorage.getItem(getHistoricalKey()) || '[]');
  }, []);

  const cerrarDia = useCallback(() => {
    if (ventas.length > 0) {
      generarPDF(ventas, totalDia);
    }
    guardarHistorico();
    setVentas([]);
    setTotalDia(0);
    setCurrentDate(new Date());
    localStorage.removeItem(getTodayKey());
  }, [ventas, totalDia, guardarHistorico]);

  return {
    ventas,
    totalDia,
    agregarVenta,
    eliminarVenta,
    obtenerHistorial,
    cerrarDia
  };
};

export default useVentas;
