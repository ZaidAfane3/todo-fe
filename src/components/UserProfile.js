import React from 'react';

const UserProfile = ({ user }) => {
  if (!user) return null;

  const getInitials = (username) => {
    return username.charAt(0).toUpperCase();
  };

  return (
    <div className="flex items-center space-x-3">
      <div className="flex-shrink-0">
        <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
          <span className="text-sm font-medium text-white">
            {getInitials(user.username)}
          </span>
        </div>
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-gray-900 truncate">
          {user.username}
        </p>
        <p className="text-xs text-gray-500 truncate">
          ID: {user.id}
        </p>
      </div>
    </div>
  );
};

export default UserProfile;
