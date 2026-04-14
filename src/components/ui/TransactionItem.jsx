import { formatCurrency } from '../../utils/formatters';

const TransactionItem = ({ item, onDelete }) => {
  const getTypeClass = () => {
    if (item.type === 'expense') return 'gasto';
    if (item.type === 'withdrawal') return 'retiro';
    return '';
  };

  return (
    <li key={item.id} className={`venta-item ${getTypeClass()}`}>
      <div className="venta-info">
        <span className={`venta-monto ${getTypeClass()} ${item.paymentMethod || ''}`}>
          {item.type === 'sale' ? '+' : '-'}
          {formatCurrency(item.amount)}
          {item.type === 'sale' && (
            <span className={`metodo-badge ${item.paymentMethod}`}>
              {item.paymentMethod === 'efectivo' ? 'Efec' : 'Trans'}
            </span>
          )}
        </span>
        <span className="venta-fecha">
          {item.type === 'sale' ? item.dateString : item.description}
        </span>
      </div>
      <button className="delete-btn" onClick={() => onDelete(item)}>
        ×
      </button>
    </li>
  );
};

export default TransactionItem;
