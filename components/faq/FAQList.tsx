'use client';
import FAQItem from './FAQItem';
import { useState } from 'react';

function FAQList({ faqs }) {
  const [open, setOpen] = useState(null);

  return (
    <>
      {faqs.map((item, i) => (
        <FAQItem
          key={item.q}
          index={i}
          question={item.q}
          answer={item.a}
          open={open}
          onToggle={setOpen}
        />
      ))}
    </>
  );
}

export default FAQList;
