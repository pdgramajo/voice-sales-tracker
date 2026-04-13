import { useState, useEffect, useCallback, useRef } from 'react';
import useVentas from './hooks/useVentas';
import textToNumber from './utils/textToNumber';
import './App.css';

const SunIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
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

const MoonIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
  </svg>
);

const MenuIcon = () => (
  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"/>
    <line x1="3" y1="6" x2="21" y2="6"/>
    <line x1="3" y1="18" x2="21" y2="18"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
    <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
    <path d="M18 12a2 2 0 0 0 0 4h4v-4h-4z"/>
  </svg>
);

const HistoryIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <polyline points="12,6 12,12 16,14"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"/>
  </svg>
);

const HomeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
    <polyline points="9,22 9,12 15,12 15,22"/>
  </svg>
);

const ReceiptIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 2v20l3-2 3 2 3-2 3 2 3-2 3 2V2l-3 2-3-2-3 2-3-2-3 2-3-2z"/>
    <line x1="8" y1="10" x2="16" y2="10"/>
    <line x1="8" y1="14" x2="16" y2="14"/>
  </svg>
);

const PlusCircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/>
    <line x1="12" y1="8" x2="12" y2="16"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
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

function App() {
  const { ventas, gastos, saldoInicial, totalGastos, efectivoTotal, transferenciaTotal, agregarVenta, agregarGasto, eliminarVenta, eliminarGasto, actualizarSaldoInicial, obtenerHistorial, cerrarDia } = useVentas();
  const totalVentas = efectivoTotal + transferenciaTotal;
  const [currentScreen, setCurrentScreen] = useState('movimientos');
  const [menuOpen, setMenuOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [gastoDescripcion, setGastoDescripcion] = useState('');
  const [gastoMonto, setGastoMonto] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [filtro, setFiltro] = useState(() => {
    const saved = localStorage.getItem('filtro');
    return saved || 'todos';
  });
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  const agregarVentaRef = useRef(agregarVenta);
  const metodoPagoRef = useRef(metodoPago);
  const recognitionRef = useRef(null);
  const gastoInputRef = useRef(null);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('filtro', filtro);
  }, [filtro]);

  useEffect(() => {
    agregarVentaRef.current = agregarVenta;
  }, [agregarVenta]);

  useEffect(() => {
    metodoPagoRef.current = metodoPago;
  }, [metodoPago]);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (SpeechRecognition && !recognitionRef.current) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'es-MX';
      
      rec.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        const numero = textToNumber(transcript);
        if (numero > 0) {
          agregarVentaRef.current(numero, metodoPagoRef.current);
          setInputValue('');
        } else {
          setInputValue(transcript);
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

  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
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

  const handleInputSubmit = () => {
    const numero = parseFloat(inputValue);
    if (!isNaN(numero) && numero > 0) {
      agregarVenta(numero, metodoPago);
      setInputValue('');
    } else {
      const numeroLetras = textToNumber(inputValue);
      if (numeroLetras > 0) {
        agregarVenta(numeroLetras, metodoPago);
        setInputValue('');
      }
    }
  };

  const handleGastoSubmit = (e) => {
    e.preventDefault();
    const monto = parseFloat(gastoMonto);
    if (!isNaN(monto) && monto > 0 && gastoDescripcion.trim()) {
      agregarGasto(monto, gastoDescripcion.trim());
      setGastoDescripcion('');
      setGastoMonto('');
    }
  };

  const navigateTo = (screen) => {
    setCurrentScreen(screen);
    setMenuOpen(false);
  };

  const enCaja = efectivoTotal - totalGastos;
  const ventasEfectivo = totalVentas - transferenciaTotal;

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
            <section className="quick-summary compact">
              <div className="summary-row-compact">
                <div className="summary-col">
                  <span className="label-efectivo"><MoneyIcon /> Efectivo</span>
                  <span className="value">{formatCurrency(ventasEfectivo)}</span>
                </div>
                <div className="summary-col">
                  <span className="label-transferencia"><TransferIcon /> Transferencia</span>
                  <span className="value blue">{formatCurrency(transferenciaTotal)}</span>
                </div>
              </div>
              <div className="summary-row-compact">
                <div className="summary-col">
                  <span className="label">Ventas Totales</span>
                  <span className="value">{formatCurrency(totalVentas)}</span>
                </div>
                <div className="summary-col">
                  <span className="label">Saldo</span>
                  <span className={`value ${enCaja >= 0 ? 'positive' : 'negative'}`}>{formatCurrency(enCaja)}</span>
                </div>
              </div>
            </section>

            <section className="quick-mic-section">
              <p className="mic-instruction">
                Selecciona el tipo y luego presiona 🎤 y dicta el monto
              </p>
              <div className="mic-row">
                <button 
                  type="button"
                  className={`metodo-btn-wide ${metodoPago === 'efectivo' ? 'active efectivo' : ''}`}
                  onClick={() => setMetodoPago('efectivo')}
                >
                  <MoneyIcon /> Efectivo
                </button>
                <button 
                  type="button"
                  className={`metodo-btn-wide ${metodoPago === 'transferencia' ? 'active transferencia' : ''}`}
                  onClick={() => setMetodoPago('transferencia')}
                >
                  <TransferIcon /> Transferencia
                </button>
                <button 
                  className={`mic-btn-large ${isListening ? 'listening' : ''}`}
                  onClick={toggleListening}
                  disabled={!recognitionRef.current}
                >
                  {isListening ? '⏹' : '🎤'}
                </button>
              </div>
            </section>

            <section className="ventas-section">
              <div className="filtros">
                <button className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>Todos</button>
                <button className={`filtro-btn ${filtro === 'efectivo' ? 'active' : ''}`} onClick={() => setFiltro('efectivo')}>Efectivo</button>
                <button className={`filtro-btn ${filtro === 'transferencia' ? 'active' : ''}`} onClick={() => setFiltro('transferencia')}>Transferencia</button>
                <button className={`filtro-btn ${filtro === 'gastos' ? 'active' : ''}`} onClick={() => setFiltro('gastos')}>Gastos</button>
              </div>

              {filteredItems.length === 0 ? (
                <p className="no-ventas">No hay movimientos registrados hoy</p>
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
          </>
        );

      case 'agregar-venta':
        return (
          <section className="venta-form-section">
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
                className={`metodo-btn ${metodoPago === 'transferencia' ? 'active' : ''}`}
                onClick={() => setMetodoPago('transferencia')}
              >
                <TransferIcon /> Transferencia
              </button>
            </div>
            
            <div className="voice-controls">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Di un número o escríbelo..."
                className="voice-input"
              />
              <button 
                className={`mic-btn ${isListening ? 'listening' : ''}`}
                onClick={toggleListening}
                disabled={!recognitionRef.current}
              >
                {isListening ? '⏹' : '🎤'}
              </button>
            </div>
            <button className="save-btn" onClick={handleInputSubmit}>
              Guardar
            </button>
          </section>
        );

      case 'agregar-gasto':
        return (
          <section className="gasto-form-section">
            <h2>Agregar Gasto</h2>
            <form onSubmit={handleGastoSubmit} className="gasto-form">
              <input
                ref={gastoInputRef}
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
          <>
            <section className="resumen-section">
              <div className="resumen-header">
                <h2>Resumen del Día</h2>
                <p className="fecha">{formatDate()}</p>
              </div>
              
              <div className="saldo-inicial-section">
                <label className="saldo-inicial-label">
                  <WalletIcon /> Saldo Inicial en Caja
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
                  <span>Ventas en Efectivo</span>
                  <span className="green">{formatCurrency(ventasEfectivo)}</span>
                </div>
                <div className="resumen-row">
                  <span>Ventas por Transferencia</span>
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
                <div className="resumen-divider"></div>
                <div className="resumen-row highlight">
                  <span>Saldo Inicial</span>
                  <span>{formatCurrency(saldoInicial)}</span>
                </div>
                <div className="resumen-row final">
                  <span>En Caja</span>
                  <span className={enCaja >= 0 ? 'green' : 'red'}>{formatCurrency(enCaja)}</span>
                </div>
              </div>
              
              <button className="close-day-btn" onClick={cerrarDia}>
                <DownloadIcon />
                Cerrar Día
              </button>
            </section>
          </>
        );

      case 'historial':
        const historial = obtenerHistorial();
        return (
          <section className="historial-section">
            <h2>Historial</h2>
            {historial.length === 0 ? (
              <p className="no-ventas">No hay registros anteriores</p>
            ) : (
              <ul className="historial-list">
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

      case 'configuracion':
        return (
          <section className="config-section">
            <h2>Configuración</h2>
            <div className="config-item">
              <span>Tema</span>
              <button className="theme-toggle-btn" onClick={toggleTheme}>
                {theme === 'light' ? <><SunIcon /> Claro</> : <><MoonIcon /> Oscuro</>}
              </button>
            </div>
          </section>
        );

      default:
        return null;
    }
  };

  const getScreenTitle = () => {
    switch (currentScreen) {
      case 'movimientos': return 'Movimientos';
      case 'agregar-venta': return 'Agregar Venta';
      case 'agregar-gasto': return 'Agregar Gasto';
      case 'resumen': return 'Resumen';
      case 'historial': return 'Historial';
      case 'configuracion': return 'Configuración';
      default: return '';
    }
  };

  return (
    <>
      {menuOpen && <div className="menu-overlay" onClick={() => setMenuOpen(false)} />}
      
      <nav className={`drawer ${menuOpen ? 'open' : ''}`}>
        <div className="drawer-header">
          <h3>Menú</h3>
          <button className="drawer-close" onClick={() => setMenuOpen(false)}>
            <CloseIcon />
          </button>
        </div>
        <ul className="drawer-menu">
          <li className={currentScreen === 'movimientos' ? 'active' : ''}>
            <button onClick={() => navigateTo('movimientos')}>
              <HomeIcon /> Movimientos
            </button>
          </li>
          <li className={currentScreen === 'agregar-venta' ? 'active' : ''}>
            <button onClick={() => navigateTo('agregar-venta')}>
              <PlusCircleIcon /> Agregar Venta
            </button>
          </li>
          <li className={currentScreen === 'agregar-gasto' ? 'active' : ''}>
            <button onClick={() => navigateTo('agregar-gasto')}>
              <ReceiptIcon /> Agregar Gasto
            </button>
          </li>
          <li className={currentScreen === 'resumen' ? 'active' : ''}>
            <button onClick={() => navigateTo('resumen')}>
              <WalletIcon /> Resumen
            </button>
          </li>
          <li className={currentScreen === 'historial' ? 'active' : ''}>
            <button onClick={() => navigateTo('historial')}>
              <HistoryIcon /> Historial
            </button>
          </li>
          <li className={currentScreen === 'configuracion' ? 'active' : ''}>
            <button onClick={() => navigateTo('configuracion')}>
              <SettingsIcon /> Configuración
            </button>
          </li>
        </ul>
      </nav>

      <div className="container">
        <header className="header">
          <button className="menu-btn" onClick={() => setMenuOpen(true)}>
            <MenuIcon />
          </button>
          <div className="header-content">
            <h1>Registro de <span>Ventas</span></h1>
          </div>
          <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
            {theme === 'light' ? <MoonIcon /> : <SunIcon />}
          </button>
        </header>

        {renderScreen()}
      </div>
    </>
  );
}

export default App;
