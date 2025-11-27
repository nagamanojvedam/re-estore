'use server';

import { revalidatePath } from 'next/cache';
import config from '../utils/config';
import axios from 'axios';

export async function sendMessageAction(prevState: any, formData: FormData) {
  const name = formData.get('name');
  const email = formData.get('email');
  const message = formData.get('message');

  try {
    await axios.post(`/api/messages`, { name, email, message });

    revalidatePath('/contact');
    return { success: true, message: 'Message sent successfully' };
  } catch (err: any) {
    return { success: false, message: err.response?.data?.message || 'Failed to send mesage' };
  }
}
