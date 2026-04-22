import jsPDF from 'jspdf';

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(amount);
};

export const generatePDF = (sales, expenses, initialBalance = 0, stockEntries = []) => {
  const cashSalesTotal = sales
    .filter((v) => v.paymentMethod === 'efectivo')
    .reduce((sum, v) => sum + v.amount, 0);
  const transferTotal = sales
    .filter((v) => v.paymentMethod === 'transferencia')
    .reduce((sum, v) => sum + v.amount, 0);
  const totalSales = cashSalesTotal + transferTotal;
  const totalExpenses = expenses.reduce((sum, g) => sum + g.amount, 0);
  const cashInDrawer = initialBalance + cashSalesTotal - totalExpenses;

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

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(15, 30, pageWidth - 15, 30);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Reporte de Operaciones Diarias', 15, 15);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(102, 102, 102);
  doc.text(`Generado el ${fechaCompleta}`, 15, 22);

  let yPos = 40;

  const leftCol = 15;
  const rightCol = pageWidth / 2 + 10;
  const rowHeight = 8;

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Flujo de Efectivo', leftCol, yPos);
  yPos += 6;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(leftCol, yPos, leftCol + 80, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  doc.setTextColor(80, 80, 85);
  doc.text('Saldo Inicial', leftCol, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(initialBalance), leftCol + 80, yPos, { align: 'right' });
  yPos += rowHeight;

  doc.setTextColor(80, 80, 85);
  doc.text('(+) Ventas en Efectivo', leftCol, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(cashSalesTotal), leftCol + 80, yPos, { align: 'right' });
  yPos += rowHeight;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(0.5);
  doc.line(leftCol, yPos, leftCol + 80, yPos);
  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('(=) Total Efectivo', leftCol, yPos);
  doc.text(formatCurrency(initialBalance + cashSalesTotal), leftCol + 80, yPos, { align: 'right' });
  yPos += rowHeight;

  doc.setFont('helvetica', 'normal');
  doc.setTextColor(80, 80, 85);
  doc.text('(-) Gastos', leftCol, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(`(${formatCurrency(totalExpenses)})`, leftCol + 80, yPos, { align: 'right' });
  yPos += rowHeight + 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(leftCol, yPos, leftCol + 80, yPos);
  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('(=) Efectivo en Caja', leftCol, yPos);
  doc.text(formatCurrency(cashInDrawer), leftCol + 80, yPos, { align: 'right' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 0, 0);
  doc.text('Ventas del Día', rightCol, 51);
  yPos = 57;

  doc.setDrawColor(200, 200, 200);
  doc.setLineWidth(0.3);
  doc.line(rightCol, yPos, rightCol + 80, yPos);
  yPos += 8;

  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');

  doc.setTextColor(80, 80, 85);
  doc.text('Ventas en Efectivo', rightCol, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(cashSalesTotal), rightCol + 80, yPos, { align: 'right' });
  yPos += rowHeight;

  doc.setTextColor(80, 80, 85);
  doc.text('Ventas en Transferencia', rightCol, yPos);
  doc.setTextColor(0, 0, 0);
  doc.text(formatCurrency(transferTotal), rightCol + 80, yPos, { align: 'right' });
  yPos += rowHeight + 2;

  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(rightCol, yPos, rightCol + 80, yPos);
  yPos += 4;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Total Ventas', rightCol, yPos);
  doc.text(formatCurrency(totalSales), rightCol + 80, yPos, { align: 'right' });

  yPos += 20;

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
  doc.text(`EFECTIVO EN CAJA: ${formatCurrency(cashInDrawer)}`, pageWidth - 25, yPos + 9.5, {
    align: 'right',
  });

  const fileName = `reporte_${days[now.getDay()]}_${now.getDate()}_${now.getMonth() + 1}_${now.getFullYear()}.pdf`;
  doc.save(fileName);
};
