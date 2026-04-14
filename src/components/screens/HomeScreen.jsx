import SummaryGrid from '../ui/SummaryGrid';
import TransactionList from '../ui/TransactionList';
import { MicIcon } from '../Icons';

const HomeScreen = ({ 
  salesCash, 
  transferTotal, 
  totalSales, 
  cashInDrawer,
  items,
  filter, 
  setFilter,
  counts,
  onDelete,
  isListening,
  toggleListening
}) => {
  return (
    <>
      <section className="summary-section">
        <SummaryGrid 
          cash={salesCash}
          transfer={transferTotal}
          total={totalSales}
          balance={cashInDrawer}
        />
      </section>

      <TransactionList 
        items={items}
        filter={filter}
        setFilter={setFilter}
        counts={counts}
        onDelete={onDelete}
        emptyMessage="No hay movimientos hoy"
      />

      <button 
        className={`fab-mic ${isListening ? 'listening' : ''}`}
        onClick={toggleListening}
      >
        {isListening ? '×' : <MicIcon />}
      </button>
    </>
  );
};

export default HomeScreen;
