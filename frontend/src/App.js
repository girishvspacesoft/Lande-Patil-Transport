import { useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Layout from './components/Layout/Layout'
import './App.css';
import CustomRoutes from './routes/routes';

function App() {
  useEffect(() => {
    document.title = process.env.REACT_APP_TITLE;
  }, []);

  const theme = createTheme({
    typography: {
      fontFamily: [
        'Roboto',
      ].join(','),
    },
    palette: {
      mode: 'light',
      primary: {
        main: '#1e1e1e',
        light: '#494949',
        dark: '#000000',
        contrastText: '#fff'
      },
      text: {
        primary: 'rgba(0, 0, 0, 0.87)',
        secondary: 'rgba(0, 0, 0, 0.6)',
        disabled: 'rgba(0, 0, 0, 0.38)',
      }
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <Layout>
        <CustomRoutes />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
