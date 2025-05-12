import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { motion, AnimatePresence } from 'framer-motion';
import { Button, Container, Typography, Stack, Card, CardContent } from '@mui/material';
import { MathJax } from 'better-react-mathjax';
import questionsData from '../../data/questions.json';

const MotionButton = motion(Button);

export default function Quiz() {
  const [difficulty, setDifficulty] = useState('Any');
  const [timer, setTimer] = useState(0); // Global timer
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});

  const router = useRouter();

  const handleSubmit = useCallback(() => {
    localStorage.setItem('selectedAnswers', JSON.stringify(selectedAnswers));
    localStorage.setItem('selectedQuestions', JSON.stringify(questions));
    router.push('/result');
  }, [selectedAnswers, questions, router]);

  useEffect(() => {
    const diff = localStorage.getItem('selectedDifficulty');
    setDifficulty(diff || 'Any');

    let filteredQuestions = [];
    if (diff === 'Any') {
      filteredQuestions = questionsData;
    } else {
      filteredQuestions = questionsData.filter(
        (q) => q['Difficulty Level'].toLowerCase() === diff.toLowerCase()
      );
    }

    const selected = filteredQuestions.sort(() => 0.5 - Math.random()).slice(0, 4);
    setQuestions(selected);
    localStorage.setItem('selectedQuestions', JSON.stringify(selected));

    // Set Global Timer based on difficulty
    if (diff === 'Easy') setTimer(120); // 2 minutes
    else if (diff === 'Medium') setTimer(180); // 3 minutes
    else setTimer(240); // 4 minutes
  }, []);

  useEffect(() => {
    if (questions.length === 0) return;

    const countdown = setInterval(() => {
      setTimer((prevTimer) => {
        if (prevTimer <= 1) {
          clearInterval(countdown);
          handleSubmit();
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [questions.length, handleSubmit]);

  const handleSelectAnswer = (index) => {
    setSelectedAnswers((prev) => ({ ...prev, [currentQuestionIndex]: index }));
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  if (questions.length === 0) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  const currentQuestion = questions[currentQuestionIndex];

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <Container maxWidth="md" style={{ marginTop: '40px' }}>
      <Typography variant="h5" color="error" gutterBottom>
        Time Left: {formatTime(timer)}
      </Typography>

      <motion.div
        key={currentQuestionIndex}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -30 }}
        transition={{ duration: 0.5 }}
      >
        <Card style={{ marginBottom: '20px', padding: '20px', boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}>
          <CardContent>
            <Typography
              variant="h6"
              style={{
                fontWeight: 600,
                fontSize: '1rem',
                lineHeight: 1.5,
                marginBottom: '20px',
                overflowWrap: 'break-word',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center'
              }}
            >
              <span style={{ marginRight: '8px' }}>
                Q{currentQuestionIndex + 1}:
              </span>
              <MathJax dynamic inline={false}>
                {currentQuestion.Question}
              </MathJax>
            </Typography>

            <Stack spacing={1.5}>
              <AnimatePresence>
                {[1, 2, 3, 4].map((opt, index) => (
                  <motion.div
                    key={opt}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ delay: index * 0.1, duration: 0.2 }}
                    whileTap={{ scale: 0.70 }}
                  >
                    <Button
                      variant={selectedAnswers[currentQuestionIndex] === opt ? 'contained' : 'outlined'}
                      fullWidth
                      onClick={() => handleSelectAnswer(opt)}
                      style={{ textTransform: 'none', whiteSpace: 'normal', wordBreak: 'break-word' }}
                    >
                      <MathJax dynamic inline={true}>
                        {currentQuestion[`Option ${opt}`]}
                      </MathJax>
                    </Button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </Stack>
          </CardContent>
        </Card>
      </motion.div>

      <Stack direction="row" spacing={2} justifyContent="space-between" style={{ marginTop: '20px' }}>
        <motion.div whileTap={{ scale: 0.75 }}>
          <Button variant="outlined" onClick={handlePrevious} disabled={currentQuestionIndex === 0}>
            Previous
          </Button>
        </motion.div>

        {currentQuestionIndex === questions.length - 1 ? (
          <motion.div whileTap={{ scale: 0.75 }}>
            <Button variant="contained" color="success" onClick={handleSubmit}>
              Submit
            </Button>
          </motion.div>
        ) : (
          <motion.div whileTap={{ scale: 0.75 }}>
            <Button variant="contained" onClick={handleNext}>
              Next
            </Button>
          </motion.div>
        )}
      </Stack>
    </Container>
  );
}
