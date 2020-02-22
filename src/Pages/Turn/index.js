import React from 'react';

export default function Turn({whoseTurn}) {
  return <div>{`Şu anda sıra ${whoseTurn === 'client' ? 'sizde' : 'bilgisayarda' }`}</div>
}