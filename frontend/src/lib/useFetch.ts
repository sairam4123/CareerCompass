import { useCallback, useEffect, useState } from "react";

type FetchOpts = {
    enabled: boolean;
}

export default function useFetch<T>(url: string, opts: FetchOpts = {enabled: true}): {loading: boolean, data: T | null, error: Error | null, resetData: () => void} {
   const [loading, setLoading] = useState(false);
   const [data, setData] = useState<T | null>(null);
   const [error, setError] = useState<Error | null>(null);

   const fetchData = useCallback(async () => {
    setLoading(true)
    const res = await fetch(url)
    const json = await res.json()
    if (res.ok) {
      setData(json)
    } else {
      setError(new Error(json))
    }
    setLoading(false)
   }, [url]);

   useEffect(() => {
    if (opts.enabled) {
        fetchData();
    }
   }, [url, fetchData, opts.enabled])

   const resetData = () => {
    setData(null)
   }

    return {loading, data, error, resetData}
} 