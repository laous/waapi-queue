import { IQueueAction } from '../../types';
import moment from 'moment';

interface QueueItemProps {
  item: IQueueAction;
}

const QueueItem = ({ item }: QueueItemProps) => {
  return (
    <tr className="bg-white">
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        <a href="#" className="font-bold text-blue-500 hover:underline">
          {item.actionId}
        </a>
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        {item.name}
      </td>
      <td className="p-3 text-sm text-gray-700 whitespace-nowrap">
        <span className="p-1.5 text-xs font-medium uppercase tracking-wider text-green-800 bg-green-200 rounded-lg bg-opacity-50">
          {moment(item.addedAt).format('DD/MM/YYYY HH:mm:ss')}
        </span>
      </td>
    </tr>
  );
};
export default QueueItem;
