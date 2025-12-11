'use server';

import { createOrder } from '../data/orders';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

export async function placeOrder(formData: FormData) {
  const userId = formData.get('userId');
  const items = JSON.parse(formData.get('items') as string);
  const shippingAddress = JSON.parse(formData.get('address') as string);
  const paymentMethod = formData.get('paymentMethod') as string;
  const paymentStatus = paymentMethod === 'card' ? 'paid' : 'pending';

  const newOrder = {
    items: items.map((item: any) => ({
      product: item.id,
      quantity: item.quantity,
    })),
    shippingAddress,
    user: userId,
    paymentMethod,
    paymentStatus,
  };
  try {
    const order = await createOrder(newOrder);

    revalidatePath('/orders');
    redirect(`/orders/${order._id}`);
  } catch (err) {
    console.error('Order Failed:', err);
    redirect('/checkout?error=order_failed');
  }
}
