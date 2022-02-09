import { Button, CircularProgress, Typography } from "@mui/material";
import { Box } from "@mui/system";
import { decode } from "html-entities";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { useHistory } from "react-router";
import useAxios from "../hooks/useAxios";
import { handleScoreChange } from "../redux/actions";

const getRandomInt = (max) => {
  return Math.floor(Math.random() * Math.floor(max));
};

const Questions = () => {
  const {
    question_category,
    question_difficulty,
    question_type,
    amount_of_question,
    score,
  } = useSelector((state) => state);
  const history = useHistory();
  const dispatch = useDispatch();

  let apiUrl = `/api.php?amount=10`;
  if (question_category) {
    apiUrl = apiUrl.concat(`&category=${question_category}`);
  }
  if (question_difficulty) {
    apiUrl = apiUrl.concat(`&difficulty=${question_difficulty}`);
  }
  if (question_type) {
    apiUrl = apiUrl.concat(`&type=${question_type}`);
  }

  const { response, loading } = useAxios({ url: apiUrl });
  const [currentQuestion, setCurrentQuestion] = useState({
    index: 0,
    isAnswered: false,
    isCorrect: false,
  });
  const [options, setOptions] = useState([]);

  useEffect(() => {
    if (response?.results.length) {
      const question = response.results[currentQuestion.index];
      let answers = [...question.incorrect_answers];
      answers.splice(
        getRandomInt(question.incorrect_answers.length),
        0,
        question.correct_answer
      );
      setOptions(answers);
    }
  }, [response, currentQuestion.index]);

  if (loading) {
    return (
      <Box mt={20}>
        <CircularProgress />
      </Box>
    );
  }

  const handleClickAnswer = (e) => {
    const question = response.results[currentQuestion.index];
    const isCorrectAnswer = e.target.textContent === question.correct_answer;
    if (isCorrectAnswer) {
      setCurrentQuestion((currQuestion) => ({
        ...currQuestion,
        isAnswered: true,
        isCorrect: true,
      }));
      dispatch(handleScoreChange(score + 1));
    } else {
      setCurrentQuestion((currQuestion) => ({
        ...currQuestion,
        isAnswered: true,
        isCorrect: false,
      }));
    }
  };

  return (
    <Box>
      <Typography variant="h4">
        Questions {currentQuestion.index + 1}
      </Typography>
      {currentQuestion.isAnswered && (
        <>
          <Typography mt={5}>
            {currentQuestion.isCorrect ? "correct" : "incorrect"}
          </Typography>
          <Button
            color="secondary"
            variant="contained"
            onClick={() => {
              if (currentQuestion.index + 1 < response.results.length) {
                setCurrentQuestion((currQuestion) => ({
                  index: currQuestion.index + 1,
                  isAnswered: false,
                  isCorrect: false,
                }));
              } else {
                history.push("/finalscreen");
              }
            }}
          >
            Next
          </Button>
        </>
      )}
      {!currentQuestion.isAnswered && (
        <>
          <Typography mt={5}>
            {decode(response.results[currentQuestion.index].question)}
          </Typography>
          {options.map((data, id) => (
            <Box mt={2} key={id}>
              <Button
                onClick={handleClickAnswer}
                variant="contained"
                color="secondary"
              >
                {decode(data)}
              </Button>
            </Box>
          ))}
        </>
      )}
      <Box mt={5}>
        Score: {score} / {response.results.length}
      </Box>
    </Box>
  );
};

export default Questions;