import { useEffect, useState } from "react";

export default function useCompetencySearch({
  pageNumber,
  pageSize,
  categoryId,
}: {
  pageNumber: number;
  pageSize: number;
  categoryId: string;
}) {
  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([] as any);
  const [hasMore, setHasMore] = useState(false); // prevent from makeing api request when reaching at the end of the data

  const fetchCompetencyCategory = async () => {
    setLoading(true);
    const res = await fetch(`endpoint`, {
      headers: {
        Authorization: "",
      },
    });

    const data = await res.json();
    setCompetencies((prev: any) => {
      return [...new Set([...prev, ...data])]; // combine old competencies with new competencies and convert it to a set for unique values
    });
    setHasMore(data.length > 0);
    setLoading(false);
  };

  useEffect(() => {
    fetchCompetencyCategory();
  }, [pageNumber, pageSize, categoryId]);

  return { loading, competencies, hasMore };
}
