import { BrowserRouter, Routes, Route, useNavigate, useParams } from 'react-router-dom';
import { HomePage } from './pages/HomePage';
import { UniversityDetailPage } from './pages/UniversityDetailPage';
import { MajorDetailPage } from './pages/MajorDetailPage';
import { CombinedDetailPage } from './pages/CombinedDetailPage';
import Navbar from './components/Navbar';

function HomeWrapper() {
  const navigate = useNavigate();

  return (
    <HomePage
      onUniversityClick={(id) => navigate(`/university/${id}`)}
      onMajorClick={(id) => navigate(`/major/${id}`)}
      onCombinedClick={(u, m) => navigate(`/university/${u}/major/${m}`)}
    />
  );
}

function UniversityWrapper() {
  const { universityId } = useParams();
  const navigate = useNavigate();

  return (
    <UniversityDetailPage
      universityId={universityId!}
      onBack={() => navigate('/')}
      onMajorClick={(_, majorId) => navigate(`/university/${universityId}/major/${majorId}`)}
    />
  );
}

function MajorWrapper() {
  const { majorId } = useParams();
  const navigate = useNavigate();

  return (
    <MajorDetailPage
      majorId={majorId!}
      onBack={() => navigate('/')}
    />
  );
}

function CombinedWrapper() {
  const { universityId, majorId } = useParams();
  const navigate = useNavigate();

  return (
    <CombinedDetailPage
      universityId={universityId!}
      majorId={majorId!}
      onBack={() => navigate(`/university/${universityId}`)}
    />
  );
}

function App() {
  return (
    <BrowserRouter>
      <div>
        <Navbar />

        <Routes>
          <Route path="/" element={<HomeWrapper />} />
          <Route path="/university/:universityId" element={<UniversityWrapper />} />
          <Route path="/major/:majorId" element={<MajorWrapper />} />
          <Route path="/university/:universityId/major/:majorId" element={<CombinedWrapper />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
