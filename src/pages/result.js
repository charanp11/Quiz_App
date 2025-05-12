import { useEffect, useState } from 'react';
import { Container, Typography, Card, CardContent, Button, Stack } from '@mui/material';
import { useRouter } from 'next/router';
import { MathJax } from 'better-react-mathjax';
import { motion } from 'framer-motion';

export default function Result() {
  const [questions, setQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [score, setScore] = useState(0);

  const router = useRouter();

  useEffect(() => {
    const savedQuestions = JSON.parse(localStorage.getItem('selectedQuestions'));
    const savedAnswers = JSON.parse(localStorage.getItem('selectedAnswers'));
    if (savedQuestions && savedAnswers) {
      setQuestions(savedQuestions);
      setSelectedAnswers(savedAnswers);

      let correct = 0;
      savedQuestions.forEach((q, idx) => {
        if (savedAnswers[idx] === q['Correct Option']) {
          correct++;
        }
      });
      setScore(correct);
    }
  }, []);

  const handleRestart = () => {
    localStorage.removeItem('selectedAnswers');
    localStorage.removeItem('selectedQuestions');
    localStorage.removeItem('selectedDifficulty');
    router.push('/');
  };

  const formatAnswer = (optNumber, questionObj) => {
    const optionText = questionObj[`Option ${optNumber}`];
    if (!optionText) return "No Answer";
    return <MathJax inline dynamic>{optionText}</MathJax>;
  };

  const percentage = ((score / questions.length) * 100).toFixed(2);

  if (questions.length === 0) {
    return <Typography variant="h5">Loading...</Typography>;
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.8 }}>
      <Container maxWidth="lg" style={{ marginTop: '40px' }}>
        <Typography variant="h4" align="center" gutterBottom>
          Quiz Results
        </Typography>

        {score === questions.length && (
          <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ duration: 0.5 }}>
            <Typography variant="h5" align="center" color="success.main">
              🎉 Congratulations! Perfect Score! 🎉
            </Typography>
          </motion.div>
        )}

        <Typography variant="h6" align="center" gutterBottom>
          Total Score: {score} / {questions.length} ({percentage}%)
        </Typography>

        <Stack spacing={2} style={{ marginTop: '30px' }}>
          {questions.map((q, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.1 }}>
              <Card style={{ padding: '16px', boxShadow: '0px 2px 8px rgba(0,0,0,0.1)' }}>
                <CardContent>
                  <Typography variant="subtitle1" style={{ fontWeight: 600, lineHeight: 1.6, display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                    <span style={{ marginRight: '8px' }}>Q{idx + 1}:</span>
                    <MathJax dynamic inline={false}>
                      {q.Question}
                    </MathJax>
                  </Typography>

                  <Typography variant="body2" style={{ marginTop: '6px' }}>
                    Difficulty: {q['Difficulty Level']}
                  </Typography>

                  <Typography variant="body2" style={{ marginTop: '10px' }}>
                    Your Answer: <strong>{formatAnswer(selectedAnswers[idx], q)}</strong>
                  </Typography>

                  <Typography variant="body2" style={{ marginTop: '5px' }}>
                    Correct Answer: <strong>{formatAnswer(q['Correct Option'], q)}</strong>
                  </Typography>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </Stack>

        <Stack direction="row" justifyContent="center" marginTop={4}>
          <motion.div whileTap={{ scale: 0.9 }}>
            <Button variant="contained" color="primary" onClick={handleRestart}>
              Restart Quiz
            </Button>
          </motion.div>
        </Stack>
      </Container>
    </motion.div>
  );
}
