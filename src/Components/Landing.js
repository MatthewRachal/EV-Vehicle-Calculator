import React, { Component } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../App.css";
import UserQuestions from "./UserQuestions";
import Results from "./Results";

export default class Landing extends Component {
  state = {
    displayCalculation: false,
    results: {
      rateType: undefined,
      miles: 0,
      timeOfDay: ["Select Time", "Select Time"],
    },
  };

  changeDisplay = (rate, miles, time) => {
    var results = {
      rateType: rate,
      miles: miles,
      timeOfDay: time,
    };
    this.setState({
      results: results,
      displayCalculation: !this.state.displayCalculation,
    });
  };

  render() {
    return (
      <Container
        fluid
        style={{ minWidth: "320px", maxWidth: "3000px", textAlign: "center" }}
      >
        <Row className="heroHeader">
          <Col>
            <h3 className="heroText1">EV Savings Calculator</h3>
            <h6 className="heroText2">
              Your electric car guide. Estimate and compare costs, savings, EV
              incentives, and more.
            </h6>
          </Col>
        </Row>

        <Row>
          <Col>
            {!this.state.displayCalculation ? (
              <UserQuestions changeDisplay={this.changeDisplay} />
            ) : (
              <Results
                changeDisplay={this.changeDisplay}
                results={this.state.results}
              />
            )}
          </Col>
        </Row>

        <Row style={{ height: "100px" }} />
      </Container>
    );
  }
}
