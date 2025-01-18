import { useEffect, useState, useRef } from 'react';
export default function useStream<T = string>(url:string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [errorObject, setErrorObject] = useState<Error | null>(null);
    const text = useRef("");
  
    useEffect(() => {
        const controller = new AbortController();
        const run = async (controller:AbortController) => {   
          setLoading(true)
          let response
          try {
      
            response = await fetch(url, {
                method: 'GET',
                signal: controller.signal,
            })
            
          } catch (error) {
            if ((error as Error).name === "AbortError") {
              return;
            }
            setErrorObject(error as Error)
          }
          setLoading(false);
          const reader = response!.body!.getReader();
          const chunks = [];
          let done, value;
          const dec = new TextDecoder()
      
          while (!done) {
            ({ value, done } = await reader.read());
            if (done) {
              return chunks;
            }
            const strval = dec.decode(value, { stream: true })
            console.log(chunks, strval, text.current)
            chunks.push(strval);
            text.current += strval
            setData(text.current as T)      
          }
        }
        run(controller)
        return () => controller.abort();

    }, [url]);
  
    return { data, loading, error: errorObject};
}