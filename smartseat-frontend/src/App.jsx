import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import AdminRoute from './components/AdminRoute.jsx';
import { AuthProvider } from './context/AuthContext.jsx';
import { BookingProvider } from './context/BookingContext.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Movies from './pages/Movies.jsx';
import MovieDetails from './pages/MovieDetails.jsx';
import SeatSelection from './pages/SeatSelection.jsx';
import BookingSummary from './pages/BookingSummary.jsx';
import Payment from './pages/Payment.jsx';
import BookingConfirmation from './pages/BookingConfirmation.jsx';
import MyBookings from './pages/MyBookings.jsx';
import Admin from './pages/Admin.jsx';

function App() {
    return (
        <BrowserRouter>
            <AuthProvider>
                <BookingProvider>
                    <div className="app-shell">
                        <Navbar />
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/movies" element={<Movies />} />
                            <Route path="/movies/:movieId" element={<MovieDetails />} />
                            <Route path="/shows/:showId/seats" element={<SeatSelection />} />
                            <Route element={<ProtectedRoute />}>
                                <Route path="/booking-summary" element={<BookingSummary />} />
                                <Route path="/payment" element={<Payment />} />
                                <Route path="/booking-confirmation" element={<BookingConfirmation />} />
                                <Route path="/my-bookings" element={<MyBookings />} />
                            </Route>
                            <Route element={<AdminRoute />}>
                                <Route path="/admin" element={<Admin />} />
                            </Route>
                        </Routes>
                    </div>
                </BookingProvider>
            </AuthProvider>
        </BrowserRouter>
    );
}

export default App;