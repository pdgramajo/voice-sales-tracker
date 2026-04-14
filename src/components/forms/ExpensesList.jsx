import { EditIcon } from '../Icons';
import { formatCurrency } from '../../utils/formatters';

const ExpensesList = ({ expenses, onEdit, onDelete }) => {
  if (expenses.length === 0) return null;

  return (
    <div className="gastos-list-section">
      <h3>Gastos del día</h3>
      <ul className="gastos-simple-list">
        {expenses.map((item) => (
          <li key={item.id} className={`gasto-simple-item ${item.type}`}>
            <div className="gasto-simple-info">
              <span className="gasto-simple-desc">{item.description}</span>
              <span className="gasto-simple-monto">-{formatCurrency(item.amount)}</span>
            </div>
            <div className="gasto-simple-actions">
              <button className="gasto-action-btn edit" onClick={() => onEdit(item)} title="Editar">
                <EditIcon />
              </button>
              <button
                className="gasto-action-btn delete"
                onClick={() => onDelete(item)}
                title="Eliminar"
              >
                ×
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExpensesList;
