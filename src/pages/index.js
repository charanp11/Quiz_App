import { useRouter } from 'next/router';
import { Container, Typography, Stack, Button } from '@mui/material';
import { motion } from 'framer-motion';

export default function Home() {
  const router = useRouter();

  const handleSelectDifficulty = (level) => {
    localStorage.setItem('selectedDifficulty', level);
    router.push('/quiz');
  };

  // Difficulty options
  const difficulties = [
    { label: 'Easy', color: '#66bb6a', hoverColor: '#57a05c', textColor: '#fff' },      // Green
    { label: 'Medium', color: '#fff276', hoverColor: '#f4e04d', textColor: '#333' },    // Light Yellow
    { label: 'Hard', color: '#ef5350', hoverColor: '#d84340', textColor: '#fff' },       // Reddish
    { label: 'Any', color: '#ba68c8', hoverColor: '#a052b2', textColor: '#333' } // Violet
  ];

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.6 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(to bottom right, #e0f7fa, #e1bee7)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px',
      }}
    >
      <Container maxWidth="sm" style={{ textAlign: 'center' }}>
        <Typography
          variant="h3"
          gutterBottom
          style={{
            fontWeight: 'bold',
            color: '#333',
            marginBottom: '40px',
          }}
        >
          Make Your Selection
        </Typography>

        <Stack spacing={3}>
          {difficulties.map((item, idx) => (
            <motion.div
              key={idx}
              whileHover={{
                scale: 1.05,
                backgroundColor: item.hoverColor,
              }}
              whileTap={{ scale: 0.95 }}
              style={{ borderRadius: '12px', overflow: 'hidden' }}
            >
              <Button
                fullWidth
                variant="contained"
                onClick={() => handleSelectDifficulty(item.label.includes('Any') ? 'Any' : item.label)}
                style={{
                  backgroundColor: item.color,
                  color: item.textColor,
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                  padding: '12px 0',
                  borderRadius: '12px',
                  boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.2)',
                  textTransform: 'uppercase',
                  transition: 'background-color 0.3s ease',
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = item.hoverColor)}
                onMouseLeave={(e) => (e.target.style.backgroundColor = item.color)}
              >
                {item.label}
              </Button>
            </motion.div>
          ))}
        </Stack>
      </Container>
    </motion.div>
  );
}
