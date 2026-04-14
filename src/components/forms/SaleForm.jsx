import { MoneyIcon, TransferIcon } from '../Icons';

const SaleForm = ({ 
  paymentMethod, 
  setPaymentMethod, 
  amount, 
  setAmount, 
  onSubmit
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!isNaN(amountNum) && amountNum > 0) {
      onSubmit(amountNum, paymentMethod);
    }
  };

  return (
    <section className="gasto-form-section">
      <h2>Agregar Venta</h2>
      <div className="metodo-pago">
        <button 
          type="button"
          className={`metodo-btn ${paymentMethod === 'efectivo' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('efectivo')}
        >
          <MoneyIcon /> Efectivo
        </button>
        <button 
          type="button"
          className={`metodo-btn transferencia ${paymentMethod === 'transferencia' ? 'active' : ''}`}
          onClick={() => setPaymentMethod('transferencia')}
        >
          <TransferIcon /> Transferencia
        </button>
      </div>
      <form onSubmit={handleSubmit} className="gasto-form">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="$0.00"
          step="0.01"
          min="0"
          className="gasto-input"
          required
          autoFocus
        />
        <button type="submit" className="save-btn" style={{background: 'var(--success-efectivo)'}}>
          Agregar Venta
        </button>
      </form>
    </section>
  );
};

export default SaleForm;
