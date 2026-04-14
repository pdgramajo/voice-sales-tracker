import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

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
      <section className="history-section">
        <div className="history-header">
          <button className="history-back-btn" onClick={onBack}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </button>
          <div className="history-title-group">
            <h2>Historial</h2>
            <span className="history-subtitle">Días cerrados</span>
          </div>
        </div>
        <div className="history-empty">
          <div className="history-empty-icon">
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" />
              <path d="M9 9h6M9 13h6M9 17h4" />
            </svg>
          </div>
          <p>No hay días registrados</p>
          <span>Cierra un día para ver el historial aquí</span>
        </div>
      </section>
    );
  }

  const getMonthStats = (items) => {
    const totalVentas = items.reduce((sum, i) => sum + (i.summary?.totalSales || 0), 0);
    const totalCashIn = items.reduce((sum, i) => sum + (i.summary?.cashInDrawer || 0), 0);
    return { totalVentas, totalCashIn };
  };

  return (
    <section className="history-section">
      <div className="history-header">
        <button className="history-back-btn" onClick={onBack}>
          <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="history-title-group">
          <h2>Historial</h2>
          <span className="history-subtitle">{history.length} días registrados</span>
        </div>
      </div>

      <div className="history-content">
        {Object.entries(groupedByMonth).map(([month, items], monthIndex) => {
          const stats = getMonthStats(items);
          const isExpanded = expandedMonth === month;

          return (
            <div
              key={month}
              className={`history-month ${isExpanded ? 'expanded' : ''}`}
              style={{ animationDelay: `${monthIndex * 80}ms` }}
            >
              <button className="month-toggle" onClick={() => toggleMonth(month)}>
                <div className="month-info">
                  <div className="month-icon">
                    <svg
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <rect x="3" y="4" width="18" height="18" rx="2" />
                      <path d="M16 2v4M8 2v4M3 10h18" />
                    </svg>
                  </div>
                  <div className="month-text">
                    <span className="month-name">{month}</span>
                    <span className="month-count">{items.length} días</span>
                  </div>
                </div>

                <div className="month-right">
                  <div className="month-stats">
                    <span className="month-sales">{formatCurrency(stats.totalVentas)}</span>
                  </div>
                  <div className={`month-chevron ${isExpanded ? 'rotated' : ''}`}>
                    <svg
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                    >
                      <path d="M6 9l6 6 6-6" />
                    </svg>
                  </div>
                </div>
              </button>

              <div className={`month-days ${isExpanded ? 'visible' : ''}`}>
                <div className="days-list">
                  {items.map((item, index) => {
                    const dayPart = item.fecha.split(' ')[0];
                    const cashIn = item.summary?.cashInDrawer || 0;
                    const isPositive = cashIn >= 0;

                    return (
                      <button
                        key={index}
                        className="day-card"
                        onClick={() => onSelectDay(item)}
                        style={{ animationDelay: `${index * 50}ms` }}
                      >
                        <div className="day-card-left">
                          <div className="day-name">{dayPart}</div>
                          <div className="day-details">
                            <span className="day-sales-count">
                              <svg
                                width="12"
                                height="12"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                              </svg>
                              {item.sales?.length || 0} ventas
                            </span>
                            {item.expenses?.length > 0 && (
                              <span className="day-expenses-count">
                                <svg
                                  width="12"
                                  height="12"
                                  viewBox="0 0 24 24"
                                  fill="none"
                                  stroke="currentColor"
                                  strokeWidth="2"
                                >
                                  <path d="M12 2v20M2 12h20" />
                                </svg>
                                {item.expenses.length} gastos
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="day-card-right">
                          <div className={`day-cash ${isPositive ? 'positive' : 'negative'}`}>
                            {formatCurrency(cashIn)}
                          </div>
                          <svg
                            className="day-arrow"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                          >
                            <path d="M9 18l6-6-6-6" />
                          </svg>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default HistoryScreen;
