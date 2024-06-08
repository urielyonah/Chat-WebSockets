import React from 'react';
import { Chat } from './components/Chat';
import './App.css'

function App() {
  return (
    <div className="App">
      <main className="body">
        <div className="Chat">
          <Chat />
        </div>
      </main>
    </div>
  );
}

export default App;