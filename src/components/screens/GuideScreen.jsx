import { ArrowLeftIcon, MicIcon } from '../Icons';

const GuideScreen = ({ onBack }) => {
  return (
    <section className="guia-section">
      <button className="guia-back-btn" onClick={onBack}>
        <ArrowLeftIcon />
        Volver
      </button>
      <h2>Guía de Comandos</h2>
      
      <div className="guia-content">
        <div className="guia-section-title">
          <MicIcon />
          Comandos de Voz
        </div>
        
        <div className="guia-group">
          <div className="guia-command-title">Ventas</div>
          <div className="guia-item">
            <div className="guia-example">"venta mil efectivo"</div>
            <div className="guia-result">→ Registra $1,000 en efectivo</div>
          </div>
          <div className="guia-item">
            <div className="guia-example">"venta dos mil transferencia"</div>
            <div className="guia-result">→ Registra $2,000 por transferencia</div>
          </div>
        </div>

        <div className="guia-group">
          <div className="guia-command-title">Gastos</div>
          <div className="guia-item">
            <div className="guia-example">"gasto quinientos en papel"</div>
            <div className="guia-result">→ Gasto $500 con descripción "papel"</div>
          </div>
        </div>

        <div className="guia-group">
          <div className="guia-command-title">Retiros</div>
          <div className="guia-item">
            <div className="guia-example">"retiro trescientos Juan Pérez"</div>
            <div className="guia-result">→ Retiro $300</div>
          </div>
        </div>

        <div className="guia-group">
          <div className="guia-command-title">Inicio de Caja</div>
          <div className="guia-item">
            <div className="guia-example">"inicio de caja cinco mil"</div>
            <div className="guia-result">→ Empieza el día con $5,000 en caja</div>
          </div>
        </div>

        <div className="guia-divider"></div>

        <div className="guia-section-title">
          <span>📱</span>
          Funcionalidades
        </div>

        <div className="guia-features">
          <div className="guia-feature">• Ver tu resumen de ventas en Home</div>
          <div className="guia-feature">• Agregar ventas por voz o manualmente</div>
          <div className="guia-feature">• Registrar gastos y retiros</div>
          <div className="guia-feature">• Editar o eliminar gastos desde la sección Gasto</div>
          <div className="guia-feature">• Ver cuánto dinero hay en caja</div>
          <div className="guia-feature">• Cerrar el día y descargar tu reporte en PDF</div>
          <div className="guia-feature">• Revisar tu historial de días anteriores</div>
        </div>
      </div>
    </section>
  );
};

export default GuideScreen;
