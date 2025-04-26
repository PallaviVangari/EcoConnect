import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth0 } from "@auth0/auth0-react";
import { Home } from "./pages/Home";
import { Network } from "./pages/Network";
import { Events } from "./pages/Events";
import { Marketplace } from "./pages/Marketplace";
import { Messages } from "./pages/Messages";
import { Chatbot } from "./pages/Chatbot";
import { Profile } from "./pages/Profile";
import { Login } from "./pages/Login";
import { Welcome } from "./pages/Welcome.tsx";
import { Layout } from "./components/Layout.tsx";

function App() {
    const { isAuthenticated, isLoading } = useAuth0();

    if (isLoading) {
        return <div>Loading...</div>;
    }

    return (
        <BrowserRouter>
            <Routes>
                {/* When user visits root / */}
                <Route path="/" element={<Welcome />} />
                <Route path="/login" element={<Login />} />

                {/* Layout pages that need login */}
                <Route element={<Layout />}>
                    <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
                    <Route path="/network" element={<RequireAuth><Network /></RequireAuth>} />
                    <Route path="/events" element={<RequireAuth><Events /></RequireAuth>} />
                    <Route path="/marketplace" element={<RequireAuth><Marketplace /></RequireAuth>} />
                    <Route path="/messages" element={<RequireAuth><Messages /></RequireAuth>} />
                    <Route path="/chatbot" element={<RequireAuth><Chatbot /></RequireAuth>} />
                    <Route path="/profile" element={<RequireAuth><Profile /></RequireAuth>} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </BrowserRouter>
    );
}

function RequireAuth({ children }: { children: React.ReactNode }) {
    const { isAuthenticated } = useAuth0();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return <>{children}</>;
}

export default App;
