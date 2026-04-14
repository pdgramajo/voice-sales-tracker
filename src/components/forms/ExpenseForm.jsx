const ExpenseForm = ({ 
  description, 
  setDescription, 
  amount, 
  setAmount, 
  isEditing,
  onSubmit,
  onCancel
}) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    const amountNum = parseFloat(amount);
    if (!isNaN(amountNum) && amountNum > 0 && description.trim()) {
      onSubmit(amountNum, description.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`gasto-form ${isEditing ? 'edit-mode' : ''}`}>
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Descripción del gasto..."
        className="gasto-input"
        required
      />
      <input
        type="number"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        placeholder="$0.00"
        step="0.01"
        min="0"
        className="gasto-input"
        required
      />
      <div className="gasto-form-buttons">
        <button type="submit" className="save-btn">
          {isEditing ? 'Guardar' : 'Agregar Gasto'}
        </button>
        {isEditing && (
          <button 
            type="button" 
            className="cancel-btn"
            onClick={onCancel}
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default ExpenseForm;
