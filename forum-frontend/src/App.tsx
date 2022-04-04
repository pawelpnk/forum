import React from 'react';
import StoreProvider from './store/StoreProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './header/Header';

function App() {
  return (
    <div className="App">
      <StoreProvider>
        <Router>
          <Header />
          
        </Router>
      </StoreProvider>
    </div>
  );
}

export default App;
