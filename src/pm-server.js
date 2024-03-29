import express from "express";
import dotenv from "dotenv";
// import { getAllExams } from "./controllers/ExamController.js";
import { getAllStudents } from "./controllers/StudentController.js";
import { getAllLessons } from "./controllers/LessonController.js";

dotenv.config();

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

  const register = [];

  // const allExams = await getAllExams();
  const allStudents = await getAllStudents();
  const allLessons = await getAllLessons();

  // console.log("all exams", allExams);
  // console.log("all lessons", allLessons);
  // console.log("all students", allStudents);

  console.log("####################", req.body);
  let response = "";

  // match users selection. first request is ""

  switch (text) {
    case "":
      response = `CON What would you like to check
      1. Results
      2. Fee Balance
      3. Classes Today
      `;
      break;
    case "1" || "2" || "3":
      response = `CON Enter admission number
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
      3. Classes Today
      `;
      break;
  }

  const textParts = text.split("*");
  const textCheck = textParts[0]; // ie 1 for results
  const textStudentId = textParts[1]; // ie 14 for admissionId 14

  function processRequest() {
    if (textStudentId) {
      const student = allStudents.find(
        (student) => student.admissionId === textStudentId
      );

      // Check is student exists in DB using ADM ID

      if (!student) {
        response = `END Invalid Admission ID\nPlease enter a valid Admission ID\nor contact your college administrator.`;
        return;
      }

      const id = student.admissionId;

      // Get Check if user's exam results exist per ADM ID

      if (`1*${student.admissionId}` === text) {
        if (student.exams.length < 1) {
          response = `END Your results have not been uploaded`;
        } else {
          response = `CON Input year and semester`;
        }
      }

      // Get user's exam results per ADM ID

      if ("1" === textCheck) {
        student.exams.some((exam) => {
          const orgText = `${id}${text}`;
          const parts = orgText.split("*");
          // given text is something like 1*14*2021i

          const year = parts[2]; // ie. 2021i

          // combine to form 1*14*142021i ie. id and year and semester as saved in DB
          const convertedDate = `1*${parts[1]}*${id}${year ? year : 0}`;

          console.log("match", convertedDate === `1*${id}*${exam.slug}`);

          if (`1*${id}*${exam.slug}` === convertedDate) {
            const results = exam.results;

            const formatResult = results
              .map((result) => `${result.slug}: ${result.marks}`)
              .join("\n");

            response = `END ${student.name} \n Your ${exam.term} results are: \n ${formatResult} `;
            return true;
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
      }

      // Get user's fee balance per ADM ID

      if (`2` === textCheck) {
        console.log("text", text);
        console.log("text 2", `2*${id}`);
        const fees = student.fees;
        let invoice = 0;
        let credit = 0;

        fees.forEach((fee) => {
          fee.type === "invoice"
            ? (invoice += parseFloat(fee.amount))
            : (credit += parseFloat(fee.amount));
        });

        const feeBlc = (invoice - credit).toString();
        console.log("fees", feeBlc);
        response = `END ${student.name} \n Your fee Balance is: \n KES ${feeBlc} `;
      }

      // Get Lessons per user's Stream

      if (`3` === textCheck) {
        console.log("text 3", text);
        console.log("text 3", `3*${id}`);
        let myLessons = "subject      teacher     start     end\n";
        allLessons.forEach((lesson) => {
          if (lesson.stream.slug === student.stream.slug) {
            myLessons =
              myLessons +
              `${lesson.subject.name}  ${lesson.teacher.name}  ${lesson.startTime}  ${lesson.endTime}\n`;
          }
        });

        response = `END ${student.name} \nYour lessons for today are: \n${myLessons} `;
      }

      if (`4*${id}` === text) {
        console.log("text 4", text);
        console.log("text 4", `4*${id}`);
        let myUnits =
          'Type the number of units to be registered separated by comma. \n Type "all" to register  all \n';
        units.forEach((unit, index) => {
          myUnits = myUnits + ` ${unit}${index % 2 === 0 ? " " : " \n"}`;
        });
        response = `CON ${student.name} \n ${myUnits} `;
      }

      if (`5*${id}` === text) {
        console.log("text 4", `4*${id}`);
        register.forEach((sdt) => {
          if (id === sdt.id) {
            response = `END ${student.name} \n ${sdt.units} `;
          }
        });
      }

      const resText = text.split("*");

      if (resText[0] === "4" && resText[2]) {
        // console.log("parts 4", text.split("*"));
        // console.log("text 4", `${resText[2]}`);
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
    }
  }

  processRequest();

  // Print the response onto the page so that our SDK can read it
  console.log("response", response);
  res.set("Content-Type: text/plain");
  res.send(response);
  // DONE!!!
});

export default router;
