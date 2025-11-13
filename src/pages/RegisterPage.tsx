import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"

interface Career {
  id: string
  name: string
}

  const careers: Career[] = [
    {id: "4be3823c-8eee-457c-a6dc-cb14ad2f697f", name: "Enfermería"},
    {id: "53cbf4fd-b047-4132-ad16-468df7f06563", name: "Contabilidad"},
    { id: "64e9fe08-0801-4b80-b7c8-9ec9472d4546", name: "Desarrollo de Software" },
    { id: "7f270eb0-9e8c-48d9-9bde-5c67f330ba5c", name: "Diseño Gráfico" },
    { id: "6ba8871b-1526-4f38-88d8-9b4966703831", name: "Gastronomía" },
    { id: "af94e451-bb44-4444-835e-9a06f80e2809", name: "Marketing Digital y Negocios" },
    { id: "362cf8d1-80e4-4365-8ce0-ecd9996ca06b", name: "Administración del Talento Humano" },
    { id: "2a1e133f-797f-445b-9316-f5cc49a0d007", name: "Redes y Telecomunicaciones" },
    { id: "62c25358-0a09-4af9-8100-4a56bb860051", name: "Electricidad" },
  ]

const RegisterPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const roleId= "e3273449-8b08-47eb-a1ef-f14ddbd10174"
  const [careerId, setCareerId]=useState('')

  const handleRegister = async () => {
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/users', {
        name,
        email,
        password,
        roleId,
        careerId
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

{/*           <Label htmlFor="age">Rol</Label>
          <Input
            placeholder="ADMIN"
            value={roleId}
            onChange={(e) => setRoleId(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400"
          /> */}

          <Label htmlFor="email">E-mail</Label>
          <Input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-gray-700 text-white placeholder-gray-400 border-gray-600 focus:border-cyan-400 focus:ring-cyan-400"
          />
          <Label>Carrera</Label>
          <select className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:ring-cyan-400" value={careerId} onChange={(e)=>setCareerId(e.target.value)}>
            <option value="">ㅤㅤ</option>
            {careers.map(c=>(
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
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
            className="w-full bg-cyan-600 hover:bg-cyan-500 text-white "
            onClick={handleRegister}
            disabled={loading}
          >
            {loading ? "Cargando..." : "Registrarse"}
          </Button>
          <p className="text-center text-sm text-gray-400">
          ¿Ya tienes una cuenta?{" "}
          <Link to="/login" className="text-cyan-400 hover:underline">
            Iniciar Sesión
          </Link>
        </p>
        </div>
      </div>
    </>
  )
}

export default RegisterPage
