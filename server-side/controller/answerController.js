const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");

// Function to get all answers for a specific question
async function getAnswersForQuestion(req, res) {
  const { question_id } = req.params; // Get question_id from the request parameters

  try {
    // Fetch all answers for the given question_id
    const [answers] = await dbConnection.query(
      "SELECT * FROM answerTable WHERE question_id = ? ORDER BY createdAt DESC",
      [question_id]
    );

    // If no answers found, return a 404 response
    if (answers.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No answers found for this question" });
        console.log("No answers found for this question");
    }

    // Return the answers for the question
    return res.status(StatusCodes.OK).json({ answers });
  } catch (error) {
    console.error("Error fetching answers:", error.stack);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

async function postAnswer(req, res) {
  const { user_id, answer } = req.body;
  const { question_id } = req.params;

  // Input validation
  if (!question_id || !user_id || !answer) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide question_id, user_id, and answer" });
  }

  if (typeof answer !== "string" || answer.trim().length === 0) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Answer must be a valid non-empty string" });
  }

  try {
    // Check if the question exists
    const [question] = await dbConnection.query(
      "SELECT * FROM questionTable WHERE question_id = ?",
      [question_id]
    );
    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question does not exist" });
    }

    // Check if the user exists
    const [user] = await dbConnection.query(
      "SELECT * FROM userTable WHERE user_id = ?",
      [user_id]
    );
    if (user.length === 0) {
      return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
    }

    // Insert answer into the database
    const [result] = await dbConnection.query(
      "INSERT INTO answerTable (question_id, user_id, answer, createdAt) VALUES (?, ?, ?, NOW())",
      [question_id, user_id, answer]
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Answer posted successfully",
      answer_id: result.insertId,
    });
  } catch (error) {
    console.error("Error posting answer:", error.stack);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}
// Function to post an answer for a specific question
// async function postAnswer(req, res) {
//   const { user_id, answer } = req.body;
//   const {question_id} = req.params;
//   // Input validation
//   if (!question_id || !user_id || !answer) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Please provide question_id, user_id, and answer" });
//   }

//   if (typeof answer !== "string" || answer.trim().length === 0) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Answer must be a valid non-empty string" });
//   }

//   // Validate question_id and user_id
//   if (typeof question_id !== "string" || isNaN(user_id)) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Invalid question_id or user_id format" });
//   }

//   try {
//     // Check if the question exists
//     const [question] = await dbConnection.query(
//       "SELECT * FROM questionTable WHERE question_id = ?",
//       [question_id]
//     );
//     if (question.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ msg: "Question does not exist" });
//     }

//     // Check if the user exists
//     const [user] = await dbConnection.query(
//       "SELECT * FROM userTable WHERE user_id = ?",
//       [user_id]
//     );
//     if (user.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
//     }

//     // Insert answer into the database
//     const [result] = await dbConnection.query(
//       "INSERT INTO answerTable (question_id, user_id, answer, createdAt) VALUES (?, ?, ?, NOW())",
//       [question_id, user_id, answer]
//     );

//     return res.status(StatusCodes.CREATED).json({
//       msg: "Answer posted successfully",
//       answer_id: result.insertId,
//     });
//   } catch (error) {
//     console.error("Error posting answer:", error.stack);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// }

// last commented it works with postman
// Function to post an answer for a specific question
// async function postAnswer(req, res) {
//   const { id, user_id, answer } = req.body;
//   const { question_id } = req.params; // ✅ Fix: Extract question_id correctly

//   // Input validation
//   if (!question_id || !id || !user_id || !answer) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Please provide question_id, user_id, and answer" });
//   }

//   if (typeof answer !== "string" || answer.trim().length === 0) {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Answer must be a valid non-empty string" });
//   }

//   // ✅ Fix: Remove isNaN(user_id) and check UUID format if applicable
//   if (typeof question_id !== "string" || typeof user_id !== "number") {
//     return res
//       .status(StatusCodes.BAD_REQUEST)
//       .json({ msg: "Invalid question_id or user_id format" });
//   }

//   try {
//     // Check if the question exists
//     const [question] = await dbConnection.query(
//       "SELECT * FROM questionTable WHERE question_id = ?",
//       [question_id]
//     );
//     if (question.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ msg: "Question does not exist" });
//     }

//     // Check if the user exists
//     const [user] = await dbConnection.query(
//       "SELECT * FROM userTable WHERE user_id = ?",
//       [user_id]
//     );
//     if (user.length === 0) {
//       return res.status(StatusCodes.NOT_FOUND).json({ msg: "User not found" });
//     }

//     // Insert answer into the database
//     const [result] = await dbConnection.query(
//       "INSERT INTO answerTable (id, question_id, user_id, answer, createdAt) VALUES (?, ?, ?, ?, NOW())",
//       [id, question_id, user_id, answer]
//     );

//     return res.status(StatusCodes.CREATED).json({
//       msg: "Answer posted successfully",
//       answer_id: result.insertId,
//     });
//   } catch (error) {
//     console.error("Error posting answer:", error.stack);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// }

// last commented




// Function to delete a specific answer posted by a user
async function deleteAnswer(req, res) {
  const { answer_id } = req.params; // Answer ID from URL parameter
  const { user_id } = req.body; // User ID from request body (authenticated user)

  try {
    // Check if the answer exists
    const [answer] = await dbConnection.query(
      "SELECT * FROM answerTable WHERE answer_id = ?",
      [answer_id]
    );
    if (answer.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Answer not found" });
    }

    // Check if the answer belongs to the user
    if (answer[0].user_id !== user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "You are not authorized to delete this answer",
      });
    }

    // Delete the answer
    await dbConnection.query("DELETE FROM answerTable WHERE answer_id = ?", [
      answer_id,
    ]);

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Answer deleted successfully" });
  } catch (error) {
    console.error("Error deleting answer:", error.stack);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

module.exports = { getAnswersForQuestion, postAnswer, deleteAnswer };
