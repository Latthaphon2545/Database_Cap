import React from 'react';
import Link from 'next/link';

export default function Home() {
  return (
    <div>
      <h1>Hello, world!</h1>
      <Link href="/members" className='btn btn-primary'>
        Go to members page
      </Link>
    </div>
  );
}
