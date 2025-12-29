import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import { Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon } from "lucide-react"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)

  const handleLogin = useCallback(async () => {
    setLoading(true)
    setError("")
    setErrorAlert(false)
    
    try {
      const res = await axios.post("http://localhost:8000/api/auth/login", { email, password })
      const { accessToken, userId, userRole } = res.data

      localStorage.setItem("token", accessToken)
      localStorage.setItem("id", userId)
      localStorage.setItem("role", userRole)
      login(accessToken, userId, userRole)
      
      // CAMBIO: Navegamos inmediatamente, sin esperar ni mostrar alertas
      navigate("/dashboard")
      
    } catch (err) {
      console.log(err)
      setErrorAlert(true)
      // Solo quitamos el loading si hubo error, para que el usuario pueda intentar de nuevo.
      // Si hubo éxito, dejamos el loading puesto mientras cambia de página para que se vea fluido.
      setLoading(false) 
      setTimeout(() => {
        setErrorAlert(false)
      }, 3000)
    } 
    // NOTA: Quitamos el 'finally' para que, en caso de éxito, el spinner NO desaparezca 
    // antes de cambiar de página. React desmontará el componente al navegar.
  }, [email, password, login, navigate])

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-sm p-8 bg-gray-800 rounded-2xl shadow-lg space-y-6 text-gray-100">
        <h1 className="text-2xl font-bold text-center text-white ">Iniciar Sesión</h1>

        {error && <p className="text-red-500 text-center text-sm">{error}</p>}

        <div className="space-y-4">
          <div>
            <Label className="text-gray-300 py-3">Email</Label>
            <Input
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400"
            />
          </div>

          <div>
            <Label className="text-gray-300 py-3">Contraseña</Label>
            <div className="relative">
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="placeholder-gray-400 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </div>

        <Button
          onClick={handleLogin}
          disabled={loading || !email || !password}
          className="w-full bg-cyan-600 hover:bg-cyan-500 text-white"
        >
          {loading ? "Cargando..." : "Iniciar Sesión"}
        </Button>

        <p className="text-center text-sm text-gray-400">
          ¿No tienes cuenta?{" "}
          <Link to="/register" className="text-cyan-400 hover:underline">
            Regístrate
          </Link>
        </p>
        
        {/* Eliminamos la alerta de éxito porque ya no se verá (cambiamos de página muy rápido) */}
        
        {errorAlert && (
          <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white z-[10000]">
            <AlertCircleIcon />
            <AlertTitle>Error al iniciar sesión</AlertTitle>
            <AlertDescription>
              Credenciales incorrectas o error de conexión.
            </AlertDescription>
          </Alert>
        )}
      </div>

      <LoadingOverlay isVisible={loading} message="Iniciando sesión..." />
    </div>
  )
}

export default LoginPage