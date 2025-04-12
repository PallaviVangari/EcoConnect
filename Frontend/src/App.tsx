import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { AuthGuard } from './components/AuthGuard';
import  RegisterUser from './pages/RegisterUser';
import { Home } from './pages/Home';
import { Network } from './pages/Network';
import { Events } from './pages/Events';
import { Marketplace } from './pages/Marketplace';
import { Messages } from './pages/Messages';
import { Chatbot } from './pages/Chatbot';
import { Profile } from './pages/Profile';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <AuthGuard>
            <Layout />
            <RegisterUser />
          </AuthGuard>
        }>
          <Route index element={<Home />} />
          <Route path="network" element={<Network />} />
          <Route path="events" element={<Events />} />
          <Route path="marketplace" element={<Marketplace />} />
          <Route path="messages" element={<Messages />} />
          <Route path="chatbot" element={<Chatbot />} />
          <Route path="profile" element={<Profile />} />
        </Route>
        {/* Redirect to home page by default */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
