import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/formatters';
import { ChevronDownIcon } from '../Icons';

const HistoryScreen = ({ history, onSelectDay, onBack }) => {
  const [expandedMonth, setExpandedMonth] = useState(null);

  const groupedByMonth = useMemo(() => {
    const groups = {};
    history
      .slice()
      .reverse()
      .forEach((item) => {
        const parts = item.fecha.split(' ');
        const monthYear = parts.slice(1).join(' ');
        if (!groups[monthYear]) {
          groups[monthYear] = [];
        }
        groups[monthYear].push(item);
      });
    return groups;
  }, [history]);

  const toggleMonth = (month) => {
    setExpandedMonth(expandedMonth === month ? null : month);
  };

  if (history.length === 0) {
    return (
      <section className="historial-section">
        <div className="screen-header">
          <button className="back-btn" onClick={onBack}>
            ←
          </button>
          <h2>Historial</h2>
        </div>
        <p className="no-items">No hay registros anteriores</p>
      </section>
    );
  }

  return (
    <section className="historial-section">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>
          ←
        </button>
        <h2>Historial</h2>
      </div>

      {Object.entries(groupedByMonth).map(([month, items]) => (
        <div key={month} className="history-month">
          <button
            className={`history-month-header ${expandedMonth === month ? 'expanded' : ''}`}
            onClick={() => toggleMonth(month)}
          >
            <ChevronDownIcon />
            <span>{month}</span>
            <span className="month-count">({items.length})</span>
          </button>

          {expandedMonth === month && (
            <ul className="historial-list">
              {items.map((item, index) => (
                <li key={index} className="historial-item" onClick={() => onSelectDay(item)}>
                  <div className="historial-info">
                    <span className="historial-fecha">{item.fecha}</span>
                    <span className="historial-detalles">{item.sales?.length || 0} ventas</span>
                  </div>
                  <span
                    className={`historial-ganancia ${item.cashInDrawer >= 0 ? 'positive' : 'negative'}`}
                  >
                    {formatCurrency(item.cashInDrawer)}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </section>
  );
};

export default HistoryScreen;
