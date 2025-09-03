import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Provider } from 'react-redux';
import { store } from './store';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Exercises from './pages/Exercises';
import Workouts from './pages/Workouts';
import Profile from './pages/Profile';
import Training from './pages/Training';
import Shop from './pages/Shop';

function App() {
  return (
    <Provider store={store}>
      <Router>
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors">
          <Navbar />
          <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/exercises" element={<Exercises />} />
              <Route path="/workouts" element={<Workouts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/training/:workoutId" element={<Training />} />
              <Route path="/shop" element={<Shop />} />
            </Routes>
          </main>
        </div>
      </Router>
    </Provider>
  );
}

export default App;