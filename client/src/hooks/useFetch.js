import { useCallback, useEffect, useRef, useState } from 'react';
import api from '../services/api';
import getErrorMessage from '../utils/getErrorMessage';

export default function useFetch(url) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [requestVersion, setRequestVersion] = useState(0);
  const requestId = useRef(0);

  const refetch = useCallback(() => {
    setRequestVersion((version) => version + 1);
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    const currentRequestId = requestId.current + 1;
    requestId.current = currentRequestId;

    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const response = await api.get(url, { signal: controller.signal });
        if (!controller.signal.aborted && requestId.current === currentRequestId) {
          setData(response.data);
        }
      } catch (requestError) {
        if (!controller.signal.aborted && requestId.current === currentRequestId) {
          setError(getErrorMessage(requestError));
        }
      } finally {
        if (!controller.signal.aborted && requestId.current === currentRequestId) {
          setLoading(false);
        }
      }
    };

    const task = Promise.resolve().then(load);
    return () => {
      controller.abort();
      void task;
    };
  }, [url, requestVersion]);

  return { data, loading, error, refetch };
}
