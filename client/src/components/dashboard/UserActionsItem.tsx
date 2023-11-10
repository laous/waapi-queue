import { IUserAction } from '../../types';
import { AiOutlineAppstoreAdd } from 'react-icons/ai';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { addActionToQueue } from '../../api/services/queue.service';

interface UserActionsItemProps {
  item: IUserAction;
}

const UserActionsItem = ({ item }: UserActionsItemProps) => {
  const queryClient = useQueryClient();
  const mutation = useMutation({
    mutationKey: ['addToQueue'],
    mutationFn: addActionToQueue,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['queue'],
      });
    },
  });
  const handleAddToQueue = async () => {
    if (!item?.actionId) return console.log('No actionId');
    mutation.mutate(item?.actionId);
  };
  return (
    <li className="py-3 sm:py-4">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <AiOutlineAppstoreAdd
            onClick={handleAddToQueue}
            className="text-2xl text-white cursor-pointer"
          />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
            {item?.name}
          </p>
        </div>
        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
          ${item?.credit}
        </div>
      </div>
    </li>
  );
};
export default UserActionsItem;
