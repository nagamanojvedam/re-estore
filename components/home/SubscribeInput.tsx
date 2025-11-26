"use client";

import { isValidEmail } from "@/lib/utils/helpers";
import { ChangeEvent, useState } from "react";
import toast from "react-hot-toast";


function SubscribeInput() {
  const [email, setEmail] = useState("");

  return (
    <div className="mx-auto flex max-w-md flex-col gap-4 sm:flex-row">
      <input
        type="email"
        placeholder="Enter your email"
        className="flex-1 rounded-lg border-0 px-4 py-3 text-primary-900 focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-primary-600"
        value={email}
        onChange={(e: ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
      />
      <button
        className="btn bg-white px-8 text-primary-600 hover:bg-gray-200"
        onClick={() => {
          if (!email || !isValidEmail(email)) {
            toast.error('Please enter a valid email.');
            return;
          }
          toast.success('Subscribed!');
        }}
      >
        Subscribe
      </button>
    </div>
  )
}

export default SubscribeInput
