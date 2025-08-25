import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useForm } from 'react-hook-form';
import {
  UserIcon,
  CameraIcon,
  EyeIcon,
  EyeSlashIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import { useAuth } from '@hooks/useAuth';
import { LoadingButton } from '@components/common/Spinner';
import toast from 'react-hot-toast';
import { authService } from '../services/authService';
import { userService } from '../services/userService';

function ProfilePage() {
  const { user, updateUser, loading } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);

  const {
    register: registerProfile,
    handleSubmit: handleProfileSubmit,
    formState: { errors: profileErrors },
  } = useForm({
    defaultValues: {
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      bio: user?.bio || '',
      location: user?.location || '',
      website: user?.website || '',
    },
  });

  const [preferences, setPreferences] = useState({
    orderupdates: true,
    promotions: true,
    newsletter: true,
    security: true,
  });

  const [isSMSActive, setIsSMSActive] = useState(false);

  const {
    register: registerPassword,
    handleSubmit: handlePasswordSubmit,
    formState: { errors: passwordErrors },
    reset: resetPasswordForm,
  } = useForm();

  const onProfileSubmit = async data => {
    try {
      console.log('formdata: ', data);
      const updatedUser = await userService.updateMe(data);
      // Update user in AuthContext
      updateUser(updatedUser);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error(error.message || 'Failed to update profile');
    }
  };

  const onPasswordSubmit = async data => {
    try {
      console.log(data);
      // Password change logic would go here
      await authService.updatePassword(data);
      toast.success('Password changed successfully!');
      resetPasswordForm();
    } catch (error) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  const handleAvatarChange = event => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
        toast.error('File size must be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = e => {
        setAvatarPreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSMSActivation = () => {
    setIsSMSActive(prev => !prev);

    isSMSActive
      ? toast.success(
          'SMS Authentication disabled, you will no longer receive messages...😑',
        )
      : toast.success(
          `SMS Authentication enabled, you still not receive any messages...😜`,
        );
  };

  const handleSavePreferences = () => {
    toast.success('Preferences saved, but not really...😜');
  };

  const tabs = [
    { id: 'profile', name: 'Profile Information', icon: UserIcon },
    { id: 'security', name: 'Security', icon: CheckCircleIcon },
    { id: 'preferences', name: 'Preferences', icon: CheckCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container-custom py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              My Profile
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your account settings and preferences
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="md:col-span-1">
              <div className="card p-6">
                {/* Avatar */}
                <div className="text-center mb-6">
                  <div className="relative inline-block">
                    <img
                      src={
                        avatarPreview ||
                        user?.avatar ||
                        '/placeholder-avatar.svg'
                      }
                      alt={user?.name}
                      className="w-24 h-24 rounded-full object-cover border-4 border-primary-600  shadow-lg dark:bg-white"
                    />
                    <label className="absolute bottom-0 right-0 bg-primary-600 text-white p-2 rounded-full cursor-pointer hover:bg-primary-700 transition-colors">
                      <CameraIcon className="w-4 h-4" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-4">
                    {user?.name}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {user?.email}
                  </p>
                </div>

                {/* Navigation */}
                <nav className="space-y-2">
                  {tabs.map(tab => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-left transition-colors ${
                        activeTab === tab.id
                          ? 'bg-primary-100 dark:bg-primary-900/20 text-primary-700 dark:text-primary-300'
                          : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
                      }`}
                    >
                      <tab.icon className="w-5 h-5" />
                      <span className="font-medium">{tab.name}</span>
                    </button>
                  ))}
                </nav>
              </div>
            </div>

            {/* Main Content */}
            <div className="md:col-span-3">
              {/* Profile Information Tab */}
              {activeTab === 'profile' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Profile Information
                  </h2>

                  <form
                    onSubmit={handleProfileSubmit(onProfileSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Full Name *
                        </label>
                        <input
                          type="text"
                          {...registerProfile('name', {
                            required: 'Name is required',
                          })}
                          className={`input ${profileErrors.name ? 'input-error' : ''}`}
                          placeholder="Enter your full name"
                        />
                        {profileErrors.name && (
                          <p className="mt-1 text-sm text-red-600">
                            {profileErrors.name.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Email Address *
                        </label>
                        <input
                          type="email"
                          {...registerProfile('email', {
                            required: 'Email is required',
                            pattern: {
                              value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                              message: 'Invalid email address',
                            },
                          })}
                          className={`input ${profileErrors.email ? 'input-error' : ''}`}
                          placeholder="Enter your email"
                        />
                        {profileErrors.email && (
                          <p className="mt-1 text-sm text-red-600">
                            {profileErrors.email.message}
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Phone Number
                        </label>
                        <input
                          type="tel"
                          {...registerProfile('phone')}
                          className="input"
                          placeholder="(555) 123-4567"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Location
                        </label>
                        <input
                          type="text"
                          {...registerProfile('location')}
                          className="input"
                          placeholder="City, Country"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Website
                      </label>
                      <input
                        type="url"
                        {...registerProfile('website')}
                        className="input"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Bio
                      </label>
                      <textarea
                        {...registerProfile('bio')}
                        rows="4"
                        className="input resize-none"
                        placeholder="Tell us a little about yourself..."
                      />
                    </div>

                    <LoadingButton
                      type="submit"
                      loading={loading}
                      className="btn-primary"
                    >
                      Update Profile
                    </LoadingButton>
                  </form>
                </motion.div>
              )}

              {/* Security Tab */}
              {activeTab === 'security' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Change Password */}
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Change Password
                    </h2>

                    <form
                      onSubmit={handlePasswordSubmit(onPasswordSubmit)}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Current Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showCurrentPassword ? 'text' : 'password'}
                            {...registerPassword('currentPassword', {
                              required: 'Current password is required',
                            })}
                            className={`input pr-12 ${passwordErrors.currentPassword ? 'input-error' : ''}`}
                            placeholder="Enter current password"
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showCurrentPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.currentPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {passwordErrors.currentPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          New Password *
                        </label>
                        <div className="relative">
                          <input
                            type={showNewPassword ? 'text' : 'password'}
                            {...registerPassword('newPassword', {
                              required: 'New password is required',
                              minLength: {
                                value: 6,
                                message:
                                  'Password must be at least 6 characters',
                              },
                            })}
                            className={`input pr-12 ${passwordErrors.newPassword ? 'input-error' : ''}`}
                            placeholder="Enter new password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                          >
                            {showNewPassword ? (
                              <EyeSlashIcon className="w-5 h-5" />
                            ) : (
                              <EyeIcon className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                        {passwordErrors.newPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {passwordErrors.newPassword.message}
                          </p>
                        )}
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          Confirm New Password *
                        </label>
                        <input
                          type="password"
                          {...registerPassword('confirmPassword', {
                            required: 'Please confirm your password',
                            validate: (value, { newPassword }) =>
                              value === newPassword || 'Passwords do not match',
                          })}
                          className={`input ${passwordErrors.confirmPassword ? 'input-error' : ''}`}
                          placeholder="Confirm new password"
                        />
                        {passwordErrors.confirmPassword && (
                          <p className="mt-1 text-sm text-red-600">
                            {passwordErrors.confirmPassword.message}
                          </p>
                        )}
                      </div>

                      <LoadingButton
                        type="submit"
                        loading={loading}
                        className="btn-primary"
                      >
                        Change Password
                      </LoadingButton>
                    </form>
                  </div>

                  {/* Two-Factor Authentication */}
                  <div className="card p-6">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                      Two-Factor Authentication
                    </h2>
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900 dark:text-white">
                          SMS Authentication
                        </h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button
                        className={isSMSActive ? `btn-danger` : `btn-outline`}
                        onClick={handleSMSActivation}
                      >
                        {isSMSActive ? 'Disable' : 'Enable'}
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* Preferences Tab */}
              {activeTab === 'preferences' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="card p-6"
                >
                  <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
                    Preferences
                  </h2>

                  <div className="space-y-6">
                    {/* Email Notifications */}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Email Notifications
                      </h3>
                      <div className="space-y-4">
                        {[
                          {
                            id: 'order-updates',
                            label: 'Order updates',
                            description:
                              'Get notified about order status changes',
                          },
                          {
                            id: 'promotions',
                            label: 'Promotions & offers',
                            description:
                              'Receive promotional emails and special offers',
                          },
                          {
                            id: 'newsletter',
                            label: 'Newsletter',
                            description:
                              'Weekly newsletter with new products and tips',
                          },
                          {
                            id: 'security',
                            label: 'Security alerts',
                            description: 'Important security notifications',
                          },
                        ].map(item => (
                          <div
                            key={item.id}
                            className="flex items-center justify-between"
                          >
                            <div>
                              <h4 className="font-medium text-gray-900 dark:text-white">
                                {item.label}
                              </h4>
                              <p className="text-sm text-gray-500 dark:text-gray-400">
                                {item.description}
                              </p>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                className="sr-only peer"
                                checked={preferences[item.id.replace('-', '')]}
                                onChange={() =>
                                  setPreferences(prev => {
                                    const key = item.id.replace('-', '');
                                    return {
                                      ...prev,
                                      [key]: !prev[key],
                                    };
                                  })
                                }
                              />
                              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 dark:peer-focus:ring-primary-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary-600"></div>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Privacy Settings */}
                    <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                      <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">
                        Privacy Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h4 className="font-medium text-gray-900 dark:text-white">
                              Profile Visibility
                            </h4>
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                              Make your profile visible to other users
                            </p>
                          </div>
                          <select className="input w-32">
                            <option value="public">Public</option>
                            <option value="private">Private</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    <button
                      className="btn-primary"
                      onClick={handleSavePreferences}
                    >
                      Save Preferences
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default ProfilePage;
