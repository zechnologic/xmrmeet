import { BrowserRouter, Routes, Route } from "react-router";

import Home from "./page/Home.tsx";
import Login from "./page/Login.tsx";
import Signup from "./page/Signup.tsx";
import Account from "./page/Account.tsx";
import Meetup from "./page/Meetup.tsx";
import Map from "./page/Map.tsx";
import Privacy from "./page/Privacy.tsx";
import Terms from "./page/Terms.tsx";
import HowItWorks from "./page/HowItWorks.tsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/account" element={<Account />} />
        <Route path="/meet" element={<Meetup />} />
        <Route path="/map" element={<Map />} />
        <Route path="/how-it-works" element={<HowItWorks />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
