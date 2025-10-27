import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { UniversityDetailPage } from './pages/UniversityDetailPage';
import { MajorDetailPage } from './pages/MajorDetailPage';
import { CombinedDetailPage } from './pages/CombinedDetailPage';
import { Navbar } from './components/Navbar';

type View =
  | { type: 'home' }
  | { type: 'university'; universityId: string }
  | { type: 'major'; majorId: string }
  | { type: 'combined'; universityId: string; majorId: string };

function App() {
  const [view, setView] = useState<View>({ type: 'home' });

  const handleUniversityClick = (universityId: string) => {
    setView({ type: 'university', universityId });
  };

  const handleMajorClick = (majorId: string) => {
    setView({ type: 'major', majorId });
  };

  const handleCombinedClick = (universityId: string, majorId: string) => {
    setView({ type: 'combined', universityId, majorId });
  };

  const handleBack = () => {
    setView({ type: 'home' });
  };

  const handleBackToUniversity = (universityId: string) => {
    setView({ type: 'university', universityId });
  };

  return (
    <div>
      <Navbar
        onHomeClick={() => setView({ type: 'home' })}
        onLoginClick={() => alert('Login feature coming soon!')}
      />

      {/* Page content */}
      {view.type === 'home' && (
        <HomePage
          onUniversityClick={handleUniversityClick}
          onMajorClick={handleMajorClick}
          onCombinedClick={handleCombinedClick}
        />
      )}

      {view.type === 'university' && (
        <UniversityDetailPage
          universityId={view.universityId}
          onBack={handleBack}
          onMajorClick={(_, majorId) => handleCombinedClick(view.universityId, majorId)}
        />
      )}

      {view.type === 'major' && (
        <MajorDetailPage
          majorId={view.majorId}
          onBack={handleBack}
        />
      )}

      {view.type === 'combined' && (
        <CombinedDetailPage
          universityId={view.universityId}
          majorId={view.majorId}
          onBack={() => handleBackToUniversity(view.universityId)}
        />
      )}
    </div>
  );
}

export default App;
