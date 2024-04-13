import "./App.css";
import useCompetencySearch from "./hooks/useCompetencySearch";

function App() {
  const { competencies, loading, lastCompetencyElement } = useCompetencySearch({
    pageSize: 40,
    categoryId: "d7d70f47-63a6-4b21-a4cc-8c9822083413",
  });

  return (
    <>
      {competencies.map((competency: any, index: number) => {
        // capture the last competency and pass ref to it
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
