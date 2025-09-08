"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { User, Briefcase, Heart, Bookmark, Clock, FileText, Settings, HelpCircle, LogOut } from "lucide-react"

interface UserMenuProps {
  onLogout: () => void
}

export default function UserMenu({ onLogout }: UserMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="relative">
      {/* User Avatar Button */}
      <Button
        variant="ghost"
        size="sm"
        className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 p-0"
        onClick={() => setIsOpen(!isOpen)}
      >
        <User className="h-5 w-5 text-gray-600" />
      </Button>

      {/* Dropdown Menu */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />

          {/* Menu Content */}
          <div className="absolute right-0 top-12 w-64 bg-white rounded-lg shadow-lg border z-50 py-2">
            {/* User Avatar in Menu */}
            <div className="flex justify-center py-4 border-b">
              <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                <User className="h-6 w-6 text-gray-600" />
              </div>
            </div>

            {/* Empleos Section */}
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Empleos</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  <Briefcase className="h-4 w-4" />
                  <span>Ver todos</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  <Heart className="h-4 w-4" />
                  <span>Sugeridos</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  <Bookmark className="h-4 w-4" />
                  <span>Guardados</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  <Clock className="h-4 w-4" />
                  <span>En proceso</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t mx-4 my-2" />

            {/* Mi cuenta Section */}
            <div className="px-4 py-2">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Mi cuenta</h3>
              <div className="space-y-1">
                <button className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  <FileText className="h-4 w-4" />
                  <span>Hoja de vida</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  <Settings className="h-4 w-4" />
                  <span>Configuración</span>
                </button>
                <button className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded">
                  <HelpCircle className="h-4 w-4" />
                  <span>Ayuda</span>
                </button>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t mx-4 my-2" />

            {/* Logout */}
            <div className="px-4 py-2">
              <button
                onClick={onLogout}
                className="w-full flex items-center space-x-3 px-2 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded"
              >
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
