import Filters from './Filters';
import TransactionItem from './TransactionItem';

const TransactionList = ({
  items,
  filter,
  setFilter,
  counts,
  onDelete,
  emptyMessage = 'No hay movimientos hoy',
}) => {
  return (
    <div className="ventas-section">
      <Filters filter={filter} setFilter={setFilter} counts={counts} />

      {items.length === 0 ? (
        <p className="no-ventas">{emptyMessage}</p>
      ) : (
        <ul className="ventas-list">
          {items.map((item) => (
            <TransactionItem key={item.id} item={item} onDelete={onDelete} />
          ))}
        </ul>
      )}
    </div>
  );
};

export default TransactionList;
