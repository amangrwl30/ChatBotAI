import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      {/* Your other providers */}
      <div className="app">
        <CRMChatbot />
        {/* Other components */}
      </div>
    </AppProvider>
  );
}

export default App; 