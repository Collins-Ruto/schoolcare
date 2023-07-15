import express from "express";
import { GraphQLClient, request, gql } from "graphql-request";
import dotenv from "dotenv";

dotenv.config();

const graphqlAPI =
  "https://api-eu-central-1-shared-euc1-02.hygraph.com/v2/cle2syke34vja01um747d0nxv/master" ||
  process.env.GRAPHCMS_API;

const router = express.Router();

router.post("/", async (req, res) => {
  // Read variables sent via POST from our SDK
  const { sessionId, serviceCode, phoneNumber, text } = req.body;

  const units = [
    "1. Chemistry 1",
    "2. Algebra 1",
    "3. Calculus 1",
    "4. Electronics 1",
    "5. Physics 1",
    "6. Programming",
  ];
  const units2 = [
    "1. Chemistry 2",
    "2. Solids 1",
    "3. Materials 1",
    "4. Power 1",
    "5. Research Methods",
    "6. Computer systems",
  ];
  const register = [];

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

  const getLessons = async (req, res) => {
    try {
      const query = gql`
        query MyQuery {
          lessonsConnection(first: 20, orderBy: publishedAt_ASC) {
            edges {
              node {
                day
                endTime
                id
                startTime
                stream {
                  ... on Stream {
                    name
                    slug
                  }
                }
                subject {
                  ... on Subject {
                    name
                    slug
                  }
                }
                teacher {
                  ... on Teacher {
                    name
                    slug
                  }
                }
              }
            }
          }
        }
      `;

      const result = await request(graphqlAPI, query);

      return result.lessonsConnection.edges;
    } catch (error) {
      console.log(error.message);
    }
  };

  const studentsarr = await getStudents();
  const lessonsarr = await getLessons();

  console.log("####################", req.body);
  let response = "";

  switch (text) {
    case "":
      response = `CON What would you like to check
      1. Results
      2. Fee Balance
      3. Classes Today
      4. Unit Registration
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

    case "3":
      response = ` CON Enter Admission number
      `;
      break;

    case "4":
      response = ` CON Enter Admission number
      `;
      break;
    case "5":
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
      if (student.node.exams.length < 1) {
        response = `END Your results have not been uploaded`;
      } else {
        response = `CON Input year and semester`;
      }
    }
  });

  studentsarr.forEach(async (student) => {
    const id = student.node.admissionId;
    const orgText = `${id}${text}`;
    const parts = orgText.split("*");
    student.node.exams.length &&
      student.node.exams.forEach((exam) => {
        // given text is something like 1*14*2021i

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
      console.log("fees", feeBlc);
      response = `END ${student.node.name} \n Your fee Balance is: \n KES ${feeBlc} `;
    }

    if (`3*${id}` === text) {
      console.log("text 3", text);
      console.log("text 3", `3*${id}`);
      let myLessons = "subject      teacher     start     end\n";
      lessonsarr.forEach((lesson) => {
        if (lesson.node.stream.slug === student.node.stream.slug) {
          myLessons =
            myLessons +
            `${lesson.node.subject.name}  ${lesson.node.teacher.name}  ${lesson.node.startTime}  ${lesson.node.endTime}\n`;
        }
      });

      response = `END ${student.node.name} \n Your lessons for today are: \n ${myLessons} `;
    }

    if (`4*${id}` === text) {
      console.log("text 4", text);
      console.log("text 4", `4*${id}`);
      let myUnits =
        'Type the number of units to be registered separated by comma. \n Type "all" to register  all \n';
      units.forEach((unit, index) => {
        myUnits = myUnits + ` ${unit}${index % 2 === 0 ? " " : " \n"}`;
      });
      response = `CON ${student.node.name} \n ${myUnits} `;
    }

    if (`5*${id}` === text) {
      console.log("text 4", `4*${id}`);
      register.forEach((sdt) => {
        if (id === sdt.id) {
          response = `END ${student.node.name} \n ${sdt.units} `;
        }
      });
    }

    const resText = text.split("*");

    if (resText[2]) {
      console.log("parts 4", text.split("*"));
      console.log("text 4", `${resText[2]}`);
      let textUnits = resText[2].split(",");
      let regUnits = "";
      textUnits.forEach((unit) => {
        regUnits = regUnits + units[unit - 1];
      });
      console.log("reg units", regUnits);
      register.push({ id: id, units: regUnits });
      if (resText[2] === "all") {
        register.push({ id: id, units: units });
      }
      response = `END Success `;
    }
  });

  // Print the response onto the page so that our SDK can read it
  res.set("Content-Type: text/plain");
  res.send(response);
  // DONE!!!
});

export default router;
