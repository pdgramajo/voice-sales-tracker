import jsPDF from 'jspdf';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export const generatePDF = (sales, expenses, initialBalance = 0, stockEntries = []) => {
  const cashSales = sales
    .filter((v) => v.paymentMethod === 'efectivo')
    .reduce((sum, v) => sum + v.amount, 0);
  const transferTotal = sales
    .filter((v) => v.paymentMethod === 'transferencia')
    .reduce((sum, v) => sum + v.amount, 0);
  const cashTotal = initialBalance + cashSales;
  const totalSales = cashSales + transferTotal;
  const totalExpenses = expenses.reduce((sum, g) => sum + g.amount, 0);
  const cashInDrawer = cashTotal - totalExpenses;

  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  const now = new Date();
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre',
  ];

  const fechaCompleta = `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`;

  doc.setFillColor(10, 10, 15);
  doc.rect(0, 0, pageWidth, 25, 'F');

  doc.setTextColor(212, 168, 83);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte del Día', pageWidth / 2, 11, { align: 'center' });

  doc.setTextColor(161, 161, 166);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(fechaCompleta, pageWidth / 2, 17, { align: 'center' });

  let yPos = 35;

  if (initialBalance > 0) {
    doc.setFillColor(255, 251, 235);
    doc.rect(15, yPos - 5, pageWidth - 30, 14, 'F');
    doc.setTextColor(180, 83, 9);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text(`Saldo Inicial: ${formatCurrency(initialBalance)}`, 20, yPos + 4);
    yPos += 20;
  }

  doc.setTextColor(50, 50, 55);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text(`Total Ventas: ${formatCurrency(totalSales)}`, 20, yPos);
  doc.text(`Total Gastos: ${formatCurrency(totalExpenses)}`, pageWidth - 20, yPos, {
    align: 'right',
  });

  yPos += 10;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 105);
  doc.text(`Efectivo: ${formatCurrency(cashTotal)}`, 20, yPos);
  doc.text(`Transferencia: ${formatCurrency(transferTotal)}`, pageWidth - 20, yPos, {
    align: 'right',
  });

  yPos += 10;
  doc.setTextColor(34, 197, 94);
  doc.setFont('helvetica', 'bold');
  doc.text(`En Caja: ${formatCurrency(cashInDrawer)}`, pageWidth / 2, yPos, { align: 'center' });

  yPos += 15;

  if (stockEntries.length > 0) {
    doc.setTextColor(139, 92, 246);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('MOVIMIENTOS DE STOCK', 20, yPos);

    yPos += 8;

    doc.setFillColor(139, 92, 246);
    doc.rect(15, yPos, pageWidth - 30, 10, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.text('TIPO', 25, yPos + 7);
    doc.text('DESCRIPCION', 60, yPos + 7);

    yPos += 12;

    doc.setFont('helvetica', 'normal');

    stockEntries.forEach((entry, index) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(15, yPos - 3, pageWidth - 30, 6, 'F');
      }

      const typeLabel = entry.type === 'entrada' ? 'Entrada' : 'Salida';
      const typeColor = entry.type === 'entrada' ? [34, 197, 94] : [239, 68, 68];

      doc.setTextColor(...typeColor);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(typeLabel, 25, yPos + 1);

      doc.setTextColor(80, 80, 85);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'normal');
      doc.text(entry.description, 60, yPos + 1);

      yPos += 7;
    });

    yPos += 5;
  }

  if (expenses.length > 0) {
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

    yPos += 12;

    doc.setFont('helvetica', 'normal');

    expenses.forEach((expense, index) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(15, yPos - 3, pageWidth - 30, 6, 'F');
      }

      doc.setTextColor(80, 80, 85);
      doc.setFontSize(9);
      doc.text(expense.description, 25, yPos + 1);

      doc.setTextColor(239, 68, 68);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(`-${formatCurrency(expense.amount)}`, pageWidth - 25, yPos + 1, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      yPos += 7;
    });

    yPos += 5;
  }

  if (sales.length > 0) {
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

    yPos += 12;

    doc.setFont('helvetica', 'normal');

    sales.forEach((sale, index) => {
      if (yPos > 275) {
        doc.addPage();
        yPos = 20;
      }

      if (index % 2 === 0) {
        doc.setFillColor(250, 250, 252);
        doc.rect(15, yPos - 3, pageWidth - 30, 6, 'F');
      }

      doc.setTextColor(80, 80, 85);
      doc.setFontSize(9);
      doc.text(sale.dateString, 25, yPos + 1);

      const methodLabel = sale.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia';
      doc.text(methodLabel, 100, yPos + 1);

      doc.setTextColor(52, 199, 89);
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.text(formatCurrency(sale.amount), pageWidth - 25, yPos + 1, { align: 'right' });

      doc.setFont('helvetica', 'normal');
      yPos += 7;
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
  doc.text(`EN CAJA: ${formatCurrency(cashInDrawer)}`, pageWidth - 25, yPos + 9.5, {
    align: 'right',
  });

  const fileName = `reporte_${days[now.getDay()]}_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}.pdf`;
  doc.save(fileName);
};
