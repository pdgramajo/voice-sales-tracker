import { formatCurrency } from '../../utils/formatters';

const SummaryGrid = ({ cash, transfer, total, balance }) => {
  return (
    <div className="summary-grid">
      <div className="summary-card efectivo">
        <span className="summary-card-label">VENTAS EN EFECTIVO</span>
        <span className="summary-card-value">{formatCurrency(cash)}</span>
      </div>
      <div className="summary-card transferencia">
        <span className="summary-card-label">TRANSFERENCIAS</span>
        <span className="summary-card-value">{formatCurrency(transfer)}</span>
      </div>
      <div className="summary-card total">
        <span className="summary-card-label">TOTAL VENTAS</span>
        <span className="summary-card-value">{formatCurrency(total)}</span>
      </div>
      <div className={`summary-card saldo ${balance >= 0 ? '' : 'negative'}`}>
        <span className="summary-card-label">EFECTIVO EN CAJA</span>
        <span className="summary-card-value">{formatCurrency(balance)}</span>
      </div>
    </div>
  );
};

export default SummaryGrid;
