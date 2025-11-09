import React, { useEffect, useState } from 'react';

interface CountingNumberProps {
  number: number;
  fromNumber?: number;
  padStart?: boolean;
  decimalSeparator?: string;
  decimalPlaces?: number;
  delay?: number;
  className?: string;
}

export const CountingNumber: React.FC<CountingNumberProps> = ({
  number,
  fromNumber = 0,
  padStart = false,
  decimalSeparator = '.',
  decimalPlaces = 0,
  delay = 0,
  className = '',
}) => {
  const [currentNumber, setCurrentNumber] = useState(fromNumber);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 2000; // 2 seconds
      const steps = 60; // 60 FPS
      const increment = (number - fromNumber) / steps;
      let current = fromNumber;
      let step = 0;

      const timer = setInterval(() => {
        step++;
        current += increment;

        if (step >= steps) {
          setCurrentNumber(number);
          clearInterval(timer);
        } else {
          setCurrentNumber(Math.round(current));
        }
      }, duration / steps);

      return () => clearInterval(timer);
    }, delay);

    return () => clearTimeout(timeout);
  }, [number, fromNumber, delay]);

  const formatNumber = (num: number) => {
    if (decimalPlaces > 0) {
      return num.toFixed(decimalPlaces).replace('.', decimalSeparator);
    }
    return padStart ? num.toString().padStart(3, '0') : num.toString();
  };

  return (
    <span className={className}>
      {formatNumber(currentNumber)}
    </span>
  );
};
