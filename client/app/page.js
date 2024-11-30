import Navbar from '../components/Navbar';
import Header from '../components/Header';

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col px-5 py-4">
      <Navbar />
      <main className="flex-grow">
        <Header />
        {/* Add more sections or features here */}
      </main>
      <footer className="p-6 text-center">
        <p>&copy; 2024 BackMyGame - Built for Gamers on Linea Blockchain</p>
      </footer>
    </div>
  );
}
