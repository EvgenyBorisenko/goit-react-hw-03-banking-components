import React, { Component } from 'react';
import shortid from 'shortid';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Controls from '../Controls/Controls';
import Balance from '../Balance/Balance';
import TransactionHistory from '../TransactionHistory/TransactionHistory';

// const notify = () => toast('Wow so easy !');

toast.configure();

class Dashboard extends Component {
  state = {
    transactions: [],
    balance: 0,
    inputValue: 0,
    allDepositNumber: 0,
    allWithdrawNumber: 0,
  };

  componentDidMount() {
    try {
      const getBankInfo = localStorage.getItem('bankInfo');
      // console.log('getBankInfo :', getBankInfo);

      if (getBankInfo !== null) {
        const newPartState = JSON.parse(getBankInfo);
        this.setState({ ...newPartState });
      }
    } catch (err) {
      throw err;
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const {
      transactions,
      balance,
      allDepositNumber,
      allWithdrawNumber,
    } = this.state;

    if (prevState.transactions !== transactions) {
      localStorage.setItem(
        'bankInfo',
        JSON.stringify({
          transactions,
          balance,
          allDepositNumber,
          allWithdrawNumber,
        }),
      );
    }
  }

  notifyA = () =>
    toast('На счету недостаточно средств для проведения операции!', {
      position: toast.POSITION.TOP_CENTER,
    });

  notifyB = () =>
    toast('Введите сумму для проведения операции!', {
      position: toast.POSITION.TOP_CENTER,
    });

  onChangeInput = e => {
    this.setState({
      inputValue: Number(e.target.value),
    });
  };

  createTransaction = e => {
    const { inputValue, balance } = this.state;
    if (inputValue === 0) {
      this.notifyB();
    } else if (e.target.dataset.id === 'Withdraw' && inputValue > balance) {
      this.notifyA();
    } else {
      const type = e.target.dataset.id;
      const newTransaction = {
        id: shortid(),
        type,
        amount: inputValue,
        date: new Date().toLocaleString('en-US'),
      };
      this.setState(prevState => ({
        transactions: [...prevState.transactions, newTransaction],
        balance: [...prevState.transactions, newTransaction].reduce(
          (acc, el) => acc + (el.type === 'Deposit' ? +el.amount : -el.amount),
          0,
        ),
        allDepositNumber: [...prevState.transactions, newTransaction].reduce(
          (acc, el) => acc + (el.type === 'Deposit' ? el.amount : 0),
          0,
        ),
        allWithdrawNumber: [...prevState.transactions, newTransaction].reduce(
          (acc, el) => acc + (el.type !== 'Deposit' ? el.amount : 0),
          0,
        ),
      }));
    }
  };

  render() {
    const {
      inputValue,
      transactions,
      balance,
      allDepositNumber,
      allWithdrawNumber,
    } = this.state;
    return (
      <div>
        <Controls
          onClickButton={this.createTransaction}
          inputValue={inputValue}
          onChangeInput={this.onChangeInput}
        />
        <Balance
          allWithdrawNumber={allWithdrawNumber}
          allDepositNumber={allDepositNumber}
          balance={balance}
        />
        <TransactionHistory transactions={transactions} />
      </div>
    );
  }
}

export default Dashboard;
