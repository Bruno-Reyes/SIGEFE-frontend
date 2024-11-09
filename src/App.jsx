import "primereact/resources/themes/bootstrap4-light-purple/theme.css";
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons
import "primeflex/primeflex.css"; // flex

// Login
import Login from "./modules/ALC000_sistema_base/components/Login";

function App() {
  return (
    <div className="App">
      <Login />
    </div>
  );
}

export default App;
