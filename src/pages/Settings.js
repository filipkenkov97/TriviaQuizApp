import { useState } from "react";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";

import { Box } from "@mui/system";
import { Button, Typography } from "@mui/material";

import { handleDifficultyChange } from "../redux/actions";

const Settings = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("easy");
  const history = useHistory();
  const dispatch = useDispatch();

  const difficultyOptions = [
    { id: "easy", name: "Go easy on me" },
    { id: "medium", name: "Bring it on" },
    { id: "hard", name: "Insanity mood" },
  ];

  const handleClick = () => {
    dispatch(handleDifficultyChange(selectedDifficulty));
    history.push("/questions");
  };

  return (
    <>
      <Typography variant="h2" fontWeight="bold">
        TriviaTime
      </Typography>
      <Typography variant="h5" fontWeight="bold">
        Pick your level of difficulty
      </Typography>
      <Box mt={3} width="100%">
      {difficultyOptions.map((option) => (
          <Button
            key={option.id}
            onClick={() => {
              setSelectedDifficulty(option.id);
            }}
            variant="contained"
            fullWidth
            color={selectedDifficulty === option.id ? "secondary" : "primary"}
          >
            {option.name}
          </Button>
        ))}
        <Button
          onClick={handleClick}
          fullWidth
          variant="contained"
          color="secondary"
        >
          Play Now
        </Button>
      </Box>
    </>
  );
};

export default Settings;