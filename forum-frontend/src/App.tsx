import React from 'react';
import StoreProvider from './store/StoreProvider';
import { BrowserRouter as Router } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Header from './components/header/Header';
import './App.css';
import Content from './components/content/Content';

function App() {
  return (
    <div className="App">
      <StoreProvider>
        <Router>
          <Header />
            <Content />
        </Router>
      </StoreProvider>
    </div>
  );
}

export default App;
