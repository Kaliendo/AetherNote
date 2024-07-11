import React from 'react';
import './App.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import IndexPage from './pages/index';
import NotePage from './pages/note';
import Footer from './components/ui/footer';

function App() {
  return (
    <Router>
      <div className="relative min-h-screen">
        <div className="pb-16">
          <Routes>
            <Route path="/" element={<IndexPage />} />
            <Route path="/note" element={<NotePage />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
