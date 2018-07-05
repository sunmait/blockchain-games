import React from 'react';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';
import Button from 'react-bootstrap/lib/Button';
import FormControl from 'react-bootstrap/lib/FormControl';
import Countdown from '../../../common/Countdown/Countdown';
import './CurrentGame.css';
import getGravatarUrl from '../../../../helpers/getGravatarUrl';
import isFloat from '../../../../helpers/isFloat';
import { NotificationManager } from 'react-notifications';

class CurrentGame extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      betAmount: Math.abs(this.props.localWeb3.fromWei(props.currentGame.player1TotalBet - props.currentGame.player2TotalBet)),
      isFinishGameButtonEnabled: false,
      isCountdownFinished: false,
    }
  }

  componentDidUpdate(prevProps) {
    if (this.props.item.playerWhoBetLast !== prevProps.item.playerWhoBetLast) {
      this.setState({
        isCountdownFinished: false,
      });
    }
  }

  renderHostRisk = () => {
    return `(${(this.props.ethPrice * this.props.localWeb3.fromWei(this.props.currentGame.player1TotalBet)).toFixed(2)}USD)`;
  };

  renderJoinedRisk = () => {
    return `(${(this.props.ethPrice * this.props.localWeb3.fromWei(this.props.currentGame.player2TotalBet)).toFixed(2)}USD)`;
  };

  renderHostedGame = () => {
    return (
      <Row>
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={3} className="text-centralized">
              <Row>
                Game #{this.props.currentGame.id} {this.props.currentGame.status}
              </Row>
              <Row>
                <img
                  src={getGravatarUrl(this.props.currentGame.player1)}
                  alt="no img"
                />
              </Row>
            </Col>
            <Col md={9} className="vertical-centralized">
              <Row>
                <div className="madness-game-bet-title">
                  Host total bet:
                </div>{this.props.localWeb3.fromWei(this.props.currentGame.player1TotalBet)} ETH
                {this.props.ethPrice ? this.renderHostRisk() : null}
              </Row>
              <Row>
                <div className="madness-game-bet-title">
                  Waiting for an opponent
                </div>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  renderCountDown = () => {
    if (this.props.currentGame.status === 'Joined') {
      const title = this.props.currentGame.playerWhoBetLast === this.props.currentAccount ?
        "Your opponent's turn! " : 'Your turn!';
      if (this.state.isCountdownFinished) {
        return (
          <React.Fragment>
            <div className="madness-game-my-games-countdown-title-container">
              {title}
            </div>
            <div className="madness-game-countdown-container">
              (Countdown finished)
            </div>
          </React.Fragment>
        )
      }
      return (
        <React.Fragment>
          <div className="madness-game-my-games-countdown-title-container">
            {title}
          </div>
          <div className="madness-game-countdown-container">
            (<Countdown
              start={this.props.currentGame.lastRaiseTime || 0}
              duration={60*60*24}
              countdownEnded={() => {
                this.enableFinishGameButton();
                this.setState({
                  isCountdownFinished: true,
                });
              }}
            />)
          </div>
        </React.Fragment>
      );
    }
    return null;
  };

  renderJoinedGame = () => {
    return (
      <Row>
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={3} className="text-centralized">
              <Row>
                Game #{this.props.currentGame.id} {this.props.currentGame.status}
              </Row>
              <Row>
                <img
                  src={getGravatarUrl(this.props.currentGame.player1)}
                  alt="no img"
                />
              </Row>
            </Col>
            <Col md={9}>
              <Row>
                {this.renderCountDown()}
              </Row>
              <Row>
                <div className="madness-game-bet-title">
                  Host total bet:
                </div>{this.props.localWeb3.fromWei(this.props.currentGame.player1TotalBet)} ETH
                {this.props.ethPrice ? this.renderHostRisk() : null}
              </Row>
              <Row>
                <div className="madness-game-bet-title">
                  Joined total bet:
                </div>
                {this.props.localWeb3.fromWei(this.props.currentGame.player2TotalBet)} ETH
                {this.props.ethPrice ? this.renderJoinedRisk() : null}
              </Row>
              <Row>
                {this.props.currentGame.playerWhoBetLast === this.props.currentAccount ?
                  this.renderFinishGameContainer() : this.renderRaiseContainer()}
              </Row>
            </Col>
          </Row>
          <Row>
            Game bets history: {this.renderBetsHistory()}
          </Row>
        </Col>
      </Row>
    );
  };

  renderBetsHistory = () => {
    return (
      <table className="game-bets-history-table">
        <thead>
          <tr>
            <td>Host{this.props.currentGame.player1 === this.props.currentAccount ? '(You)' : null}</td>
            <td>Joined{this.props.currentGame.player2 === this.props.currentAccount ? '(You)' : null}</td>
          </tr>
        </thead>
        <tbody>
          {
            this.props.currentGame.betsHistory.map((bet, index) => {
              if (index % 2 === 0) {
                return (
                  <tr key={index}>
                    <td className="table-filled-field">{this.props.localWeb3.fromWei(Number(bet))}</td>
                    <td />
                  </tr>
                );
              } else {
                return (
                  <tr key={index}>
                    <td />
                    <td className="table-filled-field">{this.props.localWeb3.fromWei(Number(bet))}</td>
                  </tr>
                );
              }
            })
          }
        </tbody>
      </table>
    );

  };

  enableFinishGameButton = () => {
    this.setState({
      isFinishGameButtonEnabled: true,
    });
  };

  handleRaiseValueChange = (value) => {
    if (!isFloat(value)) {
      return;
    }
    this.setState({
      betAmount: value,
    });
  };

  renderFinishGameContainer = () => {
    return (
      <Col md={12} className="madness-game-interaction-button-container">
        <Button
          onClick={this.handleFinishGameButtonClick}
          disabled={!this.state.isFinishGameButtonEnabled}
        >
          Finish game
        </Button>
      </Col>
    )
  };

  handleFinishGameButtonClick = () => {
    const {withdrawal} = this.props.contractInstance;
    withdrawal(this.props.currentGame.id, (err) => {
      if (err) {
        NotificationManager.error(err.message, 'Transaction failed', 7000);
      } else {
        NotificationManager.info('Transaction operating.', 'Transaction Info', 5000);
      }
    });
  };

  // TODO: handle situation when your opponent did bet before you finished the game
  // TODO: in other places events will handle it, but it not changes component's state
  renderRaiseContainer = () => {
    return (
      <Row>
        <Col md={12}>
          <div className="madness-game-bet-title">
            Raise:
          </div>
          <FormControl
            className="madness-game-raise-input"
            type="text"
            value={this.state.betAmount}
            onChange={(event) => this.handleRaiseValueChange(event.target.value)}
          />
        </Col>
        <Col md={12} className="madness-game-interaction-button-container">
          <Button
            onClick={this.handleRaiseButtonClick}
          >
            Raise
          </Button>
        </Col>
      </Row>
    );
  };

  // TODO: switch to person who raised and waiting finish game button enabling
  handleRaiseButtonClick = () => {
    const betAmount = Number(this.props.localWeb3.toWei(this.state.betAmount));
    const player1TotalBet = Number(this.props.currentGame.player1TotalBet);
    const player2TotalBet = Number(this.props.currentGame.player2TotalBet);
    const minRaiseValue = 0.000001;
    if (betAmount + player2TotalBet < player1TotalBet + minRaiseValue ||
        betAmount + player1TotalBet < player2TotalBet + minRaiseValue) {
      return;
    }

    const {raise} = this.props.contractInstance;
    const transactionData = { value: this.props.localWeb3.toWei(this.state.betAmount) };
    raise.sendTransaction(this.props.currentGame.id, transactionData, (err) => {
      if (err) {
        NotificationManager.error(err.message, 'Transaction failed', 7000);
      } else {
        NotificationManager.info('Transaction operating.', 'Transaction Info', 5000);
      }
    });
  };

  renderFinishedGame = () => {
    return (
      <Row>
        <Col mdOffset={3} md={6}>
          <Row>
            <Col md={3} className="text-centralized">
              <Row>
                Game #{this.props.currentGame.id} {this.props.currentGame.status}
              </Row>
              <Row>
                <img
                  src={getGravatarUrl(this.props.localWeb3.sha3(this.props.currentGame.player1).slice(2))}
                  alt="no img"
                />
              </Row>
            </Col>
            <Col md={9}>
              <Row>
                <div className="madness-game-bet-title">
                  Host total bet:
                </div>{this.props.localWeb3.fromWei(this.props.currentGame.player1TotalBet)} ETH
                {this.props.ethPrice ? this.renderHostRisk() : null}
              </Row>
              <Row>
                <div className="madness-game-bet-title">
                  Joined total bet:
                </div>
                {this.props.localWeb3.fromWei(this.props.currentGame.player2TotalBet)} ETH
                {this.props.ethPrice ? this.renderJoinedRisk() : null}
              </Row>
              <Row>
                <Col md={12} className="madness-game-result-container">
                  <h3>Game is over</h3>
                  <br />
                  <div className="finished-game-message-container">
                    {
                      this.props.currentGame.result === 'Win' ?
                        (
                          this.props.currentGame.player1 === this.props.currentAccount ?
                            <p>
                              Congratulations, You won!<br />
                              The money has been sent to your wallet.
                            </p> :
                            'Sorry, You lost.'
                        ) :
                        (
                          this.props.currentGame.player2 === this.props.currentAccount ?
                            <p>
                              Congratulations, You won!<br />
                              The money has been sent to your wallet.
                            </p> :
                            'Sorry, You lost.'
                        )
                    }
                  </div>
                  <br />
                  <div className="finished-game-message-container">
                    {
                      this.props.currentGame.player1 === this.props.currentAccount ?
                        <p>
                          Your total bet was {this.props.localWeb3.fromWei(this.props.currentGame.player1TotalBet)} ETH<br />
                          Your opponent's total bet was {this.props.localWeb3.fromWei(this.props.currentGame.player2TotalBet)} ETH
                        </p> :
                        <p>
                          Your total bet was {this.props.localWeb3.fromWei(this.props.currentGame.player2TotalBet)} ETH<br />
                          Your opponent's total bet was {this.props.localWeb3.fromWei(this.props.currentGame.player1TotalBet)} ETH
                        </p>
                    }
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  render() {
    return (
      <React.Fragment>
        {
          this.props.currentGame.status === 'Hosted' ? this.renderHostedGame() : null
        }
        {
          this.props.currentGame.status === 'Joined' ? this.renderJoinedGame() : null
        }
        {
          this.props.currentGame.status === 'Ended' ? this.renderFinishedGame() : null
        }
      </React.Fragment>
    )

  }
}

export default CurrentGame;