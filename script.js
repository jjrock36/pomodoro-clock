class Title extends React.Component {
  render() {
    return (
      React.createElement("div", { id: "title" }, "Pomodoro Clock"));

  }}


class Buttons extends React.Component {
  render() {
    return (
      React.createElement("div", { className: "adjustment" },

      React.createElement("div", { id: "b-label" },
      React.createElement("div", {
        id: "break-label",
        onClick: this.props.handleClick }, "B"),

      React.createElement("div", { id: "break-button" },
      React.createElement("i", {
        className: "fas fa-circle",
        id: "b-circle",
        onClick: this.props.handleClick }))),




      React.createElement("div", { id: "s-label" },
      React.createElement("div", {
        id: "session-label",
        onClick: this.props.handleClick }, "S"),

      React.createElement("div", { id: "session-button" },
      React.createElement("i", {
        className: "fas fa-circle",
        id: "s-circle",
        onClick: this.props.handleClick }))),




      React.createElement("div", { id: "d-pad" },
      React.createElement("div", null,
      React.createElement("i", {
        className: "fas fa-square up",
        id: "session-increment",
        onClick: this.props.handleClick }),

      React.createElement("i", {
        className: "fas fa-square right",
        id: "break-increment",
        onClick: this.props.handleClick })),


      React.createElement("div", null,
      React.createElement("i", {
        className: "fas fa-square down",
        id: "session-decrement",
        onClick: this.props.handleClick }),

      React.createElement("i", {
        className: "fas fa-square left",
        id: "break-decrement",
        onClick: this.props.handleClick }))),




      React.createElement("div", { id: "controls" },
      React.createElement("div", { id: "start_stop" },
      React.createElement("i", {
        className: "fas fa-square",
        id: "start",
        onClick: this.props.timerControl }),

      React.createElement("span", { id: "s-s-button" }, "Start")),

      React.createElement("div", { id: "reset" },
      React.createElement("i", {
        className: "fas fa-square",
        id: "restart",
        onClick: this.props.reset }),

      React.createElement("span", { id: "r-button" }, "Reset")))));




  }}


class Timer extends React.Component {
  render() {
    return (
      React.createElement("div", { id: "timer" },
      React.createElement("div", { id: "retro-display" },

      React.createElement("i", {
        className: "fas fa-caret-right",
        style: this.props.timerRunning ? { display: "none" } : this.props.isBreak ? { marginTop: "60px" } : { marginTop: "-2px" } }),


      React.createElement("div", {
        id: "session",
        style: this.props.timerRunning ? { display: "none" } : this.props.isBreak ? { opacity: ".25" } : { opacity: ".9" } }, "Session",

      React.createElement("div", { id: "session-length" },
      this.props.sessionTime)),



      React.createElement("div", {
        id: "break",
        style: this.props.timerRunning ? { display: "none" } : this.props.isBreak ? { opacity: ".9" } : { opacity: ".25" } }, "Break",

      React.createElement("div", { id: "break-length" },
      this.props.breakTime)),



      React.createElement("div", {
        id: "timer-label",
        style: this.props.timerRunning ? { color: "#140" } : { display: "none" } },

      this.props.timerType,
      React.createElement("div", { id: "timer-left" },
      this.props.toClock())))));





  }}


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isBreak: false,
      sessionTime: 25,
      breakTime: 5,
      timerType: 'Session',
      timerRunning: false,
      timer: 1500,
      intervalID: '' };

    this.handleBSClick = this.handleBSClick.bind(this);
    this.toClock = this.toClock.bind(this);
    this.startCountdown = this.startCountdown.bind(this);
    this.timerControl = this.timerControl.bind(this);
    this.decrementTime = this.decrementTime.bind(this);
    this.phaseControl = this.phaseControl.bind(this);
    this.switchTimer = this.switchTimer.bind(this);
    this.alarm = this.alarm.bind(this);
    this.reset = this.reset.bind(this);
  }

  handleBSClick(e) {
    if (this.state.timerRunning) return;

    //Switch between break and session
    if (e.target.id === "break-label" || e.target.id === "b-circle") {
      this.setState(state => ({
        isBreak: true }));

    } else
    if (e.target.id === "session-label" || e.target.id === "s-circle") {
      this.setState(state => ({
        isBreak: false }));

    }

    //Increment time
    else if (e.target.id === "session-increment" || e.target.id === "break-increment") {
        //Session time
        if (this.state.sessionTime < 60 && !this.state.isBreak) {
          this.setState(state => ({
            sessionTime: state.sessionTime + 1,
            timer: state.sessionTime * 60 + 60 }));

        }
        //Break time
        else if (this.state.breakTime < 60 && this.state.isBreak) {
            this.setState(state => ({
              breakTime: state.breakTime + 1,
              timer: state.breakTime * 60 + 60 }));

          }
      }

      //Decrement time
      else if (e.target.id === "session-decrement" || e.target.id === "break-decrement") {
          //Session time
          if (this.state.sessionTime > 1 && !this.state.isBreak) {
            this.setState(state => ({
              sessionTime: state.sessionTime - 1,
              timer: state.sessionTime * 60 - 60 }));

          }
          //Break time
          else if (this.state.breakTime > 1 && this.state.isBreak) {
              this.setState(state => ({
                breakTime: state.breakTime - 1,
                timer: state.breakTime * 60 - 60 }));

            }
        }
        //Other
        else {
            this.setState(state => ({
              isBreak: !this.state.isBreak }));

          }
  }

  timerControl() {
    let control = !this.state.timerRunning ? (

    this.setState({ timerRunning: true }),
    this.startCountdown(),
    this.audioBegin.play()) : (



    this.state.intervalID && clearInterval(this.state.intervalID),
    this.setState({ timerRunning: false }));

  }
  startCountdown() {
    this.setState({
      intervalID: setInterval(() => {
        this.decrementTime();
        this.phaseControl();
      }, 1000) });

  }
  decrementTime() {
    this.setState(state => ({ timer: this.state.timer - 1 }));
  }
  phaseControl() {
    let timer = this.state.timer;
    this.alarm(timer);
    if (timer < 1) {
      this.state.timerType == 'Session' ? (
      this.state.intervalID && clearInterval(this.state.intervalID),
      this.setState({ isBreak: true }),
      this.startCountdown(),
      this.switchTimer(this.state.breakTime * 60, 'Break')) : (



      this.state.intervalID && clearInterval(this.state.intervalID),
      this.setState({ isBreak: false }),
      this.startCountdown(),
      this.switchTimer(this.state.sessionTime * 60, 'Session'));

    }
  }
  switchTimer(length, type) {
    this.setState({
      timer: length,
      timerType: type });

  }
  alarm(_timer) {
    if (_timer === 0) {
      this.audioEnd.play();
    }
  }

  toClock() {
    let minutes = Math.floor(this.state.timer / 60);
    let seconds = this.state.timer - minutes * 60;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    return minutes + ':' + seconds;
  }

  reset() {
    this.setState({
      isBreak: false,
      sessionTime: 25,
      breakTime: 5,
      timerType: 'Session',
      timerRunning: false,
      timer: 1500,
      intervalID: '' });

    this.state.intervalID && clearInterval(this.state.intervalID);
    this.audioEnd.pause();
    this.audioEnd.currentTime = 0;
    this.audioBegin.pause();
    this.audioBegin.currentTime = 0;
  }

  render() {
    return (
      React.createElement("div", null,
      React.createElement("div", null,
      React.createElement(Title, null)),

      React.createElement("div", { id: "clock" },
      React.createElement("div", { id: "blank" }),
      React.createElement(Timer, {
        isBreak: this.state.isBreak,
        timerType: this.state.timerType,
        timerRunning: this.state.timerRunning,
        breakTime: this.state.breakTime,
        sessionTime: this.state.sessionTime,
        timer: this.state.timer,
        toClock: this.toClock }),

      React.createElement(Buttons, {
        handleClick: this.handleBSClick,
        timerControl: this.timerControl,
        reset: this.reset })),


      React.createElement("div", null,
      React.createElement("audio", {
        id: "beep",
        preload: "auto",
        src: "https://sampleswap.org/samples-ghost/SOUND%20EFFECTS%20and%20NOISES/VIDEO%20GAMES/zelda/782[kb]zelda-triforce.aif.mp3",
        ref: (audio) =>
        {this.audioEnd = audio;} }),


      React.createElement("audio", {
        id: "beep2",
        preload: "auto",
        src: "https://sampleswap.org/samples-ghost/SOUND%20EFFECTS%20and%20NOISES/VIDEO%20GAMES/zelda/688[kb]zelda-start.aif.mp3",
        ref: (audio) =>
        {this.audioBegin = audio;} }))));





  }}


ReactDOM.render(
React.createElement(App, null),
document.getElementById('app'));