"use client";

import { LoadingButton } from "@/components/common/Spinner";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useAuth } from "@/lib/hooks/useAuth";
import { useState } from "react";
import { useForm } from "react-hook-form";
import Link from "next/link";

function RegisterForm({ onSuccess, onSwitchToLogin }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register: registerUser, loading, error, clearError } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
    setError,
  } = useForm({
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      agreeToTerms: false,
    },
  });

  const password = watch("password");

  const passwordStrength = (pwd) => {
    if (pwd.length < 8) return 0;

    let strength = 0;
    if (pwd.length >= 8) strength += 1;
    if (/[A-Z]/.test(pwd)) strength += 1;
    if (/[a-z]/.test(pwd)) strength += 1;
    if (/[0-9]/.test(pwd)) strength += 1;
    if (/[^A-Za-z0-9]/.test(pwd)) strength += 1;
    return strength;
  };

  const getStrengthText = (strength) => {
    switch (strength) {
      case 0:
      case 1:
        return { text: "Very Weak", color: "text-red-500" };
      case 2:
        return { text: "Weak", color: "text-orange-500" };
      case 3:
        return { text: "Fair", color: "text-yellow-500" };
      case 4:
        return { text: "Good", color: "text-blue-500" };
      case 5:
        return { text: "Strong", color: "text-green-500" };
      default:
        return { text: "", color: "" };
    }
  };

  const strength = passwordStrength(password || "");
  const strengthInfo = getStrengthText(strength);

  const onSubmit = async (data) => {
    try {
      clearError();
      const { confirmPassword, agreeToTerms, ...userData } = data;

      if (!agreeToTerms) {
        setError("agreeToTerms", {
          type: "required",
          message: "You must agree to the terms and conditions.",
        });
        return;
      }
      await registerUser(userData);
      onSuccess();
    } catch (err) {
      const apiError = err.response?.data;

      if (apiError?.details) {
        // structured errors (if backend ever returns them)
        console.log("error details", apiError.details);
        Object.entries(apiError.details).forEach(([field, message]) => {
          setError(field, { type: "server", message });
        });
      } else if (apiError?.message) {
        // fallback: attach the message to the email field
        setError("email", { type: "server", message: apiError.message });
      }
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Name Field */}
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Full Name
          </label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={`input ${errors.name ? "input-error" : ""}`}
            placeholder="Enter your full name"
            {...register("name", {
              required: "Name is required",
              minLength: {
                value: 2,
                message: "Name must be at least 2 characters",
              },
              maxLength: {
                value: 50,
                message: "Name must be less than 50 characters",
              },
            })}
          />
          {errors.name && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.name.message}
            </p>
          )}
        </div>

        {/* Email Field */}
        <div>
          <label
            htmlFor="email"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Email Address
          </label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`input ${errors.email ? "input-error" : ""}`}
            placeholder="Enter your email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.email.message}
            </p>
          )}
        </div>

        {/* Password Field */}
        <div>
          <label
            htmlFor="password"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Password
          </label>
          <div className="relative">
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`input pr-12 ${errors.password ? "input-error" : ""}`}
              placeholder="Create a password"
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters",
                },
                validate: (value) => {
                  const strength = passwordStrength(value);
                  return strength >= 2 || "Password is too weak";
                },
              })}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>

          {/* Password Strength Indicator */}
          {password && (
            <div className="mt-2">
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-1 flex-1 rounded ${
                      i < strength
                        ? strength <= 2
                          ? "bg-red-500"
                          : strength <= 3
                          ? "bg-yellow-500"
                          : "bg-green-500"
                        : "bg-gray-200 dark:bg-gray-700"
                    }`}
                  />
                ))}
              </div>
              <p className={`text-xs mt-1 ${strengthInfo.color}`}>
                {strengthInfo.text}
              </p>
            </div>
          )}

          {errors.password && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.password.message}
            </p>
          )}
        </div>

        {/* Confirm Password Field */}
        <div>
          <label
            htmlFor="confirmPassword"
            className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            Confirm Password
          </label>
          <div className="relative">
            <input
              id="confirmPassword"
              type={showConfirmPassword ? "text" : "password"}
              autoComplete="new-password"
              className={`input pr-12 ${
                errors.confirmPassword ? "input-error" : ""
              }`}
              placeholder="Confirm your password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
            >
              {showConfirmPassword ? (
                <EyeSlashIcon className="w-5 h-5" />
              ) : (
                <EyeIcon className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="mt-1 text-sm text-red-600 dark:text-red-400">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        {/* Terms Agreement */}
        <div className="flex items-start">
          <input
            id="agreeToTerms"
            type="checkbox"
            className="mt-1 h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            {...register("agreeToTerms", {
              required: "You must agree to the terms and conditions",
            })}
          />
          <label
            htmlFor="agreeToTerms"
            className="ml-3 text-sm text-gray-600 dark:text-gray-400"
          >
            I agree to the{" "}
            <Link
              href="/terms"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Terms and Conditions
            </Link>{" "}
            and{" "}
            <Link
              href="/privacy"
              className="text-primary-600 dark:text-primary-400 hover:underline"
            >
              Privacy Policy
            </Link>
          </label>
        </div>
        {errors.agreeToTerms && (
          <p className="text-sm text-red-600 dark:text-red-400">
            {errors.agreeToTerms.message}
          </p>
        )}

        {/* Server Error */}
        {error && (
          <div className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-600 dark:text-red-400">{error}</p>
          </div>
        )}

        {/* Submit Button */}
        <LoadingButton
          type="submit"
          loading={loading}
          className="w-full btn-primary"
          disabled={loading}
        >
          Create Account
        </LoadingButton>

        {/* Switch to Login */}
        <div className="text-center border-t border-gray-200 dark:border-gray-700 pt-6">
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Already have an account?{" "}
            <button
              type="button"
              onClick={onSwitchToLogin}
              className="font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300"
            >
              Sign in
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}

export default RegisterForm;
