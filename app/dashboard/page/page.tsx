'use client'
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type A = {
  id_a: string;
  var_a: string;
};

export default function Page() {
  const [As, setAs] = useState<A[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const {data: session} = useSession()

  useEffect(() => {
    fetch('/api/getData')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch data');
        }
        return response.json();
      })
      .then(({ results }) => {
        setAs(results);
        setLoading(false);
      })
      .catch(error => {
        setError(error.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <span>{session?.user?.name}</span>
      <ul>
        {As.map((a) => (
          <li key={a.id_a}>
            {a.id_a} - {a.var_a}
          </li>
        ))}
      </ul>
    </div>
  );
}
