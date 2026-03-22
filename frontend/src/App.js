import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Header from "./components/Header";
import Footer from "./components/Footer";
import CartPage from "./components/CartPage";
import HomePage from "./components/HomePage";
import PaginaProdus from "./components/PaginaProdus";
import WishlistPage from "./components/WishlistPage";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import Cont from "./components/Cont";
import Comenzi from "./components/Comenzi";
import Facturare from "./components/Facturare";
import AdminPage from "./components/AdminPage";
import AdminProduseList from "./components/AdminProduseList";
import AdminProdusEdit from "./components/AdminProdusEdit";
import AdminAlegeProdusEdit from "./components/AdminAlegeProdusEdit";
import AdminProdusAdauga from "./components/AdminProdusAdauga";
import AdminAlegeProdusStergere from "./components/AdminAlegeProdusStergere";
import AdminComenziList from "./components/AdminComenziList";
import AdminComandaEdit from "./components/AdminComandaEdit";
import AiBuilderPage from "./components/AiBuilderPage";

function RequireAdmin({ children }) {
  const u = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = u && u.rol === "ADMIN";
  return isAdmin ? children : <Navigate to="/" replace />;
}

function App() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Router>
      <Header onSearch={setSearchTerm} />

      <Routes>
        <Route path="/" element={<HomePage searchTerm={searchTerm} />} />
        <Route path="/cos" element={<CartPage />} />
        <Route path="/produs/:id" element={<PaginaProdus />} />
        <Route path="/wishlist" element={<WishlistPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/cont" element={<Cont />} />
        <Route path="/comenzi" element={<Comenzi />} />
        <Route path="/facturare" element={<Facturare />} />

        <Route path="/ai-builder" element={<AiBuilderPage />} />

        {/* ADMIN */}
        <Route
          path="/admin"
          element={
            <RequireAdmin>
              <AdminPage />
            </RequireAdmin>
          }
        />

        {/* subrute admin */}
        <Route
          path="/admin/produse"
          element={
            <RequireAdmin>
              <AdminProduseList />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/produse/adauga"
          element={
            <RequireAdmin>
              <AdminProdusAdauga />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/produse/editare"
          element={
            <RequireAdmin>
              <AdminAlegeProdusEdit />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/produse/edit/:id"
          element={
            <RequireAdmin>
              <AdminProdusEdit />
            </RequireAdmin>
          }
        />
        <Route
          path="/admin/produse/stergere"
          element={
            <RequireAdmin>
              <AdminAlegeProdusStergere />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/comenzi"
          element={
            <RequireAdmin>
              <AdminComenziList />
            </RequireAdmin>
          }
        />

        <Route
          path="/admin/comenzi/edit/:id"
          element={
            <RequireAdmin>
              <AdminComandaEdit />
            </RequireAdmin>
          }
        />

      </Routes>

      <Footer />
    </Router>
  );
}

export default App;
