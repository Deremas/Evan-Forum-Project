const dbConnection = require("../db/dbConfig");
const { StatusCodes } = require("http-status-codes");
const { v4: uuidv4 } = require("uuid");

// Function to post a new question
async function postQuestion(req, res) {
  const { title, question_description, user_id, tag } = req.body;

  if (!title || !question_description || !user_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide title, description, and user_id" });
  }
if (title?.trim().length > 200) {
  return res
    .status(StatusCodes.BAD_REQUEST)
    .json({ msg: "Title cannot exceed 200 characters." });
}
  const question_id = uuidv4();

  try {
    // Insert the new question into the database
    const [result] = await dbConnection.query(
      "INSERT INTO questionTable (question_id, user_id, title, question_description, tag) VALUES (?, ?, ?, ?, ?)",
      [question_id, user_id, title, question_description, tag]
    );

    return res.status(StatusCodes.CREATED).json({
      msg: "Question created successfully",
      question_id: result.insertId, // Using the generated question_id
    });
  } catch (error) {
    console.error("Error posting question:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

// Function to get all questions
// async function getAllQuestions(req, res) {
//   try {
//     // Fetch all questions from the database
//     const [questions] = await dbConnection.query(
//       "SELECT * FROM questionTable ORDER BY createdAt DESC"
//     );
//     // If no questions found, return a 404 response
//     if (questions.length === 0) {
//       return res
//         .status(StatusCodes.NOT_FOUND)
//         .json({ msg: "No questions found" });
//     }
// // Fetch all questions from the database
//     const [user] = await dbConnection.query(
//       "SELECT * FROM userTable WHERE user_name=? "
//     );

//     // Return the list of questions
//     return res.status(StatusCodes.OK).json({ questions });
//   } catch (error) {
//     console.error("Error fetching questions:", error.message);
//     return res
//       .status(StatusCodes.INTERNAL_SERVER_ERROR)
//       .json({ msg: "Something went wrong, try again later!" });
//   }
// }
async function getAllQuestions(req, res) {
  try {
    // Fetch all questions with the corresponding user names
    const [questions] = await dbConnection.query(
      `SELECT questionTable.*, userTable.user_name 
       FROM questionTable
       JOIN userTable ON questionTable.user_id = userTable.user_id
       ORDER BY createdAt DESC`
    );

    // If no questions found, return a 404 response
    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "No questions found" });
    }

    // Return the list of questions along with the user_name
    return res.status(StatusCodes.OK).json({ questions });
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

// Function to get a single question by ID
async function getQuestionById(req, res) {
  const { question_id } = req.params; // Match the table's column name

  try {
    // Fetch the question by ID
    const [questions] = await dbConnection.query(
      "SELECT * FROM questionTable WHERE question_id = ?",
      [question_id]
    );

    if (questions.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    return res.status(StatusCodes.OK).json({ question: questions[0] });
  } catch (error) {
    console.error("Error fetching question:", error.message);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

// Function to delete a question
async function deleteQuestion(req, res) {
  const { question_id } = req.params; // Question ID from URL parameter
  const { user_id } = req.body; // User ID from request body (authenticated user)

  try {
    // Check if the question exists
    const [question] = await dbConnection.query(
      "SELECT * FROM questionTable WHERE question_id = ?",
      [question_id]
    );
    if (question.length === 0) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ msg: "Question not found" });
    }

    // Check if the question belongs to the user
    if (question[0].user_id !== user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "You are not authorized to delete this question",
      });
    }

    // Delete the question
    await dbConnection.query(
      "DELETE FROM questionTable WHERE question_id = ?",
      [question_id]
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Question deleted successfully" });
  } catch (error) {
    console.error("Error deleting question:", error.stack);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

// Function to update a question
async function updateQuestion(req, res) {
  const { question_id } = req.params; // Question ID from URL parameter
  const { title, question_description, tag, user_id } = req.body; // New values and user_id (authenticated user)

  if (!title || !question_description || !user_id) {
    return res
      .status(StatusCodes.BAD_REQUEST)
      .json({ msg: "Please provide title, description, and user_id" });
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
        .json({ msg: "Question not found" });
    }

    // Check if the question belongs to the user
    if (question.user_id !== user_id) {
      return res.status(StatusCodes.FORBIDDEN).json({
        msg: "You are not authorized to update this question",
      });
    }

    // Update the question
    await dbConnection.query(
      "UPDATE questionTable SET title = ?, question_description = ?, tag = ? WHERE question_id = ?",
      [title, question_description, tag, question_id]
    );

    return res
      .status(StatusCodes.OK)
      .json({ msg: "Question updated successfully" });
  } catch (error) {
    console.error("Error updating question:", error.stack);
    return res
      .status(StatusCodes.INTERNAL_SERVER_ERROR)
      .json({ msg: "Something went wrong, try again later!" });
  }
}

module.exports = {
  postQuestion,
  getAllQuestions,
  getQuestionById,
  deleteQuestion,
  updateQuestion,
};
