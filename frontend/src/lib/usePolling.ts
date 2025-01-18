import { useState, useEffect, useCallback, useRef } from "react";
export default function usePolling<T>(
  url: string,
  delay_msec: number,
  pollingOpts: { enabled?: boolean } = { enabled: true }
): { data: T | null; loading: boolean; error: Error | null, resetData: () => void, headers: Headers | null } {
  // final constants
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);
  // polling related variables
  const [isErrored, setIsErrored] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const timerRef = useRef<number | null>(null);
  const [headers, setHeaders] = useState<Headers | null>(null);

  const fetchData = useCallback(async () => {
    if (!pollingOpts.enabled) {
        clearInterval(timerRef.current ?? undefined);
        return;
    }
    setLoading(true);
    const res = await fetch(url);
    const json = await res.json();
    if (res.ok) {
      if (!("status" in json)) {
        setData(json);
        setLoading(false);
        clearInterval(timerRef.current ?? undefined);
        setHeaders(res.headers);
        return;
      }
      if (json["status"] === "SUCCESS") {
        setDataLoaded(true);
        clearInterval(timerRef.current ?? undefined);
      } else if (json["status"] === "FAILURE") {
        setIsErrored(true);
        setDataLoaded(true);
        clearInterval(timerRef.current ?? undefined);
      }
      console.log(json);
    } else {
      setError(new Error(json));
    }
    setLoading(false);
  }, [url]);

  useEffect(() => {
    if (dataLoaded && !isErrored) {
      fetchData();
    }
  }, [dataLoaded, isErrored]);

  useEffect(() => {
    if (!dataLoaded) {
      const interval = setInterval(fetchData, delay_msec);
      timerRef.current = interval;
    }
    return () => {
      clearInterval(timerRef.current ?? undefined);
    };
  }, [url, delay_msec]);

  const resetData = () => {
    setData(null);
  }

  return { loading, data, error, resetData, headers };
}
