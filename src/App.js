import { MainContent } from "./Components/MainContent/MainContent";
import { Outlet} from 'react-router-dom'

function App() {
  return (
    <div className="AppContent">
      <Outlet/>
    </div>
  );
}

export default App;
