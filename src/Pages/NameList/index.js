import React from 'react';

export default function NameList({names}) {
  return <div>
    {
      names.map((name, i) => {
        return (
          <div key={i}>
            <br />
            {name}
          </div>
        )
      })
    }
  </div>
}