import { useDispatch, useSelector } from 'react-redux';
import { useCallback, useRef } from 'react';
import { showToast, clearToast } from '../store/slices/uiSlice';

export const useToast = () => {
  const dispatch = useDispatch();
  const toast = useSelector((state) => state.ui.toast);
  const timeoutRef = useRef(null);

  const show = useCallback(
    (message, duration = 2000) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      dispatch(showToast(message));
      timeoutRef.current = setTimeout(() => {
        dispatch(clearToast());
      }, duration);
    },
    [dispatch]
  );

  const hide = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    dispatch(clearToast());
  }, [dispatch]);

  return { toast, show, hide };
};
