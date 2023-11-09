import { getUserActions } from '../api/services/user.service';
import UserActionsItem from './UserActionsItem';
import { useQuery } from '@tanstack/react-query';

const UserActions = () => {
  const userActions = useQuery({
    queryKey: ['userActions'],
    queryFn: getUserActions,
  });

  return (
    <div className="w-full p-5 mt-0 mr-0 bg-white border border-gray-200 shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
      <div className="flex items-center justify-between mb-4">
        <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
          Your actions
        </h5>
      </div>
      <div className="flow-root">
        <ul
          role="list"
          className="divide-y divide-gray-200 dark:divide-gray-700"
        >
          {userActions.data?.map((userAction) => (
            <UserActionsItem key={userAction?.actionId} item={userAction} />
          ))}
        </ul>
      </div>
    </div>
  );
};
export default UserActions;
