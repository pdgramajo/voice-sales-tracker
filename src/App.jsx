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

const formatCurrency = (amount) => {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN'
  }).format(amount);
};

const formatDate = () => {
  const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
  const months = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 
                  'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'];
  const now = new Date();
  return `${days[now.getDay()]} ${now.getDate()} de ${months[now.getMonth()]} ${now.getFullYear()}`;
};

function App() {
  const { ventas, totalDia, agregarVenta, eliminarVenta, obtenerHistorial, cerrarDia } = useVentas();
  const [inputValue, setInputValue] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [theme, setTheme] = useState(() => {
    const saved = localStorage.getItem('theme');
    return saved || 'light';
  });
  const agregarVentaRef = useRef(agregarVenta);
  const recognitionRef = useRef(null);
  
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    agregarVentaRef.current = agregarVenta;
  }, [agregarVenta]);

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
          agregarVentaRef.current(numero);
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
      agregarVenta(numero);
      setInputValue('');
    } else {
      const numeroLetras = textToNumber(inputValue);
      if (numeroLetras > 0) {
        agregarVenta(numeroLetras);
        setInputValue('');
      }
    }
  };

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
          <h2>Total del Día</h2>
          <p className="total-amount">{formatCurrency(totalDia)}</p>
          <p className="ventas-count"><span>{ventas.length}</span> venta{ventas.length !== 1 ? 's' : ''} registradas</p>
        </section>

        <section className="voice-section">
          <h3>Dictar Venta</h3>
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

        <section className="ventas-section">
          <div className="ventas-header">
            <h3>Ventas del Día</h3>
            <button 
              className="history-btn"
              onClick={() => setShowHistory(!showHistory)}
            >
              {showHistory ? 'Ocultar' : 'Ver'} Historial
            </button>
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
                      <span className="historial-fecha">{item.fecha}</span>
                      <span className="historial-total">{formatCurrency(item.total)}</span>
                      <span className="historial-cantidad">({item.cantidadVentas} ventas)</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {ventas.length === 0 ? (
            <p className="no-ventas">No hay ventas registradas hoy</p>
          ) : (
            <ul className="ventas-list">
              {ventas.map((venta) => (
                <li key={venta.id} className="venta-item">
                  <div className="venta-info">
                    <span className="venta-monto">{formatCurrency(venta.monto)}</span>
                    <span className="venta-fecha">{venta.fechaCompleta}</span>
                  </div>
                  <button 
                    className="delete-btn"
                    onClick={() => eliminarVenta(venta.id)}
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
    </>
  );
}

export default App;
