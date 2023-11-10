import { getExecutionTime } from '../../api/services/execution-time.service';
import { useQuery } from '@tanstack/react-query';
import Countdown from 'react-countdown';
import { useState, useEffect } from 'react';

const Footer = () => {
  const [nextExecutionTime, setNextExecutionTime] = useState<Date>();
  const query = useQuery({
    queryKey: ['execution-time'],
    queryFn: getExecutionTime,
    staleTime: 1000 * 60,
  });
  const { data, isSuccess } = query;

  useEffect(() => {
    if (isSuccess && data?.lastExecutionTime24Hours) {
      const lastExecutionTime = new Date(data?.lastExecutionTime24Hours);
      const nextTime = new Date(
        lastExecutionTime.getTime() + 24 * 60 * 60 * 1000
      );
      setNextExecutionTime(nextTime);
    }
  }, [isSuccess, data]);

  return (
    <footer className="fixed inset-x-0 bottom-0 bg-white shadow dark:bg-gray-900">
      <div className="w-full max-w-screen-xl p-4 mx-auto md:py-8">
        <span className="block text-sm text-gray-500 sm:text-center dark:text-gray-400">
          Next credit calculation in{' '}
          {nextExecutionTime && <Countdown date={nextExecutionTime} />}
        </span>
      </div>
    </footer>
  );
};
export default Footer;
