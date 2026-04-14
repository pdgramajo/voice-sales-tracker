import { BookIcon, HistoryIcon } from '../Icons';

const ConfigScreen = ({ onNavigate }) => {
  return (
    <section className="config-section">
      <h2>Configuración</h2>
      <div className="config-menu">
        <button 
          className="config-item"
          onClick={() => onNavigate('historial')}
        >
          <HistoryIcon />
          <div className="config-item-text">
            <span className="config-item-title">Historial</span>
            <span className="config-item-desc">Ver días cerrados anteriormente</span>
          </div>
        </button>
        <button 
          className="config-item"
          onClick={() => onNavigate('guia')}
        >
          <BookIcon />
          <div className="config-item-text">
            <span className="config-item-title">Guía de Comandos</span>
            <span className="config-item-desc">Aprende a usar la app</span>
          </div>
        </button>
      </div>
    </section>
  );
};

export default ConfigScreen;
