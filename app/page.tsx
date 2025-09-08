"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Building, Users, Briefcase, ChevronDown } from "lucide-react"
import ChatWidget from "@/components/chat-widget"
import AuthModal from "@/components/auth-modal"
import UserMenu from "@/components/user-menu"
import Link from "next/link"

export default function Home() {
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "register">("login")
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode)
    setAuthModalOpen(true)
  }

  const handleLogin = () => {
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-8">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900">magneto</span>
              {isLoggedIn && <span className="text-green-500 font-medium">empleos</span>}
            </div>

            {isLoggedIn ? (
              <div className="hidden md:flex items-center space-x-6">
                <div className="flex-1 relative max-w-md">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Buscar empleo por ciudad, cargo, empresa o profesión"
                    className="pl-10 h-10 text-sm"
                  />
                </div>
                <a href="/empleos">
                  <Button variant="ghost" className="flex items-center space-x-1">
                    <span>Empleos</span>
                    <ChevronDown className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            ) : (
              <nav className="hidden md:flex space-x-6">
                <a href="#" className="text-gray-600 hover:text-gray-900">
                  Buscar empleos
                </a>
                <Link href="/empresas" className="text-gray-600 hover:text-gray-900">
                  Empresas y candidatos
                </Link>
              </nav>
            )}
          </div>

          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <UserMenu onLogout={handleLogout} />
            ) : (
              <>
                <span className="text-sm text-gray-600">Español</span>
                <Button variant="outline" size="sm" onClick={() => openAuthModal("login")}>
                  Iniciar sesión
                </Button>
                <Button size="sm" className="bg-green-500 hover:bg-green-600" onClick={() => openAuthModal("register")}>
                  Crear cuenta
                </Button>
              </>
            )}
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
                <span className="text-blue-600">+100.000</span> trabajos disponibles
              </h1>
              <p className="text-xl text-gray-600 mb-8">
                para temporada <span className="text-blue-600 underline cursor-pointer">¡conócelos y aplica!</span>
              </p>

              {/* Search Bar */}
              <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row gap-4">
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input placeholder="Buscar empleo por ciudad, cargo, empresa o profesión" className="pl-10 h-12" />
                  </div>
                  <Button className="bg-blue-600 hover:bg-blue-700 h-12 px-8">BUSCAR</Button>
                </div>
              </div>

              {/* Quick Categories */}
              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <MapPin className="h-4 w-4" />
                  <span>Ciudades</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <Building className="h-4 w-4" />
                  <span>Sector laboral</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <Users className="h-4 w-4" />
                  <span>Cargo profesional</span>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 border-gray-300 hover:bg-gray-50 bg-transparent"
                >
                  <Briefcase className="h-4 w-4" />
                  <span>Empresas</span>
                </Button>
              </div>
            </div>

            {/* Hero Image */}
            <div className="relative">
              <div className="bg-slate-900 rounded-2xl p-8 text-white relative">
                <div className="mb-4 relative z-10">
                  <div className="w-16 h-16 bg-slate-700 rounded-lg flex items-center justify-center mb-4">
                    <span className="text-2xl text-white">📊</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-slate-100">Análisis de perfil</h3>
                  <p className="text-sm text-slate-200">Descubre qué tan compatible eres con las ofertas de trabajo</p>
                </div>
                <div className="absolute bottom-4 right-4">
                  <img
                    src="/professional-businesswoman.png"
                    alt="Professional woman"
                    className="w-32 h-40 object-cover rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Gift Banner */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 py-4">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between text-white">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🎁</span>
            </div>
            <div>
              <h3 className="font-semibold">¡Regala un empleo!</h3>
              <p className="text-sm opacity-90">Conoce el futuro de las mejores oportunidades que están esperando.</p>
            </div>
          </div>
          <Button variant="secondary" size="sm">
            Ver más
          </Button>
        </div>
      </section>

      {/* Employer Section */}
      <section className="bg-slate-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-slate-900 font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-xl">magneto</span>
              </div>
              <h2 className="text-3xl font-bold mb-4">
                ¿Quieres encontrar el <span className="text-blue-400">mejor talento para tu empresa?</span>
              </h2>
              <p className="text-gray-300 mb-6">
                Hazlo con Magneto.
                <br />
                El software de reclutamiento para pymes.
              </p>
              <Button className="bg-blue-600 hover:bg-blue-700">Publica ofertas de empleo GRATIS</Button>
            </div>
            <div className="relative">
              <img
                src="/recruitment-software-dashboard-interface.jpg"
                alt="Magneto dashboard"
                className="w-full rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Companies Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-12">¿Te imaginas trabajar en las mejores empresas?</h2>

          {/* Company Logos Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center opacity-60">
            {[
              "Sura",
              "Banco",
              "Starbucks",
              "WOM",
              "Comfama",
              "KPMG",
              "Carvajal",
              "Tigo",
              "Cueros Vélez",
              "Ford",
              "Claro",
              "Enel",
              "Federación",
              "Semana",
              "RCN",
              "Audifarma",
              "Avianca",
              "GCO",
              "SENA",
              "Microware",
              "Colsubsidio",
              "Compensar",
            ].map((company, index) => (
              <div key={index} className="h-12 flex items-center justify-center">
                <span className="text-gray-500 font-medium text-sm">{company}</span>
              </div>
            ))}
          </div>

          <div className="mt-12">
            <Button variant="outline" className="border-gray-800 text-gray-800 bg-transparent">
              Crea una cuenta sin gratis
            </Button>
          </div>
        </div>
      </section>

      {/* Preparation Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">¡Prepárate para tu próximo empleo!</h2>
          <p className="text-gray-600 mb-12">
            Estudia una especialización o una maestría y destaca en el mercado laboral
          </p>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-yellow-400 rounded-lg p-6 text-left">
              <h3 className="font-bold text-lg mb-2">Especializaciones</h3>
              <p className="text-sm mb-4">FORMACIÓN Y CAPACITACIÓN 100% VIRTUALES</p>
              <div className="bg-white rounded p-4">
                <img
                  src="/online-education-illustration.png"
                  alt="Online education"
                  className="w-full h-20 object-cover rounded"
                />
              </div>
            </div>

            <div className="bg-red-500 rounded-lg p-6 text-left text-white">
              <h3 className="font-bold text-lg mb-2">Maestrías y MBAs</h3>
              <p className="text-sm mb-4">con reconocimiento internacional</p>
              <div className="bg-white rounded p-4">
                <img
                  src="/mba-graduation-illustration.jpg"
                  alt="MBA graduation"
                  className="w-full h-20 object-cover rounded"
                />
              </div>
            </div>

            <div className="bg-blue-600 rounded-lg p-6 text-left text-white">
              <h3 className="font-bold text-lg mb-2">Cursos</h3>
              <p className="text-sm mb-4">Desarrolla nuevas habilidades</p>
              <div className="bg-white rounded p-4">
                <img
                  src="/online-courses-illustration.jpg"
                  alt="Online courses"
                  className="w-full h-20 object-cover rounded"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* English Level Section */}
      <section className="bg-gradient-to-r from-purple-700 to-purple-900 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center text-white">
            <div>
              <h2 className="text-3xl font-bold mb-4">
                Si tienes un nivel de inglés
                <br />
                intermedio-avanzado
              </h2>
              <p className="text-purple-200 mb-6">¡Tenemos oportunidades para ti!</p>
              <Button className="bg-white text-purple-700 hover:bg-gray-100">Conoce las vacantes</Button>
            </div>
            <div className="relative">
              <div className="w-48 h-48 mx-auto">
                <img
                  src="/smiling-headset-woman.png"
                  alt="Professional with headset"
                  className="w-full h-full object-cover rounded-full border-4 border-white/20"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Visibility Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-12">
            En solo unos pasos, te haremos visible para las empresas líderes del mercado
          </h2>

          <div className="bg-gradient-to-br from-purple-600 to-purple-800 rounded-2xl p-12 text-white relative overflow-hidden">
            <div className="relative z-10">
              <h3 className="text-4xl font-bold mb-4">
                ¿Qué tan <span className="text-green-400">compatible</span>
                <br />
                eres con tu trabajo ideal?
              </h3>
              <div className="flex items-center justify-center space-x-2 mt-8">
                <div className="w-8 h-8 bg-white rounded flex items-center justify-center">
                  <span className="text-purple-700 font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-xl">magneto</span>
                <span className="text-green-400 font-bold">empleos</span>
              </div>
            </div>

            {/* Decorative gauge */}
            <div className="absolute right-8 top-1/2 transform -translate-y-1/2">
              <div className="w-32 h-32 relative">
                <img src="/compatibility-gauge-meter-green.jpg" alt="Compatibility gauge" className="w-full h-full" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Chat Widget */}
      <ChatWidget />

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        initialMode={authMode}
        onLogin={handleLogin}
      />
    </div>
  )
}
