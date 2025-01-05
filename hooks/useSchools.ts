import { useState, useEffect } from 'react';

interface University {
  name: string;
  country: string;
  web_pages: string[];
  domains: string[];
  alpha_two_code: string;
}

export const useSchools = () => {
  const [schools, setSchools] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSchools = async () => {
      try {
        const response = await fetch('http://universities.hipolabs.com/search?country=United+States');
        if (!response.ok) {
          throw new Error('Failed to fetch universities');
        }
        const data = await response.json();
        setSchools(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchSchools();
  }, []);

  return { schools, loading, error };
};
