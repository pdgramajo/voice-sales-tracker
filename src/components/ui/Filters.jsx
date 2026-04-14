const Filters = ({ filter, setFilter, counts }) => {
  return (
    <div className="filtros">
      <button 
        className={`filtro-btn ${filter === 'todos' ? 'active' : ''}`} 
        onClick={() => setFilter('todos')}
      >
        Todos ({counts.total})
      </button>
      <button 
        className={`filtro-btn ${filter === 'efectivo' ? 'active' : ''}`} 
        onClick={() => setFilter('efectivo')}
      >
        Efec ({counts.efectivo})
      </button>
      <button 
        className={`filtro-btn ${filter === 'transferencia' ? 'active' : ''}`} 
        onClick={() => setFilter('transferencia')}
      >
        Trans ({counts.transferencia})
      </button>
      <button 
        className={`filtro-btn ${filter === 'gastos' ? 'active' : ''}`} 
        onClick={() => setFilter('gastos')}
      >
        Gastos ({counts.gastos})
      </button>
    </div>
  );
};

export default Filters;
