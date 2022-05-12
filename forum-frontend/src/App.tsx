import { ThemeContext } from './store/StoreProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header/Header';
import Content from './components/content/Content';
import { useContext } from 'react';

function App() {
  const { theme } = useContext(ThemeContext)
  return (
      <div className="App" style={{minHeight: '100vh', backgroundColor: theme.backgroundColor, width: '100%'}}> 
        <Router>
          <Header />
          <Content />
        </Router>
      </div>    
  );
}

export default App;
