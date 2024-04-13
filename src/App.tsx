import { useCallback, useRef, useState } from "react";
import "./App.css";
import useCompetencySearch from "./hooks/useCompetencySearch";

function App() {
  const [pageNumber, setPageNumber] = useState(1);
  const { competencies, hasMore, loading } = useCompetencySearch({
    pageNumber,
    pageSize: 40,
    categoryId: "d7d70f47",
  });

  const observer = useRef<IntersectionObserver | null>();
  const lastCompetencyElement = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((enteries) => {
        if (enteries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber: number) => prevPageNumber + 1);
          console.log("visible");
        }
      });
      if (node) observer.current.observe(node);
    },
    [hasMore, loading]
  );

  return (
    <>
      {competencies.map((competency: any, index: number) => {
        if (competencies.length === index + 1) {
          return (
            <p key={competency.id} ref={lastCompetencyElement as any}>
              {competency.name}
            </p>
          );
        } else {
          return <p key={competency.id}>{competency.name}</p>;
        }
      })}
    </>
  );
}

export default App;
