import React, { PureComponent } from 'react';
import Button from '../../Components/Button';
import NameList from '../NameList';
import Win from '../Win';
import Turn from '../Turn';

import names from '../../Pages/Statics/names.json';
import '../../App.css';

const timerSpeed = 1000;

const speechRecognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();

speechRecognition.lang = 'tr-TR';
speechRecognition.continuous = false;

export default class Home extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      counter: 8,
      saidNames: [],
      clientWin: false,
      computerWin: false,
      wrongName: '',
      notSaidWord: false,
      whoseTurn: 'computer',
      isStarted: false,
    }
    this.timer = null;
  }
  
  componentDidUpdate(_, prevState) {
    const {
      clientWin,
      computerWin,
    } = this.state;
    if (prevState.counter < 1) {
      this.stopRecognation();
    }
    if (clientWin || computerWin ) {
      this.updateButtonStatus();
    }
  }

  stopRecognation = () => {
    speechRecognition.stop();
    this.closeTimer();
    this.setState({
      computerWin: true,
      notSaidWord: true,
    })
  }

  updateButtonStatus = () => {
    this.setState({
      isStarted: false,
    })
  }

  startTimer = () => {
    this.timer = setInterval(() => this.tick(), timerSpeed);
  }

  tick = () => {
    const {
      counter,
    } = this.state;
    const hasNoTime = counter < 1;
    if (hasNoTime) {
      this.closeTimer();
    } else {
      this.setState({
        counter: counter - 1,
      });
    }
  }

  closeTimer = () => {
    clearInterval(this.timer);
    this.setState({
      counter: 8,
    })
  }

  setNames = (obj, cb) => {
    const isValid = this.checkName(obj);
    if (isValid) {
      this.setState({
        whoseTurn: obj.whoseTurn,
        saidNames: [
          ...this.state.saidNames,
          obj.name,
        ]
      }, () => cb())
    }
  }

  checkName = (obj) => {
    const {
      saidNames,
    } = this.state;
    const alreadySaidName = saidNames.includes(obj.name);
    const lastName = !!saidNames && saidNames[saidNames.length - 1];
    const lastCharacterOfLastName = !!lastName && lastName[lastName.length - 1];
    const firstCharacterOfSaidName = obj.name.charAt(0);
    const wrongName = !!saidNames.length && firstCharacterOfSaidName !== lastCharacterOfLastName;

    if (alreadySaidName || wrongName || !obj.name) {
       this.setState({
          clientWin: obj.owner === 'computer',
          computerWin: obj.owner === 'client',
          wrongName: obj.name,
        })
        this.closeTimer();
        return false;
    }
    this.closeTimer();
    return true;
  }

  onClick = () => {
    const {
      clientWin,
      computerWin,
    } = this.state;
    this.startTimer();

    this.setState({
      isStarted: true,
    })

    if (clientWin || computerWin) {
      this.setState({
        computerWin: false,
        clientWin: false,
        notSaidWord: false,
        wrongName: '',
        saidNames: [],
        whoseTurn: 'computer',
      })
    }
    const randomNameIndex = Math.floor(Math.random() * names.length); 
    const randomName = names[randomNameIndex];
    setTimeout(() => {
      this.setNames({
        name: randomName,
        owner: 'computer',
        whoseTurn: 'client'
      },
        () => {
        this.closeTimer();
        this.clientTurn()
      })
    }, 3000)
  }

  computerTurn = () => {
    const {
      saidNames
    } = this.state;
    this.startTimer();

    const chancePercant = Math.random() * 100;
    const lastName = saidNames[saidNames.length -1];
    const findLastNameCharacter = lastName.charAt(lastName.length - 1);
    const filteredNames = names.filter(name => !saidNames.includes(name));
    const findName = filteredNames.find(name => name.charAt(0) === findLastNameCharacter);

    if (chancePercant < 10) {
      const wrongName = filteredNames.find(name => name.charAt(0) !== findLastNameCharacter);
      setTimeout(() => {
        this.setNames({
          name: wrongName,
          owner: 'computer',
        },
         () => {
          this.closeTimer();
          this.clientTurn();
        })
      }, 1700)
    } else if (chancePercant < 25) {
      const theSameName = names.find(name => saidNames.includes(name));
      setTimeout(() => {
        this.setNames({
          name: theSameName,
          owner: 'computer',
        },
         () => {
          this.closeTimer();
          this.clientTurn();
        })
      }, 2300)
    } else {
      setTimeout(() => {
        this.setNames({
          name: findName,
          owner: 'computer',
          whoseTurn: 'client',
        },
         () => {
          this.closeTimer();
          this.clientTurn()
        })
      }, 3000)
    }
  }

  clientTurn = () => {
    this.startTimer();
    speechRecognition.start();
    speechRecognition.onresult = (event) =>  {
      const last = event.results.length - 1;
      const saidName = event.results[last][0].transcript.toLowerCase();
      
      if (saidName) {
          this.setNames({
            name: saidName,
            owner: 'client',
            whoseTurn: 'computer',
          },
          () => {
            speechRecognition.stop();
            this.closeTimer();
            this.computerTurn();
          })
        }
    }
  }

  render() {
    const {
      counter,
      saidNames,
      clientWin,
      computerWin,
      wrongName,
      notSaidWord,
      whoseTurn,
      isStarted,
    } = this.state;

    return (
      <div className={'Home'}>
        <p>İsim Bulmaca</p>
        <br />
        <div>
          Kalan Süre: {counter}
        </div>
        <br />
        {
          <Turn 
            whoseTurn={whoseTurn}
          />
        }
        <br />
        <Button
          onClick={this.onClick}
          disabled={isStarted}
        />
        <br />
        <NameList
          names={saidNames}
        />
        <br />
        <Win 
          clientWin={clientWin}
          computerWin={computerWin}
          wrongName={wrongName}
          notSaidWord={notSaidWord}
        />
      </div>
    )
  }
}

