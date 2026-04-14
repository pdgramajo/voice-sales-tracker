import { HomeIcon, WalletIcon, PlusIcon, MoneyIcon, HistoryIcon, SettingsIcon } from '../Icons';

const BottomNav = ({ currentScreen, onNavigate }) => {
  const isConfigActive = currentScreen === 'config' || currentScreen === 'guia';
  
  return (
    <nav className="bottom-nav">
      <button 
        className={`nav-item ${currentScreen === 'movimientos' ? 'active' : ''}`}
        onClick={() => onNavigate('movimientos')}
      >
        <HomeIcon />
        Home
      </button>
      <button 
        className={`nav-item ${currentScreen === 'resumen' ? 'active' : ''}`}
        onClick={() => onNavigate('resumen')}
      >
        <WalletIcon />
        Resumen
      </button>
      <button 
        className="nav-item add-btn"
        onClick={() => onNavigate('agregar-venta')}
      >
        <PlusIcon />
      </button>
      <button 
        className={`nav-item ${currentScreen === 'agregar-gasto' ? 'active' : ''}`}
        onClick={() => onNavigate('agregar-gasto')}
      >
        <MoneyIcon />
        Gasto
      </button>
      <button 
        className={`nav-item ${currentScreen === 'historial' ? 'active' : ''}`}
        onClick={() => onNavigate('historial')}
      >
        <HistoryIcon />
        Historial
      </button>
      <button 
        className={`nav-item ${isConfigActive ? 'active' : ''}`}
        onClick={() => onNavigate('config')}
      >
        <SettingsIcon />
        Más
      </button>
    </nav>
  );
};

export default BottomNav;
