'use server';

import { cookies } from 'next/headers';
import { revalidatePath } from 'next/cache';
import config from '../utils/config';

export async function cancelOrderAction(id: string) {
  const cookieStore = await cookies();
  const token = cookieStore.get('token')?.value;

  await fetch(`${config.next.api.baseUrl}/orders/cancelMyOrder/${id}`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ status: 'cancelled' }),
  });

  revalidatePath('/orders');
}
