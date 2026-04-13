import { useState, useEffect, useCallback, useRef } from 'react';
import useVentas from './hooks/useVentas';
import textToNumber from './utils/textToNumber';
import './App.css';

const SunIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="5"/>
    <line x1="12" y1="1" x2="12" y2="3"/>
    <line x1="12" y1="21" x2="12" y2="23"/>
    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
    <line x1="1" y1="12" x2="3" y2="12"/>
    <line x1="21" y1="12" x2="23" y2="12"/>
    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
  </svg>
);

const DownloadIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const MoneyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);

const TransferIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="17 1 21 5 17 9"/>
    <path d="M3 11V9a4 4 0 0 1 4-4h14"/>
    <polyline points="7 23 3 19 7 15"/>
    <path d="M21 13v2a4 4 0 0 1-4 4H3"/>
  </svg>
);

const WalletIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const PlusIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/>
    <line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const MicIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"/>
    <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
    <line x1="12" y1="19" x2="12" y2="23"/>
    <line x1="8" y1="23" x2="16" y2="23"/>
  </svg>
);

const formatCurrency = (amount) => {
  const safeAmount = isNaN(amount) ? 0 : amount;
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(safeAmount);
};

const formatDate = () => {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const now = new Date();
  return `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`;
};

const parseVoiceCommand = (text) => {
  const palabras = text.toLowerCase();
  
  let tipo = null;
  let metodo = null;
  
  if (palabras.includes('venta')) {
    tipo = 'venta';
  } else if (palabras.includes('gasto')) {
    tipo = 'gasto';
  }
  
  if (palabras.includes('efectivo')) {
    metodo = 'efectivo';
  } else if (palabras.includes('transferencia') || palabras.includes('transferir')) {
    metodo = 'transferencia';
  }
  
  const monto = textToNumber(text);
  
  if (!monto || monto <= 0) {
    return { success: false, error: 'Monto no válido' };
  }
  
  if (tipo === 'gasto') {
    return { success: true, tipo: 'gasto', monto };
  }
  
  if (tipo === 'venta') {
    if (!metodo) {
      return { success: false, error: 'Indica Efec o Trans' };
    }
    return { success: true, tipo: 'venta', metodo, monto };
  }
  
  if (metodo && !tipo) {
    return { success: false, error: 'Indica Venta o Gasto' };
  }
  
  return { success: false, error: 'Indica Venta o Gasto' };
};

function App() {
  const { ventas, gastos, saldoInicial, totalGastos, efectivoTotal, transferenciaTotal, agregarVenta, agregarGasto, eliminarVenta, eliminarGasto, actualizarSaldoInicial, obtenerHistorial, cerrarDia } = useVentas();
  const totalVentas = efectivoTotal + transferenciaTotal;
  const [currentScreen, setCurrentScreen] = useState('movimientos');
  const [inputValue, setInputValue] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [gastoDescripcion, setGastoDescripcion] = useState('');
  const [gastoMonto, setGastoMonto] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [filtro, setFiltro] = useState(() => {
    const saved = localStorage.getItem('filtro');
    return saved || 'todos';
  });
  const [toast, setToast] = useState(null);
  const agregarVentaRef = useRef(agregarVenta);
  const agregarGastoRef = useRef(agregarGasto);
  const setToastRef = useRef(setToast);
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    localStorage.setItem('filtro', filtro);
  }, [filtro]);

  useEffect(() => {
    agregarVentaRef.current = agregarVenta;
  }, [agregarVenta]);

  useEffect(() => {
    agregarGastoRef.current = agregarGasto;
  }, [agregarGasto]);

  useEffect(() => {
    setToastRef.current = setToast;
  }, [setToast]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition && !recognitionRef.current) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'es-MX';
      
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        const result = parseVoiceCommand(transcript);
        
        if (result.success) {
          if (result.tipo === 'gasto') {
            agregarGastoRef.current(result.monto, 'Dictado por voz');
            setToastRef.current(`Gasto $${result.monto.toLocaleString()}`);
            setTimeout(() => setToastRef.current(null), 2000);
          } else {
            agregarVentaRef.current(result.monto, result.metodo);
            const metodoLabel = result.metodo === 'efectivo' ? 'Efec' : 'Trans';
            setToastRef.current(`Venta ${metodoLabel} $${result.monto.toLocaleString()}`);
            setTimeout(() => setToastRef.current(null), 2000);
          }
        } else {
          setToastRef.current(result.error);
          setTimeout(() => setToastRef.current(null), 2000);
        }
        setIsListening(false);
      };
      
      rec.onerror = () => {
        setIsListening(false);
      };
      
      rec.onend = () => {
        setIsListening(false);
      };
      
      recognitionRef.current = rec;
    }
  }, []);

  const toggleListening = useCallback(() => {
    const rec = recognitionRef.current;
    if (!rec) return;
    
    if (isListening) {
      rec.stop();
    } else {
      rec.start();
      setIsListening(true);
      setTimeout(() => {
        if (rec && isListening) {
          rec.stop();
        }
      }, 4000);
    }
  }, [isListening]);

  const handleGastoSubmit = (e) => {
    e.preventDefault();
    const monto = parseFloat(gastoMonto);
    if (!isNaN(monto) && monto > 0 && gastoDescripcion.trim()) {
      agregarGasto(monto, gastoDescripcion.trim());
      setGastoDescripcion('');
      setGastoMonto('');
      setToast(`Gasto $${monto.toLocaleString()}`);
      setTimeout(() => setToast(null), 2000);
    }
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
  };

  const enCaja = efectivoTotal - totalGastos;

  const allItems = [...ventas, ...gastos].sort((a, b) => b.timestamp - a.timestamp);
  
  const filteredItems = allItems.filter(item => {
    if (filtro === 'efectivo') return item.tipo === 'venta' && item.metodoPago === 'efectivo';
    if (filtro === 'transferencia') return item.tipo === 'venta' && item.metodoPago === 'transferencia';
    if (filtro === 'gastos') return item.tipo === 'gasto';
    return true;
  });

  const renderScreen = () => {
    switch (currentScreen) {
      case 'movimientos':
        return (
          <>
            <section className="summary-section">
              <div className="summary-grid">
                <div className="summary-card efectivo">
                  <span className="summary-card-label">Efectivo</span>
                  <span className="summary-card-value">{formatCurrency(totalVentas - transferenciaTotal)}</span>
                </div>
                <div className="summary-card transferencia">
                  <span className="summary-card-label">Transferencia</span>
                  <span className="summary-card-value">{formatCurrency(transferenciaTotal)}</span>
                </div>
                <div className="summary-card total">
                  <span className="summary-card-label">Total</span>
                  <span className="summary-card-value">{formatCurrency(totalVentas)}</span>
                </div>
                <div className={`summary-card saldo ${enCaja >= 0 ? '' : 'negative'}`}>
                  <span className="summary-card-label">Saldo</span>
                  <span className="summary-card-value">{formatCurrency(enCaja)}</span>
                </div>
              </div>
            </section>

            <section className="ventas-section">
              <div className="filtros">
                <button className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>Todos</button>
                <button className={`filtro-btn ${filtro === 'efectivo' ? 'active' : ''}`} onClick={() => setFiltro('efectivo')}>Efec</button>
                <button className={`filtro-btn ${filtro === 'transferencia' ? 'active' : ''}`} onClick={() => setFiltro('transferencia')}>Trans</button>
                <button className={`filtro-btn ${filtro === 'gastos' ? 'active' : ''}`} onClick={() => setFiltro('gastos')}>Gastos</button>
              </div>

              {filteredItems.length === 0 ? (
                <p className="no-ventas">No hay movimientos hoy</p>
              ) : (
                <ul className="ventas-list">
                  {filteredItems.map((item) => (
                    <li key={item.id} className={`venta-item ${item.tipo}`}>
                      <div className="venta-info">
                        <span className={`venta-monto ${item.tipo} ${item.metodoPago || ''}`}>
                          {item.tipo === 'venta' ? '+' : '-'}{formatCurrency(item.monto)}
                          {item.tipo === 'venta' && (
                            <span className={`metodo-badge ${item.metodoPago}`}>
                              {item.metodoPago === 'efectivo' ? 'Efec' : 'Trans'}
                            </span>
                          )}
                        </span>
                        <span className="venta-fecha">
                          {item.tipo === 'venta' ? item.fechaCompleta : item.descripcion}
                        </span>
                      </div>
                      <button 
                        className="delete-btn"
                        onClick={() => item.tipo === 'venta' ? eliminarVenta(item.id) : eliminarGasto(item.id)}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <button 
              className={`fab-mic ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              disabled={!recognitionRef.current}
            >
              {isListening ? '×' : '🎤'}
            </button>
          </>
        );

      case 'agregar-venta':
        return (
          <section className="gasto-form-section">
            <h2>Agregar Venta</h2>
            <div className="metodo-pago">
              <button 
                type="button"
                className={`metodo-btn ${metodoPago === 'efectivo' ? 'active' : ''}`}
                onClick={() => setMetodoPago('efectivo')}
              >
                <MoneyIcon /> Efectivo
              </button>
              <button 
                type="button"
                className={`metodo-btn transferencia ${metodoPago === 'transferencia' ? 'active' : ''}`}
                onClick={() => setMetodoPago('transferencia')}
              >
                <TransferIcon /> Transferencia
              </button>
            </div>
            <button 
              className={`fab-mic ${isListening ? 'listening' : ''}`}
              onClick={toggleListening}
              disabled={!recognitionRef.current}
              style={{position: 'relative', margin: '0 auto 20px', display: 'flex'}}
            >
              {isListening ? '×' : '🎤'}
            </button>
          </section>
        );

      case 'agregar-gasto':
        return (
          <section className="gasto-form-section">
            <h2>Agregar Gasto</h2>
            <form onSubmit={handleGastoSubmit} className="gasto-form">
              <input
                type="text"
                value={gastoDescripcion}
                onChange={(e) => setGastoDescripcion(e.target.value)}
                placeholder="Descripción del gasto..."
                className="gasto-input"
                required
              />
              <input
                type="number"
                value={gastoMonto}
                onChange={(e) => setGastoMonto(e.target.value)}
                placeholder="$0.00"
                step="0.01"
                min="0"
                className="gasto-input"
                required
              />
              <button type="submit" className="save-btn">Agregar Gasto</button>
            </form>
          </section>
        );

      case 'resumen':
        return (
          <section className="resumen-section">
            <div className="resumen-header">
              <h2>Resumen del Día</h2>
              <p className="fecha">{formatDate()}</p>
            </div>
            
            <div className="saldo-inicial-section">
              <label className="saldo-inicial-label">
                <WalletIcon /> Saldo Inicial
              </label>
              <input
                type="number"
                className="saldo-inicial-input"
                value={saldoInicial || ''}
                onChange={(e) => actualizarSaldoInicial(e.target.value)}
                placeholder="0.00"
                min="0"
                step="0.01"
              />
            </div>
            
            <div className="resumen-detailed">
              <div className="resumen-row">
                <span>Efectivo</span>
                <span className="green">{formatCurrency(totalVentas - transferenciaTotal)}</span>
              </div>
              <div className="resumen-row">
                <span>Transferencia</span>
                <span className="blue">{formatCurrency(transferenciaTotal)}</span>
              </div>
              <div className="resumen-row total">
                <span>Total Ventas</span>
                <span className="green">{formatCurrency(totalVentas)}</span>
              </div>
              <div className="resumen-row">
                <span>Gastos</span>
                <span className="red">-{formatCurrency(totalGastos)}</span>
              </div>
              <div className="resumen-row final">
                <span>En Caja</span>
                <span>{formatCurrency(enCaja)}</span>
              </div>
            </div>
            
            <button className="close-day-btn" onClick={cerrarDia}>
              <DownloadIcon />
              Cerrar Día
            </button>
          </section>
        );

      case 'historial':
        const historial = obtenerHistorial();
        return (
          <section className="historial-section">
            <h2>Historial</h2>
            {historial.length === 0 ? (
              <p className="no-ventas">No hay registros anteriores</p>
            ) : (
              <ul className="ventas-list">
                {historial.slice().reverse().map((item, index) => (
                  <li key={index} className="historial-item">
                    <div className="historial-info">
                      <span className="historial-fecha">{item.fecha}</span>
                      <span className="historial-detalles">
                        Ventas: {formatCurrency(item.totalVentas)} | Gastos: {formatCurrency(item.totalGastos)}
                      </span>
                    </div>
                    <span className={`historial-ganancia ${item.gananciaNeta >= 0 ? 'positive' : 'negative'}`}>
                      {formatCurrency(item.gananciaNeta)}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </section>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <div className="container">
        {renderScreen()}
      </div>

      <nav className="bottom-nav">
        <button 
          className={`nav-item ${currentScreen === 'movimientos' ? 'active' : ''}`}
          onClick={() => navigateTo('movimientos')}
        >
          <HomeIcon />
          Home
        </button>
        <button 
          className={`nav-item ${currentScreen === 'resumen' ? 'active' : ''}`}
          onClick={() => navigateTo('resumen')}
        >
          <WalletIcon />
          Resumen
        </button>
        <button 
          className="nav-item add-btn"
          onClick={() => {
            if (metodoPago === 'efectivo') {
              setCurrentScreen('agregar-venta');
            } else {
              setCurrentScreen('agregar-venta');
            }
          }}
        >
          <PlusIcon />
        </button>
        <button 
          className={`nav-item ${currentScreen === 'agregar-gasto' ? 'active' : ''}`}
          onClick={() => navigateTo('agregar-gasto')}
        >
          <MoneyIcon />
          Gasto
        </button>
        <button 
          className={`nav-item ${currentScreen === 'historial' ? 'active' : ''}`}
          onClick={() => navigateTo('historial')}
        >
          <HistoryIcon />
          Historial
        </button>
      </nav>

      {toast && (
        <div className={`toast ${toast.startsWith('❌') ? 'error' : 'success'}`}>
          {toast}
        </div>
      )}
    </>
  );
}

export default App;
