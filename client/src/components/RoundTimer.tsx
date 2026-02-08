import { useEffect, useState } from "react";

type Props = {
  remainingMs: number;
};

export default function RoundTimer({ remainingMs }: Props) {
  const [displayMs, setDisplayMs] = useState(remainingMs);


  useEffect(() => {
    setDisplayMs(remainingMs);
  }, [remainingMs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayMs((prev) => Math.max(prev - 1000, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, []); 

  return (
    <div style={{ marginBottom: 12 }}>
      <strong>Time left:</strong> {Math.ceil(displayMs / 1000)}s
    </div>
  );
}
