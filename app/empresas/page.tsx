"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Star, Users, MessageSquare, Eye, ArrowLeft, Building, Mail, Lock } from "lucide-react"
import Link from "next/link"
import { useSession, signIn, signOut } from "next-auth/react"

export default function EmpresasPage() {
  const { data: session } = useSession()
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loginData, setLoginData] = useState({ email: "", password: "" })

  // When session changes, set logged state
  useEffect(() => {
    if (session) {
      setIsLoggedIn(true)
    } else {
      setIsLoggedIn(false)
    }
  }, [session])

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulamos login exitoso
    setIsLoggedIn(true)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setLoginData({ email: "", password: "" })
  }

  // Opiniones dinámicas desde el backend
  const [opiniones, setOpiniones] = useState<any[]>([]);
  const companyName = "EAFIT" // usar nombre de la empresa del usuario logueado
  useEffect(() => {
    fetch(`/api/feedback?company=${encodeURIComponent(companyName)}`)
      .then((res) => res.json())
      .then((data) => {
        setOpiniones(
          (data.feedbacks || []).map((f: any) => ({
            id: f.id,
            comentario: f.text,
            fecha: f.createdAt,
            rating: f.rating,
          }))
        )
      })
  }, [])

  const [estadisticas, setEstadisticas] = useState({ totalOpiniones: 0, ratingPromedio: 0, candidatosActivos: 0, vistasEmpresa: 0 })
  useEffect(() => {
    fetch(`/api/stats?company=${encodeURIComponent(companyName)}`)
      .then((res) => res.json())
      .then((data) => setEstadisticas(data))
  }, [])

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        {/* Header */}
        <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
                <ArrowLeft className="h-5 w-5" />
                <span>Volver</span>
              </Link>
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-sm">M</span>
                </div>
                <span className="font-bold text-xl text-gray-900">magneto</span>
                <span className="text-blue-600 font-medium">empresas</span>
              </div>
            </div>
          </div>
        </header>

        {/* Login Section */}
        <div className="flex items-center justify-center min-h-[calc(100vh-80px)] px-4">
          <div className="max-w-md w-full">
            <Card className="shadow-xl">
              <CardHeader className="text-center pb-6">
                <div className="flex items-center justify-center space-x-2 mb-4">
                  <Building className="h-8 w-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-2xl font-bold text-gray-900">Portal Empresas</CardTitle>
                    <p className="text-gray-600 text-sm mt-1">Accede a tu dashboard empresarial</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email empresarial</label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="email"
                        placeholder="empresa@ejemplo.com"
                        className="pl-10"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Contraseña</label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                      <Input
                        type="password"
                        placeholder="••••••••"
                        className="pl-10"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>
                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700">
                    Iniciar Sesión
                  </Button>
                </form>
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-600">
                    ¿No tienes cuenta empresarial?{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Regístrate aquí
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-2 text-gray-600 hover:text-gray-900">
              <ArrowLeft className="h-5 w-5" />
              <span>Volver</span>
            </Link>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-sm">M</span>
              </div>
              <span className="font-bold text-xl text-gray-900">magneto</span>
              <span className="text-blue-600 font-medium">empresas</span>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-600">TechCorp S.A.S</span>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              Cerrar Sesión
            </Button>
          </div>
        </div>
      </header>

      {/* Dashboard */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard Empresarial</h1>
          <p className="text-gray-600">Gestiona las opiniones y feedback de tus candidatos y empleados</p>
        </div>

        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <MessageSquare className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.totalOpiniones}</p>
                  <p className="text-sm text-gray-600">Total Opiniones</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Star className="h-8 w-8 text-yellow-500" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.ratingPromedio}</p>
                  <p className="text-sm text-gray-600">Rating Promedio</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Users className="h-8 w-8 text-green-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.candidatosActivos.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Candidatos Activos</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center space-x-2">
                <Eye className="h-8 w-8 text-purple-600" />
                <div>
                  <p className="text-2xl font-bold text-gray-900">{estadisticas.vistasEmpresa.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Vistas Empresa</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Opiniones de Usuarios */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MessageSquare className="h-5 w-5" />
              <span>Opiniones Recientes de Usuarios</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {opiniones.length === 0 ? (
                <p className="text-gray-500">No hay opiniones aún.</p>
              ) : (
                opiniones.map((opinion) => (
                  <div key={opinion.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 font-semibold text-sm">AN</span>
                        </div>
                        <div>
                          <h4 className="font-semibold text-gray-900">Opinión Anónima</h4>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {opinion.rating ? (
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${i < opinion.rating ? "text-yellow-400 fill-current" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                        ) : null}
                        <Badge variant="secondary" className="text-xs">
                          {new Date(opinion.fecha).toLocaleDateString()}
                        </Badge>
                      </div>
                    </div>
                    <p className="text-gray-700 leading-relaxed">{opinion.comentario}</p>
                  </div>
                ))
              )}
            </div>

            <div className="mt-6 text-center">
              <Button variant="outline">Ver Todas las Opiniones</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
