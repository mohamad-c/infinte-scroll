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
          Authorization:
            "Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6IjZCOTg1RjhDQ0EwRDAzQTY2MkExNjJBODk2MUVGN0RFIiwidHlwIjoiYXQrand0In0.eyJpc3MiOiJodHRwOi8vdG9kYXlkZXYuaXIiLCJuYmYiOjE3MTMwMDI1ODQsImlhdCI6MTcxMzAwMjU4NCwiZXhwIjoxNzEzMDA2MTg0LCJhdWQiOiJ0b2RheV9yZWNydWl0X3Jlc291cmNlIiwic2NvcGUiOlsib3BlbmlkIiwicHJvZmlsZSIsInRvZGF5X3JlY3J1aXRfc2NvcGUiXSwiYW1yIjpbInB3ZCJdLCJjbGllbnRfaWQiOiJ0b2RheV9yZWNydWl0X2NsaWVudCIsInN1YiI6IjIzNmVhNGExLWY0NDUtNDgzZS1hZjJiLWI4NGMzZDNmY2U1ZSIsImF1dGhfdGltZSI6MTcxMjk4NDM3MCwiaWRwIjoibG9jYWwiLCJlbWFpbCI6ImFkbWluQHRvZGF5LmNvbSIsIkFzcE5ldC5JZGVudGl0eS5TZWN1cml0eVN0YW1wIjoiZTgyZGZiYTYtMzlkNC00ZGY5LTkxMTQtOWNiNGE2YjFjZjQ5IiwicHJlZmVycmVkX3VzZXJuYW1lIjoiYWRtaW5AdG9kYXkuY29tIiwibmFtZSI6ImFkbWluQHRvZGF5LmNvbSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwicGhvbmVfbnVtYmVyIjoiMTExMTExMTExMSIsInBob25lX251bWJlcl92ZXJpZmllZCI6ZmFsc2UsImZhbWlseV9uYW1lIjoiQWRtaW4iLCJnaXZlbl9uYW1lIjoiQWRtaW4iLCJjdWx0dXJlIjoiIiwidGVuYW50X2lkIjoiMSIsInRlbmFudF9uYW1lIjoiVG9kYXkiLCJzaWQiOiIyREY1Nzg5NDFBOUY1MUQ5MDBFN0Q5NDM4MTc0NEM4NCIsImp0aSI6IjAzM0NEMjJGRERFODY0RjlBN0M5RTkzRkMxRDAyODZDIn0.ApImllKy4D9qgocvvOv52CrIUZ9sp5oP76WeoXvb1QErbKcKQ-CY3qR6dMwrVtmKIZxf_MCcWP0GA--EeIvD4g-nbRyakEzrPevTBbzWAo-8VcgStQv116VYtQDVkoIon7bNBvdPwACZiJio1YY8k55Y33KndEldU-XxlEN7fg6uPSoAEWJ7H8pLQ2q6iCe9uLAXRYweaX-G6Bxh15yIYgX42q22xmL7VPaHvQDeXyatE4jUJ5_kzL-9gQFGBgtivsbJtYF8kiXqYmIo6nNEPSiiWThL9Lk2On_D45t-ji7JA7jNwC8YO234PnjhCF7Vx0lIatzxzySzHXsqKgcEkw",
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
