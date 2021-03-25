import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../App.css";

export default class UserQuestions extends Component {
  state = {
    rateType: undefined,
    miles: 0,
    timeOfDay: ["Start Time", "End Time"],
    changeDisplay: false,
  };

  generateTimes = (period) => {
    var times = [
      0,
      1,
      2,
      3,
      4,
      5,
      6,
      7,
      8,
      9,
      10,
      11,
      12,
      13,
      14,
      15,
      16,
      17,
      18,
      19,
      20,
      21,
      22,
      23,
    ];
    return times.map((key, index) => {
      return (
        <li
          key={index}
          onClick={(e) => {
            e.preventDefault();
            this.changeTimeOfDay(times[index], period);
          }}
        >
          {times[index]}:00
        </li>
      );
    });
  };

  selectRate = (rate) => {
    this.setState({ rateType: rate });
  };

  changeMiles = (e) => {
    this.setState({ miles: e.target.value });
  };
  changeTimeOfDay = (time, period) => {
    var holdTime = this.state.timeOfDay;
    if (period === "Start") {
      holdTime[0] = time;
    } else {
      holdTime[1] = time;
    }
    this.setState({ timeOfDay: holdTime });
  };

  render() {
    return (
      <Container>
        <Row style={{ marginTop: "2em" }}>
          <Col
            lg={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            sm={{ span: 12, offset: 0 }}
            xs={{ span: 12, offset: 0 }}
          >
            <h5 className="text1">What is your current rate?</h5>
          </Col>
        </Row>
        <Row>
          <Col
            lg={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            sm={{ span: 12, offset: 0 }}
            xs={{ span: 12, offset: 0 }}
          >
            <button
              className={
                this.state.rateType === "Flat" ? "buttonActivated" : "button1"
              }
              onClick={(e) => {
                e.preventDefault();
                this.selectRate("Flat");
              }}
            >
              Flat Rate
            </button>
            <button
              className={
                this.state.rateType === "TOU" ? "buttonActivated" : "button1"
              }
              onClick={(e) => {
                e.preventDefault();
                this.selectRate("TOU");
              }}
            >
              Time of Use Rate
            </button>
          </Col>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <Col
            lg={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            sm={{ span: 12, offset: 0 }}
            xs={{ span: 12, offset: 0 }}
          >
            <h5 className="text1">How many miles do you drive a year?</h5>
          </Col>
        </Row>
        <Row>
          <Col
            lg={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            sm={{ span: 12, offset: 0 }}
            xs={{ span: 12, offset: 0 }}
          >
            <h5 className="text2">Miles: {this.state.miles}</h5>
            <input
              onChange={(e) => {
                e.preventDefault();
                this.changeMiles(e);
              }}
              className="slider1"
              type="range"
              min="0"
              max="100000"
              value={this.state.miles}
            />
          </Col>
        </Row>
        <Row style={{ marginTop: "2em" }}>
          <Col
            lg={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            sm={{ span: 12, offset: 0 }}
            xs={{ span: 12, offset: 0 }}
          >
            <h5 className="text1">
              What hours of the day do you plan to charge your vehicle?
            </h5>
            <div className="dropdown">
              <button className="button2">{this.state.timeOfDay[0]}:00</button>
              <div className="dropdownContent">
                {this.generateTimes("Start")}
              </div>
            </div>
            <div className="dropdown">
              <button className="button2">{this.state.timeOfDay[1]}:00</button>
              <div className="dropdownContent">{this.generateTimes("End")}</div>
            </div>
          </Col>
        </Row>

        <Row style={{ marginTop: "2em" }}>
          <Col
            lg={{ span: 8, offset: 2 }}
            md={{ span: 8, offset: 2 }}
            sm={{ span: 12, offset: 0 }}
            xs={{ span: 12, offset: 0 }}
          >
            <h5 className="text1">Calculate</h5>
            <button
              disabled={
                this.state.rateType === undefined ||
                this.state.timeOfDay[0] === "Start Time" ||
                this.state.timeOfDay[1] === "End Time"
              }
              onClick={(e) => {
                e.preventDefault();
                this.props.changeDisplay(
                  this.state.rateType,
                  this.state.miles,
                  this.state.timeOfDay
                );
              }}
              className="button1"
            >
              Calculate
            </button>
          </Col>
        </Row>
      </Container>
    );
  }
}
