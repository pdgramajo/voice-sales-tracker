const Toast = ({ message }) => {
  if (!message) return null;

  return <div className={`toast ${message.startsWith('❌') ? 'error' : 'success'}`}>{message}</div>;
};

export default Toast;
