import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import Filters from '../ui/Filters';
import TransactionItem from '../ui/TransactionItem';

const DayDetailScreen = ({ day, onBack }) => {
  const [filter, setFilter] = useState('todos');

  const salesCount = useMemo(
    () => ({
      total: day.sales?.length || 0,
      efectivo: day.sales?.filter((s) => s.paymentMethod === 'efectivo').length || 0,
      transferencia: day.sales?.filter((s) => s.paymentMethod === 'transferencia').length || 0,
      gastos: day.expenses?.length || 0,
    }),
    [day]
  );

  const filteredSales = useMemo(() => {
    if (!day.sales) return [];
    if (filter === 'efectivo') return day.sales.filter((s) => s.paymentMethod === 'efectivo');
    if (filter === 'transferencia')
      return day.sales.filter((s) => s.paymentMethod === 'transferencia');
    if (filter === 'gastos') return day.expenses || [];
    return day.sales || [];
  }, [day, filter]);

  return (
    <section className="day-detail-section">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h2>{day.fecha}</h2>
      </div>

      <div className="day-summary">
        <div className="day-summary-row">
          <span>Inicio:</span>
          <span className="green">{formatCurrency(day.initialBalance)}</span>
        </div>
        <div className="day-summary-row">
          <span>Efectivo:</span>
          <span className="green">{formatCurrency(day.cashTotal - day.initialBalance)}</span>
        </div>
        <div className="day-summary-row">
          <span>Transferencia:</span>
          <span className="blue">{formatCurrency(day.transferTotal)}</span>
        </div>
        <div className="day-summary-row total">
          <span>Total Ventas:</span>
          <span className="green">{formatCurrency(day.totalSales)}</span>
        </div>
        <div className="day-summary-row">
          <span>Gastos:</span>
          <span className="red">-{formatCurrency(day.totalExpenses)}</span>
        </div>
        <div className="day-summary-row final">
          <span>En Caja:</span>
          <span>{formatCurrency(day.cashInDrawer)}</span>
        </div>
      </div>

      <div className="day-transactions">
        <h3>Ventas ({salesCount.total})</h3>
        <Filters filter={filter} setFilter={setFilter} counts={salesCount} />

        {filteredSales.length === 0 ? (
          <p className="no-items">No hay ventas</p>
        ) : (
          <ul className="ventas-list">
            {filteredSales.map((sale) => (
              <li key={sale.id} className="venta-item">
                <div className="venta-info">
                  <span className={`venta-monto ${sale.paymentMethod}`}>
                    +{formatCurrency(sale.amount)}
                    <span className={`metodo-badge ${sale.paymentMethod}`}>
                      {sale.paymentMethod === 'efectivo' ? 'Efec' : 'Trans'}
                    </span>
                  </span>
                  <span className="venta-fecha">{sale.dateString}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {day.expenses && day.expenses.length > 0 && (
        <div className="day-expenses">
          <h3>Gastos ({salesCount.gastos})</h3>
          <ul className="ventas-list">
            {day.expenses.map((expense) => (
              <li key={expense.id} className="venta-item gasto">
                <div className="venta-info">
                  <span className="venta-monto gasto">-{formatCurrency(expense.amount)}</span>
                  <span className="venta-fecha">{expense.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}

      {day.stock && day.stock.length > 0 && (
        <div className="day-stock">
          <h3>Stock ({day.stock.length})</h3>
          <ul className="ventas-list">
            {day.stock.map((entry) => (
              <li key={entry.id} className={`venta-item ${entry.type}`}>
                <div className="venta-info">
                  <span className={`stock-badge ${entry.type}`}>
                    {entry.type === 'entrada' ? '+' : '-'}
                  </span>
                  <span className="stock-description">{entry.description}</span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
};

export default DayDetailScreen;
