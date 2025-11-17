import { useState, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useNavigate, Link } from "react-router-dom"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import { Eye, EyeOff } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"

const LoginPage = () => {
  const navigate = useNavigate()
  const login = useAuthStore((s) => s.login)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [success, setSuccess]=useState(false)
  const [errorAlert, setErrorAlert]=useState(false)

  const handleLogin = useCallback(async () => {
  setLoading(true)
  setError("")
  try {
    const res = await axios.post("http://localhost:8000/api/auth/login", { email, password })

    const { accessToken, userId } = res.data

    localStorage.setItem("token", accessToken)
    localStorage.setItem("id", userId)
    login(accessToken, userId)
    setSuccess(true)
    setTimeout(()=>{
      setSuccess(false);
      navigate("/dashboard")
    }, 2000)
    
  } catch (err) {
    console.log(error)
    setErrorAlert(true)
    setTimeout(()=>{
      setErrorAlert(false)
    }, 3000)
  } finally {
    setLoading(false)
  }
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
        {success && (
          <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
            <CheckCircle2Icon />
            <AlertTitle>Éxito</AlertTitle>
            <AlertDescription>
              Se ha iniciado sesión correctamente!
            </AlertDescription>
          </Alert>
        )}
        {errorAlert && (
          <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
            <AlertCircleIcon />
            <AlertTitle>Error al iniciar sesión</AlertTitle>
            <AlertDescription>
              Ha ocurrido un error al iniciar sesión, intente nuevamente <br /> Asegúrese de tener una cuenta en la plataforma 😊
            </AlertDescription>
          </Alert>
        )}
      </div>
    </div>
  )
}

export default LoginPage
