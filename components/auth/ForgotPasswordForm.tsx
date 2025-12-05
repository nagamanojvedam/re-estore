import { useForm } from 'react-hook-form';
import { LoadingButton } from '@/components/common/Spinner';
import toast from 'react-hot-toast';

function ForgotPasswordForm({ onSuccess }) {
  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    await authService.forgotPassword(data);
    toast.success('Password reset link sent to your email');
    onSuccess();
  };

  return (
    <div className="mx-auto w-full max-w-md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="mb-2 block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            Enter your email
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? 'input-error' : ''}`}
            placeholder="Enter your email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: 'Invalid email address',
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.email.message}</p>
          )}
        </div>

        {/* Submit Button */}
        <LoadingButton type="submit" className="btn-primary w-full" loading={false}>
          Send reset link
        </LoadingButton>
      </form>
    </div>
  );
}

export default ForgotPasswordForm;
