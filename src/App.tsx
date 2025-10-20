import { useState } from 'react';
import { HomePage } from './pages/HomePage';
import { UniversityDetailPage } from './pages/UniversityDetailPage';
import { MajorDetailPage } from './pages/MajorDetailPage';
import { CombinedDetailPage } from './pages/CombinedDetailPage';

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

  if (view.type === 'university') {
    return (
      <UniversityDetailPage
        universityId={view.universityId}
        onBack={handleBack}
        onMajorClick={(_, majorId) => handleCombinedClick(view.universityId, majorId)}
      />
    );
  }

  if (view.type === 'major') {
    return (
      <MajorDetailPage
        majorId={view.majorId}
        onBack={handleBack}
      />
    );
  }

  if (view.type === 'combined') {
    return (
      <CombinedDetailPage
        universityId={view.universityId}
        majorId={view.majorId}
        onBack={() => handleBackToUniversity(view.universityId)}
      />
    );
  }

  return (
    <HomePage
      onUniversityClick={handleUniversityClick}
      onMajorClick={handleMajorClick}
      onCombinedClick={handleCombinedClick}
    />
  );
}

export default App;
