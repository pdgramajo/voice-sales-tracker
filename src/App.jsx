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

const DownloadIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
    <polyline points="7,10 12,15 17,10"/>
    <line x1="12" y1="15" x2="12" y2="3"/>
  </svg>
);

const CloseIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"/>
    <line x1="6" y1="6" x2="18" y2="18"/>
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
  const [inputValue, setInputValue] = useState('');
  const [metodoPago, setMetodoPago] = useState('efectivo');
  const [gastoDescripcion, setGastoDescripcion] = useState('');
  const [gastoMonto, setGastoMonto] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [showGastoModal, setShowGastoModal] = useState(false);
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
    if (showGastoModal && gastoInputRef.current) {
      setTimeout(() => gastoInputRef.current.focus(), 100);
    }
  }, [showGastoModal]);

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
      setShowGastoModal(false);
    }
  };

  const openGastoModal = () => {
    setGastoDescripcion('');
    setGastoMonto('');
    setShowGastoModal(true);
  };

  const closeGastoModal = () => {
    setShowGastoModal(false);
  };

  const enCaja = efectivoTotal - totalGastos;

  const allItems = [...ventas, ...gastos].sort((a, b) => b.timestamp - a.timestamp);
  
  const filteredItems = allItems.filter(item => {
    if (filtro === 'efectivo') return item.tipo === 'venta' && item.metodoPago === 'efectivo';
    if (filtro === 'transferencia') return item.tipo === 'venta' && item.metodoPago === 'transferencia';
    if (filtro === 'gastos') return item.tipo === 'gasto';
    return true;
  });

  return (
    <>
      <button className="theme-toggle" onClick={toggleTheme} aria-label="Cambiar tema">
        {theme === 'light' ? <MoonIcon /> : <SunIcon />}
      </button>
      
      <div className="container">
        <header className="header">
          <div className="header-content">
            <h1>Registro de <span>Ventas</span></h1>
            <p className="fecha">{formatDate()}</p>
          </div>
        </header>

        <section className="total-section">
          <h2>Resumen del Día</h2>
          
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
          
          <div className="totals-grid">
            <div className="total-item">
              <span className="total-label">Ventas Efectivo</span>
              <span className="total-value success">{formatCurrency(totalVentas - transferenciaTotal)}</span>
            </div>
            <div className="total-item">
              <span className="total-label">Transferencia</span>
              <span className="total-value" style={{color: 'var(--success-transferencia)'}}>{formatCurrency(transferenciaTotal)}</span>
            </div>
          </div>
          
          <div className="totals-grid">
            <div className="total-item">
              <span className="total-label">Gastos</span>
              <span className="total-value danger">-{formatCurrency(totalGastos)}</span>
            </div>
            <div className="total-item">
              <span className="total-label">Total Ventas</span>
              <span className="total-value success">{formatCurrency(totalVentas)}</span>
            </div>
          </div>
          
          <div className="en-caja-row">
            <div className="en-caja-item">
              <span className="en-caja-label">En Caja</span>
              <span className={`en-caja-value ${enCaja >= 0 ? 'positive' : 'negative'}`}>
                {formatCurrency(enCaja)}
              </span>
            </div>
            <div className="transferencia-item">
              <span className="transferencia-label-text">Transferencia</span>
              <span className="transferencia-value">
                {formatCurrency(transferenciaTotal)}
              </span>
            </div>
          </div>
        </section>

        <section className="voice-section">
          <h3>Dictar Venta</h3>
          
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
          <button className="gasto-btn-secondary" onClick={openGastoModal}>
            + Agregar Gasto
          </button>
        </section>

        <section className="ventas-section">
          <div className="ventas-header">
            <h3>Movimientos del Día</h3>
            <button 
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Ocultar' : 'Ver'} Historial
            </button>
          </div>

          <div className="filtros">
            <button className={`filtro-btn ${filtro === 'todos' ? 'active' : ''}`} onClick={() => setFiltro('todos')}>Todos</button>
            <button className={`filtro-btn ${filtro === 'efectivo' ? 'active' : ''}`} onClick={() => setFiltro('efectivo')}>Efectivo</button>
            <button className={`filtro-btn ${filtro === 'transferencia' ? 'active' : ''}`} onClick={() => setFiltro('transferencia')}>Transferencia</button>
            <button className={`filtro-btn ${filtro === 'gastos' ? 'active' : ''}`} onClick={() => setFiltro('gastos')}>Gastos</button>
          </div>

          {showHistory && (
            <div className="historial">
              <h4>Historial de Días Anteriores</h4>
              {obtenerHistorial().length === 0 ? (
                <p>No hay registros anteriores</p>
              ) : (
                <ul>
                  {obtenerHistorial().slice().reverse().map((item, index) => (
                    <li key={index}>
                      <div className="historial-info">
                        <span className="historial-fecha">{item.fecha}</span>
                        <span className="historial-detalles">
                          Ventas: {formatCurrency(item.totalVentas)} | Gastos: {formatCurrency(item.totalGastos)}
                        </span>
                      </div>
                      <span className="historial-ganancia">
                        {formatCurrency(item.gananciaNeta)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

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
                          ({item.metodoPago === 'efectivo' ? 'E' : 'T'})
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

        <button className="close-day-btn" onClick={cerrarDia}>
          <DownloadIcon />
          Cerrar Día
        </button>
      </div>

      {showGastoModal && (
        <div className="modal-overlay" onClick={closeGastoModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Agregar Gasto</h3>
              <button className="modal-close" onClick={closeGastoModal}>
                <CloseIcon />
              </button>
            </div>
            <form onSubmit={handleGastoSubmit} className="modal-form">
              <input
                ref={gastoInputRef}
                type="text"
                value={gastoDescripcion}
                onChange={(e) => setGastoDescripcion(e.target.value)}
                placeholder="Descripción del gasto..."
                className="modal-input"
                required
              />
              <input
                type="number"
                value={gastoMonto}
                onChange={(e) => setGastoMonto(e.target.value)}
                placeholder="$0.00"
                step="0.01"
                min="0"
                className="modal-input"
                required
              />
              <div className="modal-actions">
                <button type="button" className="modal-cancel" onClick={closeGastoModal}>
                  Cancelar
                </button>
                <button type="submit" className="modal-submit">
                  Agregar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default App;
