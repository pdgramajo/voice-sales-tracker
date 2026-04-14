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

      <div className="saldo-inicial-section">
        <label className="saldo-inicial-label">
          <WalletIcon /> Saldo Inicial
        </label>
        <input
          type="number"
          className="saldo-inicial-input"
          value={initialBalance || ''}
          onChange={(e) => onUpdateInitialBalance(e.target.value)}
          placeholder="0.00"
          min="0"
          step="0.01"
        />
      </div>

      <div className="resumen-detailed">
        <div className="resumen-row">
          <span>Efectivo</span>
          <span className="green">{formatCurrency(cash)}</span>
        </div>
        <div className="resumen-row">
          <span>Transferencia</span>
          <span className="blue">{formatCurrency(transfer)}</span>
        </div>
        <div className="resumen-row total">
          <span>Total Ventas</span>
          <span className="green">{formatCurrency(totalSales)}</span>
        </div>
        <div className="resumen-row">
          <span>Gastos</span>
          <span className="red">-{formatCurrency(totalExpenses)}</span>
        </div>
        <div className="resumen-row final">
          <span>En Caja</span>
          <span>{formatCurrency(cashInDrawer)}</span>
        </div>
      </div>

      <button className="close-day-btn" onClick={onCloseDay}>
        <DownloadIcon />
        Cerrar Día
      </button>
    </section>
  );
};

export default SummaryScreen;
