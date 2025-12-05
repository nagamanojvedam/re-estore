import {
  CheckCircleIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  HeartIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import toast from 'react-hot-toast';

const UserCard = ({ user, page }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const queryClient = useQueryClient();

  const { mutate: toggleUserMutation } = useMutation({
    mutationFn: userService.toggleUserActive,
    onSuccess: (data) => {
      queryClient.invalidateQueries(['adminUsers', page]);
      toast.success(`User ${data.user.isActive ? 'Activated 🙂' : 'Deactivated 🙁'}`);
    },
  });

  const formatDate = (dateString) =>
    new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

  const getAccountStatus = (user) => {
    if (!user.isActive)
      return {
        text: 'Deactivated',
        color: 'bg-red-100 text-red-800',
        icon: XCircleIcon,
      };
    if (!user.isEmailVerified)
      return {
        text: 'Unverified',
        color: 'bg-yellow-100 text-yellow-800',
        icon: XCircleIcon,
      };
    return {
      text: 'Active & Verified',
      color: 'bg-green-100 text-green-800',
      icon: CheckCircleIcon,
    };
  };

  const getUserInitials = (name) =>
    name
      .split(' ')
      .map((n) => n.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const getTimeSinceJoined = (dateString) => {
    const joinDate = new Date(dateString);
    const now = new Date();
    const diffDays = Math.ceil(Math.abs(now - joinDate) / (1000 * 60 * 60 * 24));
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    if (diffDays < 30)
      return `${Math.floor(diffDays / 7)} week${Math.floor(diffDays / 7) !== 1 ? 's' : ''} ago`;
    if (diffDays < 365)
      return `${Math.floor(diffDays / 30)} month${Math.floor(diffDays / 30) !== 1 ? 's' : ''} ago`;
    return `${Math.floor(diffDays / 365)} year${Math.floor(diffDays / 365) !== 1 ? 's' : ''} ago`;
  };

  const accountStatus = getAccountStatus(user);
  const StatusIcon = accountStatus.icon;

  return (
    <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md dark:border-gray-700 dark:bg-gray-800 dark:hover:shadow-gray-900/25">
      {/* Main Details */}
      <div className="space-y-4">
        <div className="flex space-x-4">
          {/* Avatar */}
          <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-blue-500 text-lg font-semibold text-white dark:bg-blue-600">
            {getUserInitials(user.name)}
          </div>

          {/* Basic Info */}
          <div className="flex-1 space-y-2">
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{user.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-300">{user.email}</p>
                <p className="text-xs capitalize text-gray-500 dark:text-gray-400">
                  {user.role} • Joined {getTimeSinceJoined(user.createdAt)}
                </p>
              </div>
              <span
                className={`flex items-center space-x-1 rounded-full px-2 py-1 text-xs font-medium ${accountStatus.color}`}
              >
                <StatusIcon className="h-3 w-3" />
                <span>{accountStatus.text}</span>
              </span>
            </div>

            {/* Indicators */}
            <div className="flex flex-wrap gap-x-4 text-sm">
              <div className="flex items-center space-x-1">
                <span className="text-gray-600 dark:text-gray-400">Email:</span>
                <span
                  className={`font-medium ${user.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {user.isEmailVerified ? 'Verified' : 'Unverified'}
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <span className="text-gray-600 dark:text-gray-400">Status:</span>
                <span
                  className={`font-medium ${user.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {user.isActive ? 'Active' : 'Inactive'}
                </span>
              </div>
              {user.wishlist?.length > 0 && (
                <div className="flex items-center space-x-1">
                  <HeartIcon className="h-3 w-3 text-pink-500 dark:text-pink-400" />
                  <span className="font-medium text-pink-600 dark:text-pink-400">
                    {user.wishlist.length}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            <span>{isExpanded ? 'Show less details' : 'Show more details'}</span>
            {isExpanded ? (
              <ChevronUpIcon className="h-4 w-4" />
            ) : (
              <ChevronDownIcon className="h-4 w-4" />
            )}
          </button>

          <button
            onClick={() => toggleUserMutation({ id: user._id, isUserActive: user.isActive })}
            className={`rounded-lg px-4 py-2 font-medium text-white transition-colors ${
              user.isActive
                ? 'bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700'
                : 'bg-green-500 hover:bg-green-600 dark:bg-green-600 dark:hover:bg-green-700'
            }`}
          >
            {user.isActive ? 'Deactivate' : 'Activate'}
          </button>
        </div>
      </div>

      {/* Expanded Details */}
      {isExpanded && (
        <div className="mt-5 space-y-5 rounded-lg border-t border-gray-200 bg-gray-50 p-4 pt-5 dark:border-gray-700 dark:bg-gray-700/50">
          {/* Account Info */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
              Account Information
            </h4>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600 dark:text-gray-400">User ID:</span>{' '}
                  <span className="font-mono text-xs text-gray-800 dark:text-gray-300">
                    {user._id}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Role:</span>{' '}
                  <span className="font-medium capitalize text-gray-800 dark:text-gray-200">
                    {user.role}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Version:</span>{' '}
                  <span className="font-medium text-gray-800 dark:text-gray-200">v{user.__v}</span>
                </p>
              </div>
              <div className="space-y-2">
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Account Status:</span>{' '}
                  <span
                    className={`${user.isActive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'} font-medium`}
                  >
                    {user.isActive ? 'Active' : 'Deactivated'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Email Status:</span>{' '}
                  <span
                    className={`${user.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-orange-600 dark:text-orange-400'} font-medium`}
                  >
                    {user.isEmailVerified ? 'Verified' : 'Pending'}
                  </span>
                </p>
                <p>
                  <span className="text-gray-600 dark:text-gray-400">Wishlist Items:</span>{' '}
                  <span className="font-medium text-gray-800 dark:text-gray-200">
                    {user.wishlist?.length || 0}
                  </span>
                </p>
              </div>
            </div>
          </div>

          {/* Wishlist */}
          {user.wishlist?.length > 0 && (
            <div>
              <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">
                Wishlist ({user.wishlist.length} items)
              </h4>
              <div className="max-h-32 space-y-2 overflow-y-auto pr-2">
                {user.wishlist.map((item) => (
                  <div
                    key={item._id}
                    className="flex items-center justify-between rounded-lg border border-gray-200 bg-white px-3 py-2 text-sm shadow-sm dark:border-gray-500 dark:bg-gray-600"
                  >
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">
                        Product ID: {item.productId}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Added: {formatDate(item.addedAt)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Timeline */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Account Timeline</h4>
            <div className="space-y-1 text-sm">
              <p>
                <span className="text-gray-600 dark:text-gray-400">Created:</span>{' '}
                <span className="text-gray-800 dark:text-gray-200">
                  {formatDate(user.createdAt)}
                </span>
              </p>
              <p>
                <span className="text-gray-600 dark:text-gray-400">Last Updated:</span>{' '}
                <span className="text-gray-800 dark:text-gray-200">
                  {formatDate(user.updatedAt)}
                </span>
              </p>
              <p>
                <span className="text-gray-600 dark:text-gray-400">Member for:</span>{' '}
                <span className="text-gray-800 dark:text-gray-200">
                  {getTimeSinceJoined(user.createdAt)}
                </span>
              </p>
            </div>
          </div>

          {/* Quick Stats */}
          <div>
            <h4 className="mb-3 font-semibold text-gray-900 dark:text-white">Quick Stats</h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div className="rounded-lg bg-blue-50 p-3 shadow-sm dark:bg-blue-900/20">
                <p className="text-xl font-bold text-blue-600 dark:text-blue-400">
                  {user.wishlist?.length || 0}
                </p>
                <p className="text-xs text-blue-800 dark:text-blue-300">Wishlist Items</p>
              </div>
              <div className="rounded-lg bg-green-50 p-3 shadow-sm dark:bg-green-900/20">
                <p className="text-xl font-bold text-green-600 dark:text-green-400">{user.__v}</p>
                <p className="text-xs text-green-800 dark:text-green-300">Profile Updates</p>
              </div>
              <div
                className={`${user.isEmailVerified ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'} rounded-lg p-3 shadow-sm`}
              >
                <p
                  className={`text-xl font-bold ${user.isEmailVerified ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}
                >
                  {user.isEmailVerified ? '✓' : '✗'}
                </p>
                <p
                  className={`text-xs ${user.isEmailVerified ? 'text-green-800 dark:text-green-300' : 'text-red-800 dark:text-red-300'}`}
                >
                  Email Status
                </p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserCard;
