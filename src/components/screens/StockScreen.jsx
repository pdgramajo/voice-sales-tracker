import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addEntry, deleteEntry } from '../../store/slices/stockSlice';
import { TrashIcon } from '../Icons';

const StockScreen = ({ onBack, onShowToast }) => {
  const dispatch = useDispatch();
  const entries = useSelector(state => state.stock.entries);
  const [type, setType] = useState('entrada');
  const [description, setDescription] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!description.trim()) return;
    
    dispatch(addEntry({ type, description: description.trim() }));
    setDescription('');
    onShowToast(`${type === 'entrada' ? 'Entrada' : 'Salida'} de stock agregada`);
  };

  const handleDelete = (id) => {
    dispatch(deleteEntry(id));
    onShowToast('Entrada eliminada');
  };

  const entriesCount = entries.filter(e => e.type === 'entrada').length;
  const exitsCount = entries.filter(e => e.type === 'salida').length;

  return (
    <section className="gasto-form-section">
      <div className="screen-header">
        <button className="back-btn" onClick={onBack}>←</button>
        <h2>Stock</h2>
      </div>

      <form onSubmit={handleSubmit} className="stock-form">
        <div className="type-toggle">
          <button
            type="button"
            className={`toggle-btn ${type === 'entrada' ? 'active entrada' : ''}`}
            onClick={() => setType('entrada')}
          >
            Entrada
          </button>
          <button
            type="button"
            className={`toggle-btn ${type === 'salida' ? 'active salida' : ''}`}
            onClick={() => setType('salida')}
          >
            Salida
          </button>
        </div>

        <input
          type="text"
          placeholder="Descripción del movimiento..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="form-input"
        />

        <button type="submit" className="submit-btn" disabled={!description.trim()}>
          Agregar {type === 'entrada' ? 'Entrada' : 'Salida'}
        </button>
      </form>

      <div className="stock-summary">
        <span className="entrada-count">Entradas: {entriesCount}</span>
        <span className="salida-count">Salidas: {exitsCount}</span>
      </div>

      {entries.length > 0 ? (
        <ul className="stock-list">
          {entries.map((entry) => (
            <li key={entry.id} className={`stock-item ${entry.type}`}>
              <div className="stock-item-info">
                <span className={`stock-badge ${entry.type}`}>
                  {entry.type === 'entrada' ? '+' : '-'}
                </span>
                <span className="stock-description">{entry.description}</span>
              </div>
              <button 
                className="delete-btn"
                onClick={() => handleDelete(entry.id)}
              >
                <TrashIcon />
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className="no-items">No hay movimientos de stock</p>
      )}
    </section>
  );
};

export default StockScreen;
