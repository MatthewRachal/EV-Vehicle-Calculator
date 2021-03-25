import React, { useState, useEffect } from "react";
import { Container, Row, Col } from "react-bootstrap";
import "../App.css";

//I cleaned the excel data and placed it here: I assumed that the columns for electricty were used to determine energy usage rather than the
//ones that also used gas.
//12AM is position 0,  1AM position 1 and so on
//load profile values are annual kWh values at a given time

var loadProfile = [
  600.9213029,
  547.6523973,
  532.3211248,
  532.67686,
  555.704894,
  637.5729128,
  785.7464749,
  841.8044251,
  782.91376,
  737.1861201,
  743.9109928,
  718.380464,
  695.2520698,
  682.4571423,
  697.0545906,
  775.2913672,
  955.1323777,
  1153.514146,
  1272.233765,
  1350.972445,
  1350.89194,
  1178.017341,
  954.8899334,
  738.5250147,
];
var totalLoadProfile = 9003.714;
var totalSurgeLoad = 4523.568012;

export default function Results(props) {
  const [flatCar, setFlatCar] = useState(0);
  const [flatLoad, setFlatLoad] = useState(0);
  const [TOUCar, setTOUCar] = useState(0);
  const [TOULoad, setTOULoad] = useState(0);

  useEffect(() => {
    calculations();
  });

  const calculations = () => {
    //From PDF
    let flatRate = 0.15; //Flat Rate
    let TOURateNoon = 0.2; //TOU Surge Rate 12PM-6PM
    let TOUNormalRate = 0.08; //TOU Rate otherwise
    let hourDiff = props.results.timeOfDay[1] - props.results.timeOfDay[0]; //Hours spent charging
    let hours;

       if (props.results.timeOfDay[1] === props.results.timeOfDay[0]) {
      hours = 24;
    } else if (hourDiff < 0) {
      hours = 24 - Math.abs(hourDiff);
    } else {
      hours = hourDiff;
    }

    //Flat Rate Load
    let flatLoad = flatRate * totalLoadProfile; //House Load under flat rate for an entire yaer
    let carCostFlat = props.results.miles * 0.3 * flatRate; //From the PDF EV consumes about 0.3kWh per mile driven

    setFlatCar(carCostFlat);
    setFlatLoad(flatLoad);

    let i = 0;
    let counter = 0; //The number of hours under Surge
    let currentTime = props.results.timeOfDay[0];
    let surgeLoad = 0; //The kWhs under the Surge time frame
    while (i < 23) {
      //Switching to midnight
      if (currentTime === 24) {
        currentTime = 0;
      }

      //i === 0 just in case they charge the car for 24 hours  
      if (currentTime !== props.results.timeOfDay[1] || i === 0) {
         //Between 12PM - 6PM
        if (currentTime >= 12 && currentTime <= 17) {
          surgeLoad = loadProfile[currentTime] + surgeLoad;
          counter = counter + 1; //Add Surge Time
        }
      } else {
        i = 24; //Reached the end of time range, end the loop
      }
      currentTime = currentTime + 1;
      i = i + 1;
    }
  

    let surgeRatio = (hours - counter) / hours; //Ratio of hours per day spent during the 12pm-6pm timeframe
    if (hours === 0) {
      surgeRatio = 0; //So no undefined can happen
    }


    //Variable Car Cost
    let carCostVariableSurge =
      props.results.miles * 0.3 * TOURateNoon * (1 - surgeRatio); //From the PDF EV consumes about 0.3kWh per mile driven
    let carCostVariableNormal =
      props.results.miles * 0.3 * TOUNormalRate * surgeRatio; //From the PDF EV consumes about 0.3kWh per mile driven
    let carCostVariable = carCostVariableSurge + carCostVariableNormal;

    //TOU House Load Cost
    let variableLoad =
      (totalLoadProfile - totalSurgeLoad) * TOUNormalRate +
      totalSurgeLoad * TOURateNoon;
    setTOUCar(carCostVariable);
    setTOULoad(variableLoad);
  };

  return (
    <Container>
      <Row style={{ marginTop: "2em" }}>
        <Col
          lg={{ span: 8, offset: 2 }}
          md={{ span: 8, offset: 2 }}
          sm={{ span: 12, offset: 0 }}
          xs={{ span: 12, offset: 0 }}
        >
          <h4>Your Profile:</h4>
          <h5 className="text1">{props.results.rateType} Rate</h5>
          <h5 className="text1">
            {props.results.miles} miles driven in a year
          </h5>
          <h5 className="text1">
            Charging hours: {props.results.timeOfDay[0]}:00 -{" "}
            {props.results.timeOfDay[1]}:00
          </h5>
        </Col>
      </Row>
      <Row style={{ marginTop: "2em" }}>
        <Col
          className={
            flatLoad + flatCar < TOULoad + TOUCar
              ? "resultsBoxGreen"
              : "resultsBox"
          }
        >
          <h4>Flat Cost</h4>
          <h6>House Cost: ${Math.round(flatLoad)}</h6>
          <h6>Bill Impact of Charging EV: ${Math.round(flatCar)}</h6>
          <h6>Flat Rate: ${Math.round(flatLoad + flatCar)}</h6>
        </Col>
        <Col
          className={
            flatLoad + flatCar > TOULoad + TOUCar
              ? "resultsBoxGreen"
              : "resultsBox"
          }
        >
          <h4>TOU Cost</h4>
          <h6>House Cost: ${Math.round(TOULoad)}</h6>
          <h6>Bill Impact of Charging EV: ${Math.round(TOUCar)}</h6>
          <h6>TOU Rate: ${Math.round(TOULoad + TOUCar)}</h6>
        </Col>
      </Row>

      <Row style={{ marginTop: "2em" }}>
        <Col>
          {flatLoad + flatCar < TOULoad + TOUCar ? (
            <h5>a Flat rate is the best option given your inputs</h5>
          ) : (
            <h5>a TOU rate is the best option given your inputs</h5>
          )}
        </Col>
      </Row>

      <Row style={{ marginTop: "2em" }}>
        <Col
          lg={{ span: 8, offset: 2 }}
          md={{ span: 8, offset: 2 }}
          sm={{ span: 12, offset: 0 }}
          xs={{ span: 12, offset: 0 }}
        >
          <button
            onClick={(e) => {
              e.preventDefault();
              props.changeDisplay();
            }}
            className="button1"
          >
            Go Back
          </button>
        </Col>
      </Row>
    </Container>
  );
}
