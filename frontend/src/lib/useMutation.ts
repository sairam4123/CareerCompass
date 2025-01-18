import { useState } from "react";

type Status = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";

export default function useMutation<TResult, TBody>({
  url,
  method,
  onSuccess,
  onFailure,
}: {
  url: string;
  method: "POST" | "PUT" | "DELETE";
  onSuccess?: (data: TResult) => void;
  onFailure?: (error: unknown) => void;
}) {
  const [result, setResult] = useState< TResult | null >(null);
  const [error, setError] = useState<Error | null>(null);
  const [status, setStatus] = useState<Status>("IDLE");
  const mutate = async (body: TBody) => {
    setStatus("LOADING");
    console.log(JSON.stringify(body))
    try {
      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      console.log("Data received: ", data);
      console.log("Data set: ", data, "response OK?", response.ok);
      if (response.ok) {
        setStatus("SUCCESS");
        onSuccess?.(data);
        setResult(data);
      } else {
        setStatus("FAILURE");
        setError(data);
        onFailure?.(data);
      }
    } catch (error) {
      setStatus("FAILURE");
      setError(error as Error);
      onFailure?.(error);
    }
  };
  return { result, error, status, mutate };
}
