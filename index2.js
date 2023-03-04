import express from "express";
import { GraphQLClient, request, gql } from "graphql-request";

const router = express.Router();

router.post("/", (req, res) => {
  // Read variables sent via POST from our SDK
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const students = [
    {
      adm: "12",
      name: "John Doe",
      feeBlc: "10000",
      results: [
        { sem: "1.1", value: "\n \n chem1: 76, \n algebra1: 81 " },
        { sem: "1.2", value: "\n \n Physics: 76, \n Calculus: 81 " },
        { sem: "2.1", value: "\n \n statistics: 76, \n ode: 6779 " },
        { sem: "2.2", value: "\n \n solids: 76, \n electronics: 81 " },
      ],
    },
    {
      adm: "13",
      name: "Mike Pence",
      feeBlc: "30000",
      results: [
        { sem: "1.1", value: "\n \n chem1: 76, \n algebra1: 6779 " },
        { sem: "1.2", value: "\n \n Physics: 79, \n Calculus: 81 " },
        { sem: "2.1", value: "\n \n statistics: 76, \n ode: 81 " },
        { sem: "2.2", value: "\n \n solids: 6779, \n electronics: 79 " },
      ],
    },
    {
      adm: "14",
      name: "Mary Jane",
      feeBlc: "-5000",
      results: [
        { sem: "1.1", value: "\n \n chem1: 806779, \n algebra1: 81 " },
        { sem: "1.2", value: "\n \n Physics: 76, \n Calculus: 81 " },
        { sem: "2.1", value: "\n \n statistics: 76, \n ode: 79 " },
        { sem: "2.2", value: "\n \n solids: 79, \n electronics: 81 " },
      ],
    },
  ];

  console.log("####################", req.body);
  let response = "";

  switch (text) {
    case "":
      response = `CON What would you like to check
      1. Results
      2. Fee Balance
      `;
      break;
    case "1":
      response = ` CON Enter admission number
      `;
      break;

    case "2":
      response = ` CON Enter Admission number
      `;
      break;

    case "1*1":
      response = `CON Input year and semester
      `;
      break;

    default:
      response = `CON What would you like to check
      1. Results
      2. Fees
      `;
      break;
  }

  students.forEach((student) => {
    if (`1*${student.adm}` === text) {
      response = `CON Input year and semester`;
    }
  });

  students.forEach((student) => {
    student.results.forEach((result) => {
      if (`1*${student.adm}*${result.sem}` === text) {
        const results = result.value;
        response = `END ${student.name} \n Your results are: ${results} `;
      }
    });

    if (`2*${student.adm}` === text) {
      const fees = student.feeBlc.toString();
      response = `END ${student.name} \n Your fee Balance is: \n KES ${fees} `;
    }
  });

  // Print the response onto the page so that our SDK can read it
  res.set("Content-Type: text/plain");
  res.send(response);
  // DONE!!!
});

export default router;
