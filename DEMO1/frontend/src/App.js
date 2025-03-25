import React from 'react';
import InitialPage from './components/InitialPage';
import { AppProvider } from './context/AppContext';
const App = () => {
  return (
    <AppProvider>
      <InitialPage />
    </AppProvider>
  );
};

export default App;