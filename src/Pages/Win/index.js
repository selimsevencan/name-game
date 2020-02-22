import React from 'react';

export default function Win({clientWin, computerWin, wrongName, notSaidWord}) {
  
  return (
    <div>
      {clientWin ? `Kazandınız çünkü bilgisayar '${wrongName}' ismini söyledi` : ''}
      {computerWin && !notSaidWord ? `Kaybettiniz çünkü bu ismi '${wrongName}' söylediniz` : ''}
      {computerWin && notSaidWord ? `Kaybettiniz çünkü herhangi bir isim söylemediniz` : ''}
    </div>
  )
}