import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"

const RegisterPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [age, setAge] = useState(0)
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleRegister = async () => {
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:3000/user', {
        name,
        age,
        email,
        password
      })
      console.log('Usuario registrado', res.data)
      navigate("/login")
    } catch (error) {
      console.log('Error al intentar crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="w-full max-w-sm p-8 bg-gray-800 rounded-2xl shadow-lg space-y-6 text-gray-100">
          <h1 className="text-xl font-semibold text-center text-cyan-400">Registrarse</h1>

          <Label htmlFor="name">Nombre</Label>
          <Input
            placeholder="Nombres"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400"
          />

          <Label htmlFor="age">Edad</Label>
          <Input
            type="number"
            placeholder="Edad"
            value={age}
            onChange={(e) => setAge(e.target.valueAsNumber)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400"
          />

          <Label htmlFor="email">E-mail</Label>
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400"
          />

          <Label htmlFor="password">Contraseña</Label>
          <div className="relative">
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="Contraseña"
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

          <Button
            className="bg-cyan-600 hover:bg-cyan-700 text-white"
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </Button>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
