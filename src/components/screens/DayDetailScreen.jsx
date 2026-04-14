import { useMemo, useState } from 'react';
import { formatCurrency } from '../../utils/formatters';

const DayDetailScreen = ({ day, onBack }) => {
  const [activeTab, setActiveTab] = useState('ventas');

  const stats = useMemo(
    () => ({
      totalVentas: day.sales?.length || 0,
      efectivo: day.sales?.filter((s) => s.paymentMethod === 'efectivo').length || 0,
      transferencia: day.sales?.filter((s) => s.paymentMethod === 'transferencia').length || 0,
      gastos: day.expenses?.length || 0,
      stock: day.stock?.length || 0,
    }),
    [day]
  );

  const tabs = [
    {
      id: 'todos',
      label: 'Todos',
      count: stats.totalVentas + stats.gastos + stats.stock,
      color: 'var(--text-secondary)',
    },
    { id: 'ventas', label: 'Ventas', count: stats.totalVentas, color: 'var(--success-efectivo)' },
    { id: 'gastos', label: 'Gastos', count: stats.gastos, color: 'var(--danger)' },
    { id: 'stock', label: 'Stock', count: stats.stock, color: 'var(--accent-primary)' },
  ];

  return (
    <section className="day-detail-section">
      <div className="day-detail-header">
        <button className="day-detail-back-btn" onClick={onBack}>
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
        <div className="day-detail-title">
          <span className="day-detail-date">{day.fecha}</span>
          <span className="day-detail-readonly">Solo lectura</span>
        </div>
      </div>

      <div className="day-stats-grid">
        <div className="day-stat-card highlight">
          <div className="day-stat-label">En Caja</div>
          <div className={`day-stat-value ${day.cashInDrawer >= 0 ? 'positive' : 'negative'}`}>
            {formatCurrency(day.cashInDrawer)}
          </div>
        </div>

        <div className="day-stat-row">
          <div className="day-stat-mini">
            <span className="mini-label">Inicio</span>
            <span className="mini-value">{formatCurrency(day.initialBalance)}</span>
          </div>
          <div className="day-stat-mini">
            <span className="mini-label">Ventas</span>
            <span className="mini-value success">{formatCurrency(day.totalSales)}</span>
          </div>
          <div className="day-stat-mini">
            <span className="mini-label">Gastos</span>
            <span className="mini-value danger">-{formatCurrency(day.totalExpenses)}</span>
          </div>
        </div>

        <div className="day-payment-breakdown">
          <div className="breakdown-item efectivo">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
            </svg>
            <span>Efectivo</span>
            <span className="breakdown-value">
              {formatCurrency(day.cashTotal - day.initialBalance)}
            </span>
          </div>
          <div className="breakdown-item transferencia">
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
            </svg>
            <span>Transferencia</span>
            <span className="breakdown-value">{formatCurrency(day.transferTotal)}</span>
          </div>
        </div>
      </div>

      <div className="day-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`day-tab ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
            style={{ '--tab-color': tab.color }}
          >
            {tab.label}
            <span className="tab-count">{tab.count}</span>
          </button>
        ))}
      </div>

      <div className="day-transactions-list">
        {activeTab === 'todos' && (
          <>
            {!day.sales?.length && !day.expenses?.length && !day.stock?.length ? (
              <div className="day-empty">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <p>Sin transacciones este día</p>
              </div>
            ) : (
              <>
                {day.sales?.map((sale, index) => (
                  <div
                    key={`sale-${sale.id}`}
                    className={`transaction-item ${sale.paymentMethod}`}
                    style={{ animationDelay: `${index * 30}ms` }}
                  >
                    <div className="transaction-left">
                      <div className="transaction-time">{sale.dateString}</div>
                      <div className="transaction-method">
                        <span className={`method-dot ${sale.paymentMethod}`}></span>
                        Venta {sale.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                      </div>
                    </div>
                    <div className={`transaction-amount ${sale.paymentMethod}`}>
                      +{formatCurrency(sale.amount)}
                    </div>
                  </div>
                ))}
                {day.expenses?.map((expense, index) => (
                  <div
                    key={`expense-${expense.id}`}
                    className={`transaction-item expense ${expense.type}`}
                    style={{ animationDelay: `${(day.sales?.length || 0) + index * 30}ms` }}
                  >
                    <div className="transaction-left">
                      <div className="transaction-desc">
                        {expense.description || 'Sin descripción'}
                      </div>
                      <div className="transaction-type">
                        {expense.type === 'withdrawal' ? 'Retiro' : 'Gasto'}
                      </div>
                    </div>
                    <div className="transaction-amount expense">
                      -{formatCurrency(expense.amount)}
                    </div>
                  </div>
                ))}
                {day.stock?.map((entry, index) => (
                  <div
                    key={`stock-${entry.id}`}
                    className={`transaction-item stock ${entry.type}`}
                    style={{
                      animationDelay: `${(day.sales?.length || 0) + (day.expenses?.length || 0) + index * 30}ms`,
                    }}
                  >
                    <div className="transaction-left">
                      <div className="transaction-desc">{entry.description}</div>
                      <div className={`stock-badge ${entry.type}`}>
                        {entry.type === 'entrada' ? 'Entrada' : 'Salida'} Stock
                      </div>
                    </div>
                    <div className={`transaction-amount stock ${entry.type}`}>
                      {entry.type === 'entrada' ? '+' : '-'}
                    </div>
                  </div>
                ))}
              </>
            )}
          </>
        )}

        {activeTab === 'ventas' && (
          <>
            {!day.sales || day.sales.length === 0 ? (
              <div className="day-empty">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
                <p>Sin ventas este día</p>
              </div>
            ) : (
              day.sales.map((sale, index) => (
                <div
                  key={sale.id}
                  className={`transaction-item ${sale.paymentMethod}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="transaction-left">
                    <div className="transaction-time">{sale.dateString}</div>
                    <div className="transaction-method">
                      <span className={`method-dot ${sale.paymentMethod}`}></span>
                      {sale.paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}
                    </div>
                  </div>
                  <div className={`transaction-amount ${sale.paymentMethod}`}>
                    +{formatCurrency(sale.amount)}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'gastos' && (
          <>
            {!day.expenses || day.expenses.length === 0 ? (
              <div className="day-empty">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M12 2v20M2 12h20" />
                </svg>
                <p>Sin gastos este día</p>
              </div>
            ) : (
              day.expenses.map((expense, index) => (
                <div
                  key={expense.id}
                  className={`transaction-item expense ${expense.type}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="transaction-left">
                    <div className="transaction-desc">
                      {expense.description || 'Sin descripción'}
                    </div>
                    <div className="transaction-type">
                      {expense.type === 'withdrawal' ? 'Retiro' : 'Gasto'}
                    </div>
                  </div>
                  <div className="transaction-amount expense">
                    -{formatCurrency(expense.amount)}
                  </div>
                </div>
              ))
            )}
          </>
        )}

        {activeTab === 'stock' && (
          <>
            {!day.stock || day.stock.length === 0 ? (
              <div className="day-empty">
                <svg
                  width="40"
                  height="40"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                </svg>
                <p>Sin movimientos de stock</p>
              </div>
            ) : (
              day.stock.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`transaction-item stock ${entry.type}`}
                  style={{ animationDelay: `${index * 40}ms` }}
                >
                  <div className="transaction-left">
                    <div className="transaction-desc">{entry.description}</div>
                    <div className={`stock-badge ${entry.type}`}>
                      {entry.type === 'entrada' ? 'Entrada' : 'Salida'}
                    </div>
                  </div>
                  <div className={`transaction-amount stock ${entry.type}`}>
                    {entry.type === 'entrada' ? '+' : '-'}
                  </div>
                </div>
              ))
            )}
          </>
        )}
      </div>
    </section>
  );
};

export default DayDetailScreen;
