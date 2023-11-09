import { getQueue } from '../api/services/queue.service';
import QueueItem from './QueueItem';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';
import moment from 'moment';

const Queue = () => {
  const queryClient = useQueryClient();
  const queue = useQuery({
    queryKey: ['queue'],
    queryFn: getQueue,
    refetchInterval: 1000 * 60,
  });

  const { isSuccess } = queue;

  useEffect(() => {
    if (isSuccess) {
      queryClient.setQueryData(['queue'], queue.data);
    }
  }, [isSuccess, queue.data, queryClient]);

  return (
    <div className="p-5 mr-0 bg-gray-100">
      <h1 className="mb-2 text-xl">Your queue</h1>

      <div className="hidden overflow-auto rounded-lg shadow md:block">
        <table className="w-full">
          <thead className="border-b-2 border-gray-200 bg-gray-50">
            <tr>
              <th className="w-20 p-3 text-sm font-semibold tracking-wide text-left">
                Id
              </th>
              <th className="p-3 text-sm font-semibold tracking-wide text-left">
                Name
              </th>
              <th className="w-24 p-3 text-sm font-semibold tracking-wide text-left">
                Added at
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {queue.data?.actions?.map((item) => (
              <QueueItem key={item.actionId} item={item} />
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:hidden">
        {queue.data?.actions?.map((item) => (
          <div className="p-4 space-y-3 bg-white rounded-lg shadow">
            <div className="flex items-center space-x-2 text-sm">
              <div>
                <a href="#" className="font-bold text-blue-500 hover:underline">
                  Action with id: {item.actionId}
                </a>
              </div>
            </div>
            <div className="text-sm text-gray-700">{item.name}</div>
            <div className="text-sm font-medium text-black">
              Added at: {moment(item.addedAt).format('DD/MM/YYYY HH:mm:ss')}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Queue;
