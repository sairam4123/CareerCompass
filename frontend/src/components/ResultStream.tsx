import { useState, useEffect } from "react";
import { ResultType } from "../@types/Result";
import CircularProgress from "./CircularProgress";
import { MdFileCopy, MdCancel, MdCheckCircle, MdRecommend } from "react-icons/md";
import useWindowSize from "../lib/useWindowSize";
import { api } from "../lib/api";
import useFetch from "../lib/useFetch";
import { toast } from "react-toastify";
import Spinner from "./Spinner";

const ResultsStream = ({ userId }: {userId: string}) => {
  const [results, setResults] = useState<ResultType[]>([]);
  const [isStreaming, setIsStreaming] = useState<boolean>(true);
  const [isLoadingStream, setIsLoadingStream] = useState<boolean>(false);
  useEffect(() => {
    const eventSource = new EventSource(`${api}/results/${userId}/stream`);
    eventSource.onopen = () => {
        console.log("Event source opened.")
        toast.warn("[FLICKER WARNING] Streaming results.. please look away if you have epilepsy.")
        setIsStreaming(true);
        setIsLoadingStream(true);
    }
    eventSource.onmessage = (event) => {
      console.log(event, "Event source message.")
      setIsLoadingStream(false);
      try {
        const newResults = JSON.parse(event.data) as ResultType[];

        setResults((prevResults) => {
          const resultsMap = new Map(prevResults.map((res) => [res.id, res]));
          newResults.forEach((newRes) => {
            if (resultsMap.has(newRes.id)) {
              resultsMap.set(newRes.id, { ...resultsMap.get(newRes.id), ...newRes });
            } else {
              resultsMap.set(newRes.id, newRes);
            }
          });

          return Array.from(resultsMap.values());
        });
      } catch (error) {
        console.error("Error parsing stream data:", error);
        eventSource.close();
        setIsStreaming(false);
        toast.error("Error parsing stream data. Please try again later.");
      }
    };

    eventSource.onerror = (e) => {
      console.error("Error with event stream.");
      console.log(e)
      if (e.eventPhase !== EventSource.CLOSED) {
        toast.error("Error with event stream. Please try again later.");
      }
      eventSource.close();
        setIsStreaming(false);
    };

    return () => eventSource.close();
  }, [userId]);

    const {data: loadedResults, error, loading} = useFetch<{ results: ResultType[] }>(`${api}/results/${userId}/stream`, { enabled: !!userId && !isStreaming });

    useEffect(() => {
        if (loadedResults && !loading && !error && !isStreaming && userId) {
        setResults(loadedResults.results);
        }
    }, [userId, isStreaming, loadedResults, loading, error])


  
    const bigInMiddle = (list: ResultType[]) => {
      return list.map((v) => ({ ...v }))
        .sort((a, b) => {
          return a.points - b.points;
        })
        .map((v, i, a) => {
          const p = ~~(a.length / 2);
          return i >= p ? a[a.length - i + p - 1] : v;
        })
        .reverse();
    };
    const { width: viewportWidth} = useWindowSize();
  
  return (
    <div className="grid sm:grid-cols-1 mt-8 md:grid-cols-2 lg:grid-cols-3 md:flex-row gap-4 md:gap-4">
      {isLoadingStream && <div className="flex flex-col items-center justify-center gap-2"><Spinner color="normal" size="large" /><p className="text-center">Our mascots are at work figuring your career for you!</p></div>}
      {(viewportWidth > 1024 ? bigInMiddle(results) : results).map((result) => (
        <ResultSection index={results.findIndex(v => v.id === result.id)} key={result.id} {...result} />
      ))}
    </div>
  );
};

function ResultSection({
    result,
    description,
    points,
    advantages,
    disadvantages,
    match_description,
    tags,
    index,
    match
  }: {
    result: string;
    description: string;
    points: number;
    advantages: string[];
    disadvantages: string[];
    match_description: string;
    tags: string[];
    index: number;
    match: string[];
  }) {
    console.log(index)
    const copyToClipboard = () => {
      navigator.clipboard.writeText(JSON.stringify({ result, description, points, advantages, disadvantages, match_description }));
    }
    return (
      <section className="relative select-none group grid mx-2 border bg-gradient-to-b from-white via-zinc-100 hover:shadow-xl hover:shadow-black/50 to-zinc-50 hover:scale-105 transition-all animate-flip-in duration-100 shadow-lg rounded-md py-3 px-3 mt-4 gap-6" style={{animationFillMode: "backwards", perspective: "1000px", transformStyle: "preserve-3d", animationDelay: `${Number(index * 0.5)}s`}}>
          <div onClick={() => {copyToClipboard()}} className="absolute cursor-pointer group-hover:opacity-100 hover:bg-extra-light/50 justify-center items-center text-xs opacity-0 top-0 flex gap-1 transition-all flex-row right-0 p-2 bg-extra-light rounded-bl-md rounded-tr-md text-gray-800">
              <MdFileCopy size={14} /> Copy
          </div>
        <div className="justify-center flex items-center my-7">
        <CircularProgress
          percentage={points}
          backgroundColor="#f0f0f0"
          color="#3E7B27"
          size={150}
        />
          </div>
        <div className="flex flex-col gap-2">
          <h1 className="font-bold select-text text-xl mb-1">{result}</h1>
          <p className="text-sm select-text text-gray-600 italic">{match_description}</p>
        </div>
        <div>
          <h3 className="font-bold text-lg">Role Description</h3>
          <p className="text-sm select-text text-gray-800">{description}</p>
        </div>
        <div className="">
          <h2 className="font-bold text-lg">Advantages</h2>
          <ul className="">
            {advantages.map((advantage, index) => (
              <li key={index} className="flex-row select-text flex items-center gap-2">
                <MdCheckCircle color="green" size={16} />
                {advantage}
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h2 className="font-bold text-lg">You match</h2>
          <ul className="">
            {match?.map((match, index) => (
              <li key={index} className="flex-row select-text text-gray-800 flex items-center gap-2">
                <MdRecommend color="blue" size={16} />
                {match}
              </li>
            ))}
          </ul>
        </div>
        <div className="">
          <h2 className="font-bold text-lg">Disadvantages</h2>
          <ul className="">
            {disadvantages.map((disadvantage, index) => (
              <li key={index} className="flex-row select-text text-gray-800 flex items-center gap-2">
                <MdCancel color="red"  size={16} />
                {disadvantage}
              </li>
            ))}
          </ul>
        </div>
        {tags ? <div className="flex flex-row gap-2 flex-wrap">
            {tags.map(tag => <p className="italic select-text h-fit bg-gray-200 p-2 px-3 rounded-full text-sm text-gray-500 whitespace-normal" key={tag}>{tag.toLowerCase()}</p>)}
        </div> : <div><p className="italic text-sm text-gray-500">No tags found.</p></div>}
      </section>
    );
  }
  

export default ResultsStream;
