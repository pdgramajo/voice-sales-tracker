import ExpenseForm from '../forms/ExpenseForm';
import ExpensesList from '../forms/ExpensesList';

const ExpenseScreen = ({
  expenses,
  editing,
  description,
  setDescription,
  amount,
  setAmount,
  onSubmit,
  onCancel,
  onEdit,
  onDelete,
  onShowToast,
}) => {
  const handleDelete = (item) => {
    onDelete(item.id);
    if (editing?.id === item.id) {
      onCancel();
    }
    onShowToast(`${item.type === 'withdrawal' ? 'Retiro' : 'Gasto'} eliminado`);
  };

  return (
    <section className="gasto-form-section">
      <h2>{editing ? 'Editar Gasto' : 'Agregar Gasto'}</h2>
      <ExpenseForm
        description={description}
        setDescription={setDescription}
        amount={amount}
        setAmount={setAmount}
        isEditing={editing}
        onSubmit={onSubmit}
        onCancel={onCancel}
      />
      <ExpensesList expenses={expenses} onEdit={onEdit} onDelete={handleDelete} />
    </section>
  );
};

export default ExpenseScreen;
