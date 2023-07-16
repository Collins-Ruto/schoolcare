import express from "express";
import { GraphQLClient, request, gql } from "graphql-request";
import dotenv from "dotenv";

dotenv.config();

const graphqlAPI = "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cle2syke34vja01um747d0nxv/master"  || process.env.GRAPHCMS_API ;

const router = express.Router();

router.post("/", async (req, res) => {
  // Read variables sent via POST from our SDK
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const getStudents = async () => {
    console.log("initiated");

    try {
      const query = gql`
        query MyQuery {
          studentsConnection(first: 20, orderBy: publishedAt_ASC) {
            edges {
              node {
                admissionId
                name
                slug
                exams {
                  examDate
                  id
                  name
                  results
                  slug
                  term
                }
                fees {
                  amount
                  payday
                  type
                  term
                  slug
                }
                stream {
                  ... on Stream {
                    slug
                    name
                  }
                }
              }
            }
          }
        }
      `;

      const result = await request(graphqlAPI, query);

      return result.studentsConnection.edges;
    } catch (error) {
      console.log(error.message);
    }
  };

  const studentsarr = await getStudents();

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

  studentsarr.forEach((student) => {
    if (`1*${student.node.admissionId}` === text) {
      if ((student.node.exams).length < 1) {
        response = `END Your results have not been uploaded`;
      } else {
        response = `CON Input year and semester`;
      }
    }
  });

  studentsarr.forEach(async (student) => {
    const id = student.node.admissionId;
    student.node.exams.length &&
      student.node.exams.forEach((exam) => {
        // given text is something like 1*14*2021i
        const orgText = `${id}${text}`;
        const parts = orgText.split("*");

        const year = parts[2]; // ie. 2021i

        // combine to form 1*14*142021i ie. id and year and semester as saved in DB
        const convertedDate = `1*${parts[1]}*${id}${year ? year : 0}`;

        if (`1*${id}*${exam.slug}` === convertedDate) {
          const results = exam.results;
          // clean useless data
          delete results["0"];
          delete results["1"];

          const formatResult = Object.keys(results)
            .map((key) => `${key}: ${results[key]}`)
            .join("\n");

          response = `END ${student.node.name} \n Your ${exam.term} results are: \n ${formatResult} `;
        }

        // convert ie 1*14*2021i to 1*14*20 
        const part2 = year?.substring(0, 2) || 0;
        console.log("part2", part2);
        // check if results exist but not for the specific year and semester
        if (
          `1*${id}*20` === `1*${parts[1]}*${part2}` &&
          `1*${id}*${exam.slug}` !== convertedDate
        ) {
          response = `END Your results for ${year} have not been uploaded`;
        }
      });

    if (`2*${id}` === text) {
      console.log("text", text);
      console.log("text 2", `2*${id}`);
      const fees = student.node.fees;
      let invoice = 0;
      let credit = 0;

      fees.forEach((fee) => {
        fee.type === "invoice"
          ? (invoice += parseFloat(fee.amount))
          : (credit += parseFloat(fee.amount));
      });

      const feeBlc = (invoice - credit).toString();
      console.log("fees", feeBlc)
      response = `END ${student.node.name} \n Your fee Balance is: \n KES ${feeBlc} `;
    }
  });

  // Print the response onto the page so that our SDK can read it
  res.set("Content-Type: text/plain");
  res.send(response);
  // DONE!!!
});

export default router;
