import { useState, useEffect, useCallback, useRef } from 'react';
import { parseVoiceCommand } from '../utils/voiceParser';

const useVoiceRecognition = ({
  onAddSale,
  onAddExpense,
  onAddWithdrawal,
  onUpdateInitialBalance,
  onShowToast,
}) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);

  const onAddSaleRef = useRef(onAddSale);
  const onAddExpenseRef = useRef(onAddExpense);
  const onAddWithdrawalRef = useRef(onAddWithdrawal);
  const onUpdateInitialBalanceRef = useRef(onUpdateInitialBalance);
  const onShowToastRef = useRef(onShowToast);

  useEffect(() => {
    onAddSaleRef.current = onAddSale;
  }, [onAddSale]);

  useEffect(() => {
    onAddExpenseRef.current = onAddExpense;
  }, [onAddExpense]);

  useEffect(() => {
    onAddWithdrawalRef.current = onAddWithdrawal;
  }, [onAddWithdrawal]);

  useEffect(() => {
    onUpdateInitialBalanceRef.current = onUpdateInitialBalance;
  }, [onUpdateInitialBalance]);

  useEffect(() => {
    onShowToastRef.current = onShowToast;
  }, [onShowToast]);

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
          if (result.type === 'initial-balance') {
            onUpdateInitialBalanceRef.current(result.amount);
            onShowToastRef.current(`Inicio caja $${result.amount.toLocaleString()}`);
          } else if (result.type === 'withdrawal') {
            onAddWithdrawalRef.current(result.amount, result.description);
            onShowToastRef.current(
              `Retiro $${result.amount.toLocaleString()} ${result.description}`
            );
          } else if (result.type === 'expense') {
            onAddExpenseRef.current(result.amount, result.description || 'Sin descripción');
            const descText = result.description ? ` - ${result.description}` : '';
            onShowToastRef.current(`Gasto $${result.amount.toLocaleString()}${descText}`);
          } else {
            onAddSaleRef.current(result.amount, result.method);
            const methodLabel = result.method === 'efectivo' ? 'Efec' : 'Trans';
            onShowToastRef.current(`Venta ${methodLabel} $${result.amount.toLocaleString()}`);
          }
        } else {
          onShowToastRef.current(result.error);
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

  return {
    isListening,
    toggleListening,
    recognitionRef,
  };
};

export default useVoiceRecognition;
