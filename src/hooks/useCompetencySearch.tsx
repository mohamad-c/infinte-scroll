import { useCallback, useEffect, useRef, useState } from "react";

export default function useCompetencySearch({
  pageSize,
  categoryId,
}: {
  pageSize: number;
  categoryId?: string;
}) {
  const [loading, setLoading] = useState(true);
  const [competencies, setCompetencies] = useState([] as any);
  const [hasMore, setHasMore] = useState(false); // prevent from making api requests when reaching at the end of the data
  const [pageNumber, setPageNumber] = useState(1);

  const fetchCompetencyCategory = async () => {
    setLoading(true);
    const res = await fetch(
      `https://ok.todaydev.ir/recruit/api/v1/competency-categories/${categoryId}/competencies?pageNumber=${pageNumber}&pageSize=${pageSize}`,
      {
        headers: {
          Authorization: "",
        },
      }
    );

    const data = await res.json();
    setCompetencies((prev: any) => {
      return [...new Set([...prev, ...data])]; // combine old competencies with new competencies and convert it to a set for unique values
    });
    setHasMore(data.length > 0);
    setLoading(false);
  };

  const observer = useRef<IntersectionObserver | null>(); // define a ref as intersection observer

  // set intersection observer
  const lastCompetencyElement = useCallback(
    (node: any) => {
      if (loading) return;
      if (observer.current) observer.current.disconnect(); // disconnect observer from last element
      observer.current = new IntersectionObserver((enteries) => {
        // observer confitions for the element
        if (enteries[0].isIntersecting && hasMore) {
          setPageNumber((prevPageNumber: number) => prevPageNumber + 1);
          console.log("visible");
        }
      });
      if (node) observer.current.observe(node); // observe a node if present
    },
    [hasMore, loading]
  );

  useEffect(() => {
    fetchCompetencyCategory();
  }, [pageNumber, pageSize, categoryId]);

  return { loading, competencies, hasMore, lastCompetencyElement, observer };
}
