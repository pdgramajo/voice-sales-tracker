import { HomeIcon, WalletIcon, PlusIcon, MoneyIcon, PackageIcon, SettingsIcon } from '../Icons';

const BottomNav = ({ currentScreen, onNavigate }) => {
  const isConfigActive = currentScreen === 'config' || currentScreen === 'guia' || currentScreen === 'stock';
  
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
        className={`nav-item ${currentScreen === 'stock' ? 'active' : ''}`}
        onClick={() => onNavigate('stock')}
      >
        <PackageIcon />
        Stock
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
