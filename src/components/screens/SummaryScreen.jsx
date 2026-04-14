import { DownloadIcon, WalletIcon } from '../Icons';
import { formatCurrency, formatDate } from '../../utils/formatters';

const SummaryScreen = ({
  initialBalance,
  cash,
  transfer,
  totalSales,
  totalExpenses,
  cashInDrawer,
  onUpdateInitialBalance,
  onCloseDay,
}) => {
  return (
    <section className="resumen-section">
      <div className="resumen-header">
        <h2>Resumen del Día</h2>
        <p className="fecha">{formatDate()}</p>
      </div>

      <div className="saldo-inicial-card">
        <div className="saldo-label">
          <WalletIcon />
          <span>Saldo Inicial</span>
        </div>
        <input
          type="number"
          className="saldo-input"
          value={initialBalance || ''}
          onChange={(e) => onUpdateInitialBalance(e.target.value)}
          placeholder="0"
          min="0"
          step="1"
        />
      </div>

      <div className="resumen-cards">
        <div className="resumen-card efectivo">
          <span className="card-label">Efectivo</span>
          <span className="card-value">{formatCurrency(cash)}</span>
        </div>
        <div className="resumen-card transferencia">
          <span className="card-label">Transferencia</span>
          <span className="card-value">{formatCurrency(transfer)}</span>
        </div>
      </div>

      <div className="resumen-total-card">
        <div className="total-row">
          <span>Total Ventas</span>
          <span className="total-value">{formatCurrency(totalSales)}</span>
        </div>
        <div className="total-row">
          <span>Gastos</span>
          <span className="expense-value">-{formatCurrency(totalExpenses)}</span>
        </div>
      </div>

      <div className={`resumen-final-card ${cashInDrawer >= 0 ? 'positive' : 'negative'}`}>
        <span className="final-label">Efectivo en Caja</span>
        <span className="final-value">{formatCurrency(cashInDrawer)}</span>
      </div>

      <button className="close-day-btn" onClick={onCloseDay}>
        <DownloadIcon />
        Cerrar y Guardar Día
      </button>
    </section>
  );
};

export default SummaryScreen;
