import { formatCurrency } from '../../utils/formatters';

const HistoryScreen = ({ history }) => {
  return (
    <section className="historial-section">
      <h2>Historial</h2>
      {history.length === 0 ? (
        <p className="no-ventas">No hay registros anteriores</p>
      ) : (
        <ul className="ventas-list">
          {history
            .slice()
            .reverse()
            .map((item, index) => (
              <li key={index} className="historial-item">
                <div className="historial-info">
                  <span className="historial-fecha">{item.fecha}</span>
                  <span className="historial-detalles">
                    Ventas: {formatCurrency(item.totalSalesAmount)} | Gastos:{' '}
                    {formatCurrency(item.totalExpenses)}
                  </span>
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
    </section>
  );
};

export default HistoryScreen;
