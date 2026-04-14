const Filters = ({ filter, setFilter, counts }) => {
  return (
    <div className="filters-container">
      <button
        className={`filter-chip ${filter === 'todos' ? 'active' : ''}`}
        onClick={() => setFilter('todos')}
      >
        Todos
        <span className="chip-count">{counts.total}</span>
      </button>
      <button
        className={`filter-chip efectivo ${filter === 'efectivo' ? 'active' : ''}`}
        onClick={() => setFilter('efectivo')}
      >
        Efectivo
        <span className="chip-count">{counts.efectivo}</span>
      </button>
      <button
        className={`filter-chip transferencia ${filter === 'transferencia' ? 'active' : ''}`}
        onClick={() => setFilter('transferencia')}
      >
        Transferencia
        <span className="chip-count">{counts.transferencia}</span>
      </button>
      <button
        className={`filter-chip gastos ${filter === 'gastos' ? 'active' : ''}`}
        onClick={() => setFilter('gastos')}
      >
        Gastos
        <span className="chip-count">{counts.gastos}</span>
      </button>
    </div>
  );
};

export default Filters;
