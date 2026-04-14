import { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { addSale, deleteSale, updateInitialBalance, clearDay } from './store/slices/salesSlice';
import { addExpense, deleteExpense, updateExpense } from './store/slices/expensesSlice';
import { navigate, setFilter, setEditingExpense, resetExpenseForm, resetSaleForm } from './store/slices/uiSlice';
import { addDay } from './store/slices/historySlice';
import { clearAllEntries } from './store/slices/stockSlice';
import useVoiceRecognition from './hooks/useVoiceRecognition';
import { useToast } from './hooks/useToast';
import BottomNav from './components/ui/BottomNav';
import Toast from './components/ui/Toast';
import HomeScreen from './components/screens/HomeScreen';
import SummaryScreen from './components/screens/SummaryScreen';
import HistoryScreen from './components/screens/HistoryScreen';
import ConfigScreen from './components/screens/ConfigScreen';
import GuideScreen from './components/screens/GuideScreen';
import StockScreen from './components/screens/StockScreen';
import SaleForm from './components/forms/SaleForm';
import ExpenseScreen from './components/screens/ExpenseScreen';
import { generatePDF } from './utils/pdfGenerator';
import './App.css';

function App() {
  const dispatch = useDispatch();
  const { toast, show: showToast } = useToast();
  
  const sales = useSelector(state => state.sales.sales);
  const expenses = useSelector(state => state.expenses.expenses);
  const initialBalance = useSelector(state => state.sales.initialBalance);
  const cashTotal = useSelector(state => state.sales.cashTotal);
  const transferTotal = useSelector(state => state.sales.transferTotal);
  const totalExpenses = useSelector(state => state.expenses.totalExpenses);
  const history = useSelector(state => state.history.history);
  const stockEntries = useSelector(state => state.stock.entries);
  
  const currentScreen = useSelector(state => state.ui.currentScreen);
  const filter = useSelector(state => state.ui.filter);
  const editingExpense = useSelector(state => state.ui.editingExpense);
  const paymentMethod = useSelector(state => state.ui.paymentMethod);
  const expenseDescription = useSelector(state => state.ui.expenseDescription);
  const expenseAmount = useSelector(state => state.ui.expenseAmount);
  const saleAmount = useSelector(state => state.ui.saleAmount);

  const salesCash = sales
    .filter(s => s.paymentMethod === 'efectivo')
    .reduce((sum, s) => sum + s.amount, 0);
  
  const totalSales = salesCash + transferTotal;
  const balance = initialBalance + salesCash;
  const cashInDrawer = balance - totalExpenses;
  const allItems = useMemo(() => 
    [...sales, ...expenses].sort((a, b) => b.timestamp - a.timestamp),
    [sales, expenses]
  );
  
  const filteredItems = useMemo(() => {
    if (filter === 'efectivo') return allItems.filter(i => i.type === 'sale' && i.paymentMethod === 'efectivo');
    if (filter === 'transferencia') return allItems.filter(i => i.type === 'sale' && i.paymentMethod === 'transferencia');
    if (filter === 'gastos') return allItems.filter(i => i.type === 'expense' || i.type === 'withdrawal');
    return allItems;
  }, [allItems, filter]);

  const counts = useMemo(() => ({
    total: allItems.length,
    efectivo: sales.filter(s => s.paymentMethod === 'efectivo').length,
    transferencia: sales.filter(s => s.paymentMethod === 'transferencia').length,
    gastos: expenses.filter(e => e.type === 'expense' || e.type === 'withdrawal').length
  }), [allItems, sales, expenses]);

  const handleCloseDay = () => {
    if (sales.length > 0 || expenses.length > 0 || initialBalance > 0 || stockEntries.length > 0) {
      generatePDF([...sales], [...expenses], initialBalance, [...stockEntries]);
    }
    
    const now = new Date();
    const days = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];
    const dayName = days[now.getDay()];
    const day = now.getDate();
    const year = now.getFullYear();
    
    dispatch(addDay({
      initialBalance,
      totalSales,
      totalExpenses,
      cashTotal,
      transferTotal,
      cashInDrawer,
      salesCount: sales.length,
      expensesCount: expenses.length,
      fecha: `${dayName} ${day} ${year}`
    }));
    
    dispatch(clearDay());
    dispatch(clearAllEntries());
  };

  const { isListening, toggleListening } = useVoiceRecognition({
    onAddSale: (amount, method) => dispatch(addSale({ amount, paymentMethod: method })),
    onAddExpense: (amount, description) => dispatch(addExpense({ amount, description })),
    onAddWithdrawal: (amount, description) => dispatch(addExpense({ amount, description })),
    onUpdateInitialBalance: (amount) => dispatch(updateInitialBalance(amount)),
    onShowToast: showToast
  });

  const handleExpenseSubmit = (amount, description) => {
    if (editingExpense) {
      dispatch(updateExpense({ id: editingExpense.id, amount, description }));
      dispatch(resetExpenseForm());
      showToast('Gasto actualizado');
    } else {
      dispatch(addExpense({ amount, description }));
      dispatch(resetExpenseForm());
      showToast(`Gasto $${amount.toLocaleString()}`);
    }
  };

  const handleEditExpense = (item) => {
    dispatch(setEditingExpense(item));
  };

  const handleCancelEdit = () => {
    dispatch(resetExpenseForm());
  };

  const handleSaleSubmit = (amount, method) => {
    dispatch(addSale({ amount, paymentMethod: method }));
    dispatch(resetSaleForm());
    showToast(`Venta ${method === 'efectivo' ? 'Efec' : 'Trans'} $${amount.toLocaleString()}`);
    dispatch(navigate('movimientos'));
  };

  const handleDeleteTransaction = (item) => {
    if (item.type === 'sale') {
      dispatch(deleteSale(item.id));
      showToast('Venta eliminada');
    } else {
      dispatch(deleteExpense(item.id));
      showToast(`${item.type === 'expense' ? 'Gasto' : 'Retiro'} eliminado`);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'movimientos':
        return (
          <HomeScreen 
            salesCash={salesCash}
            transferTotal={transferTotal}
            totalSales={totalSales}
            cashInDrawer={cashInDrawer}
            items={filteredItems}
            filter={filter}
            setFilter={(f) => dispatch(setFilter(f))}
            counts={counts}
            onDelete={handleDeleteTransaction}
            isListening={isListening}
            toggleListening={toggleListening}
          />
        );

      case 'agregar-venta':
        return (
          <SaleForm 
            paymentMethod={paymentMethod}
            setPaymentMethod={(m) => dispatch({ type: 'ui/setPaymentMethod', payload: m })}
            amount={saleAmount}
            setAmount={(a) => dispatch({ type: 'ui/setSaleAmount', payload: a })}
            onSubmit={handleSaleSubmit}
          />
        );

      case 'agregar-gasto':
        return (
          <ExpenseScreen 
            expenses={expenses}
            editing={editingExpense}
            description={expenseDescription}
            setDescription={(d) => dispatch({ type: 'ui/setExpenseDescription', payload: d })}
            amount={expenseAmount}
            setAmount={(a) => dispatch({ type: 'ui/setExpenseAmount', payload: a })}
            onSubmit={handleExpenseSubmit}
            onCancel={handleCancelEdit}
            onEdit={handleEditExpense}
            onDelete={(id) => dispatch(deleteExpense(id))}
            onShowToast={showToast}
          />
        );

      case 'resumen':
        return (
          <SummaryScreen 
            initialBalance={initialBalance}
            cash={cashTotal - initialBalance}
            transfer={transferTotal}
            totalSales={totalSales}
            totalExpenses={totalExpenses}
            cashInDrawer={cashInDrawer}
            onUpdateInitialBalance={(amount) => dispatch(updateInitialBalance(amount))}
            onCloseDay={handleCloseDay}
          />
        );

      case 'historial':
        return <HistoryScreen history={history} />;

      case 'config':
        return <ConfigScreen onNavigate={(screen) => dispatch(navigate(screen))} />;

      case 'guia':
        return <GuideScreen onBack={() => dispatch(navigate('config'))} />;

      case 'stock':
        return <StockScreen onBack={() => dispatch(navigate('movimientos'))} onShowToast={showToast} />;

      default:
        return null;
    }
  };

  return (
    <>
      <div className="container">
        {renderScreen()}
      </div>
      <BottomNav 
        currentScreen={currentScreen}
        onNavigate={(screen) => dispatch(navigate(screen))}
      />
      <Toast message={toast} />
    </>
  );
}

export default App;
