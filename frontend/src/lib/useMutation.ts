import { useState } from "react";

type Status = "IDLE" | "LOADING" | "SUCCESS" | "FAILURE";

export default function useMutation<TResult, TBody, TError = unknown>({
  url,
  method,
  onSuccess,
  onFailure,
}: {
  url: string;
  method: "POST" | "PUT" | "DELETE";
  onSuccess?: (data: TResult) => void;
  onFailure?: (error: TError) => void;
}) {
  const [result, setResult] = useState< TResult | null >(null);
  const [error, setError] = useState<TError | null>(null);
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
        if ("success" in data && !data.success) {
          throw new Error(data.message)
        }
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
      setError(error as TError);
      onFailure?.(error as TError);
    }
  };
  return { result, error, status, mutate };
}
