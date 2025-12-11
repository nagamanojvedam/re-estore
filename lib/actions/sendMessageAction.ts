'use server';

import { revalidatePath } from 'next/cache';
import { createMessage } from '../data/messages';

export async function sendMessageAction(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const message = formData.get('message') as string;

  try {
    await createMessage({ name, email, message });

    revalidatePath('/contact');
    return { success: true, message: 'Message sent successfully' };
  } catch (err: any) {
    return { success: false, message: err.message || 'Failed to send message' };
  }
}
