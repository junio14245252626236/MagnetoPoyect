"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, MapPin, Building, Users, Briefcase, ChevronDown, ChevronRight, ArrowLeft } from "lucide-react"
import ChatWidget from "@/components/chat-widget"
import UserMenu from "@/components/user-menu"
import Link from "next/link"

export default function EmpleosPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(true) // Assuming user is logged in to see this page

  const handleLogout = () => {
    setIsLoggedIn(false)
  }

  // Mock data for locations and job offers
  const locations = [
    { name: "Antioquia", jobs: 66363 },
    { name: "Cundinamarca", jobs: 49213 },
    { name: "Cauca", jobs: 27768 },
    { name: "Atlántico", jobs: 17817 },
    { name: "Santander", jobs: 16268 },
    { name: "Risaralda", jobs: 0 },
  ]

  const jobOffers = [
    { title: "Ofertas de empleo en Medellín, Antioquia", jobs: 20315 },
    { title: "Ofertas de empleo en Itagüí, Antioquia", jobs: 5461 },
    { title: "Ofertas de empleo en Envigado, Antioquia", jobs: 5028 },
    { title: "Ofertas de trabajo en Antioquia sin experiencia", jobs: 5389 },
    { title: "Ofertas de empleo en Bello, Antioquia", jobs: 4663 },
    { title: "Ofertas de empleo en Sabaneta, Antioquia", jobs: 4455 },
    { title: "Trabajo sin experiencia en Medellín", jobs: 4218 },
    { title: "Ofertas de empleo en La Estrella, Antioquia", jobs: 3816 },
    { title: "Ofertas de empleo en Rionegro, Antioquia", jobs: 3703 },
    { title: "Ofertas de empleo en Caldas, Antioquia", jobs: 2694 },
    { title: "Ofertas de empleo en Copacabana, Antioquia", jobs: 2284 },
    { title: "Ofertas de empleo en La Ceja, Antioquia", jobs: 1462 },
    { title: "Ofertas de empleo en Girardota, Antioquia", jobs: 1443 },
    { title: "Ofertas de empleo en Guarne, Antioquia", jobs: 1315 },
    { title: "Trabajo sin experiencia en Envigado", jobs: 1162 },
    { title: "Trabajo sin experiencia en Itagüí", jobs: 1129 },
    { title: "Ofertas de empleo en Marinilla, Antioquia", jobs: 974 },
    { title: "Ofertas de empleo en Barbosa, Antioquia", jobs: 947 },
    { title: "Trabajo sin experiencia en Girardota", jobs: 567 },
  ]

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          {/* Top bar with social links */}
          <div className="flex items-center justify-between py-2 text-sm">
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Personas</span>
              <Button variant="ghost" size="sm" className="text-gray-600 p-0 h-auto">
                Negocios y pymes <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-600 p-0 h-auto">
                Corporativos <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </div>
            <div className="flex items-center space-x-4 text-gray-600">
              <span>📷</span>
              <span>📘</span>
              <span>💼</span>
              <span>📺</span>
              <span>🎵</span>
              <span>Blog</span>
              <Button variant="ghost" size="sm" className="text-gray-600 p-0 h-auto">
                Ayuda <ChevronDown className="h-3 w-3 ml-1" />
              </Button>
            </div>
          </div>

          {/* Main header */}
          <div className="flex items-center justify-between py-2">
            <div className="flex items-center space-x-8">
              <Link href="/">
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Volver</span>
                </Button>
              </Link>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-xl text-gray-900">magneto</span>
                <span className="text-green-500 font-medium">empleos</span>
              </div>

              <div className="flex-1 relative max-w-md">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar empleo por ciudad, cargo, empresa o profesión"
                  className="pl-10 h-10 text-sm"
                />
              </div>

              <Button variant="ghost" className="flex items-center space-x-1">
                <span>Empleos</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
            </div>

            <UserMenu onLogout={handleLogout} />
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="border-b border-gray-200 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center space-x-8 py-3">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-blue-600 border-b-2 border-blue-600 rounded-none pb-3"
            >
              <MapPin className="h-4 w-4" />
              <span>Empleos por ubicación</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Building className="h-4 w-4" />
              <span>Empleos por cargo</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Briefcase className="h-4 w-4" />
              <span>Empleos por sector laboral</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <Users className="h-4 w-4" />
              <span>Empleos por empresa</span>
            </Button>
            <Button variant="ghost" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <span>Todos los empleos</span>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              {locations.map((location, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 border-b border-gray-100 last:border-b-0"
                >
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                    <div>
                      <div className="font-medium text-gray-900">{location.name}</div>
                      <div className="text-sm text-gray-500">{location.jobs.toLocaleString()} cupos</div>
                    </div>
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400" />
                </div>
              ))}
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-gray-900">Empleos por ubicación</h1>
              <Button variant="outline" className="flex items-center space-x-2 bg-transparent">
                <span>Ver empleos por ubicación</span>
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>

            {/* Job Offers Grid */}
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
              {jobOffers.map((offer, index) => (
                <div
                  key={index}
                  className="bg-white border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                >
                  <h3 className="font-medium text-gray-900 mb-2 text-sm leading-tight">{offer.title}</h3>
                  <p className="text-sm text-gray-500">{offer.jobs.toLocaleString()} cupos</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Chat Widget */}
      <ChatWidget />
    </div>
  )
}
