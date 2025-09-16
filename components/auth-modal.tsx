"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { X, Eye, EyeOff, Mail, User } from "lucide-react"
import { signIn } from "next-auth/react"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "login" | "register"
  onLogin?: () => void // Added callback for successful login
}

export default function AuthModal({ isOpen, onClose, initialMode = "login", onLogin }: AuthModalProps) {
  const [mode, setMode] = useState<"login" | "register">(initialMode)
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [acceptPrivacy, setAcceptPrivacy] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  if (!isOpen) return null

  const handleSocialLogin = (provider: string) => {
    console.log(`Login with ${provider}`)
    onLogin?.()
    onClose()
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    try {
      setSubmitting(true)
      if (mode === "register") {
        const res = await fetch("/api/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        })
        if (!res.ok) {
          const data = await res.json().catch(() => ({}))
          throw new Error(data.error || "Error al registrar")
        }
        // Auto sign-in after registration
        const result = await signIn("credentials", { redirect: false, email, password })
        if (result?.error) throw new Error("No se pudo iniciar sesión")
        onLogin?.()
        onClose()
      } else {
        const result = await signIn("credentials", { redirect: false, email, password })
        if (result?.error) throw new Error("Credenciales inválidas")
        onLogin?.()
        onClose()
      }
    } catch (err: any) {
      setError(err.message || "Algo salió mal")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-sm">M</span>
            </div>
            <span className="font-bold text-xl text-gray-900">magneto</span>
          </div>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={submitting}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="p-6">
          {mode === "login" ? (
            <>
              {/* Login Form */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¡Hola! Ingresa a tu cuenta</h2>
              </div>

              {/* Social Login Options */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">Con tus redes sociales:</p>
                <div className="space-y-3">
                  <Button
                    variant="outline"
                    className="w-full justify-start space-x-3 h-12 bg-transparent"
                    onClick={() => handleSocialLogin("LinkedIn")}
                    disabled={submitting}
                  >
                    <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">in</span>
                    </div>
                    <span>Ingresa con LinkedIn</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start space-x-3 h-12 bg-transparent"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled={submitting}
                  >
                    <div className="w-5 h-5 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <span>Ingresa con Facebook</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-start space-x-3 h-12 bg-transparent"
                    onClick={() => handleSocialLogin("Microsoft")}
                    disabled={submitting}
                  >
                    <div className="w-5 h-5 bg-orange-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">M</span>
                    </div>
                    <span>Ingresa con Microsoft</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="w-full justify-center space-x-3 h-12 bg-transparent"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={submitting}
                  >
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span>Acceder con Google</span>
                  </Button>
                </div>
              </div>

              {/* Email/Password Form */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">O con tu correo y contraseña:</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Escribe tu email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>

                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Escribe tu contraseña..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 h-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <div className="text-center">
                    <button type="button" className="text-sm text-blue-600 hover:underline">
                      Recuperar contraseña
                    </button>
                  </div>

                  <Button
                    type="submit"
                    className={`w-full h-12 ${email && password ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500"}`}
                    disabled={!email || !password || submitting}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {submitting ? "Cargando..." : "Continuar"}
                  </Button>
                </form>
              </div>

              {/* Other Options */}
              <div className="text-center mb-4">
                <button className="text-sm text-gray-600 hover:underline flex items-center justify-center w-full">
                  Otras opciones
                  <span className="ml-1">›</span>
                </button>
              </div>

              {/* Footer Links */}
              <div className="flex items-center justify-center space-x-4 text-sm">
                <button onClick={() => setMode("register")} className="text-blue-600 hover:underline flex items-center">
                  <User className="h-4 w-4 mr-1" />
                  Crea una cuenta
                </button>
                <span className="text-gray-400">|</span>
                <button className="text-blue-600 hover:underline">Ir a ver empleos</button>
              </div>
            </>
          ) : (
            <>
              {/* Register Form */}
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">¿Cómo deseas crear tu cuenta?</h2>
              </div>

              {/* Social Registration Options */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">Con tus redes sociales</p>
                <div className="grid grid-cols-3 gap-3">
                  <Button
                    variant="outline"
                    className="h-12 flex-col space-y-1 bg-transparent"
                    onClick={() => handleSocialLogin("LinkedIn")}
                    disabled={submitting}
                  >
                    <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">in</span>
                    </div>
                    <span className="text-xs">LinkedIn</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 flex-col space-y-1 bg-transparent"
                    onClick={() => handleSocialLogin("Facebook")}
                    disabled={submitting}
                  >
                    <div className="w-6 h-6 bg-blue-500 rounded flex items-center justify-center">
                      <span className="text-white text-xs font-bold">f</span>
                    </div>
                    <span className="text-xs">Facebook</span>
                  </Button>

                  <Button
                    variant="outline"
                    className="h-12 flex-col space-y-1 bg-transparent"
                    onClick={() => handleSocialLogin("Google")}
                    disabled={submitting}
                  >
                    <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                    <span className="text-xs">Google</span>
                  </Button>
                </div>
              </div>

              {/* Email Registration Form */}
              <div className="mb-6">
                <p className="text-sm text-gray-600 mb-4">O con tu correo electrónico</p>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      type="email"
                      placeholder="Escribe tu correo electrónico"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10 h-12"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Input
                      type={showPassword ? "text" : "password"}
                      placeholder="Escribe tu contraseña..."
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pr-10 h-12"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 top-2 h-8 w-8 p-0"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>

                  {/* Terms and Conditions */}
                  <div className="space-y-3">
                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="terms"
                        checked={acceptTerms}
                        onCheckedChange={(checked) => setAcceptTerms(checked as boolean)}
                      />
                      <label htmlFor="terms" className="text-sm text-gray-600 leading-relaxed">
                        He leído y autorizo el{" "}
                        <button type="button" className="text-blue-600 underline">
                          tratamiento de datos personales
                        </button>{" "}
                        de la plataforma
                      </label>
                    </div>

                    <div className="flex items-start space-x-2">
                      <Checkbox
                        id="privacy"
                        checked={acceptPrivacy}
                        onCheckedChange={(checked) => setAcceptPrivacy(checked as boolean)}
                      />
                      <label htmlFor="privacy" className="text-sm text-gray-600 leading-relaxed">
                        He leído y acepto los{" "}
                        <button type="button" className="text-blue-600 underline">
                          términos y Condiciones
                        </button>{" "}
                        de uso de la plataforma
                      </label>
                    </div>
                  </div>

                  {error && <p className="text-sm text-red-600">{error}</p>}

                  <Button
                    type="submit"
                    className={`w-full h-12 ${acceptTerms && acceptPrivacy && email ? "bg-blue-600 hover:bg-blue-700 text-white" : "bg-gray-300 text-gray-500"}`}
                    disabled={!acceptTerms || !acceptPrivacy || !email || submitting}
                  >
                    <User className="h-4 w-4 mr-2" />
                    {submitting ? "Cargando..." : "Crear cuenta"}
                  </Button>
                </form>
              </div>

              {/* Footer Link */}
              <div className="text-center">
                <span className="text-sm text-gray-600">¿Ya tienes una cuenta? </span>
                <button onClick={() => setMode("login")} className="text-sm text-blue-600 hover:underline">
                  Inicia sesión
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
