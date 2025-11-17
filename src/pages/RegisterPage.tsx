import { useEffect, useState } from "react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import axios from "axios"
import { useNavigate } from "react-router-dom"
import { Eye, EyeOff } from "lucide-react"
import { Link } from "react-router-dom"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"

 type Career= {
  id: string
  name: string
}

type Role = {
  id: string,
  name: string
}
/*
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
 */
const RegisterPage = () => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [role, setRole]=useState<Role[]>([])
  const [careerId, setCareerId]=useState('')
  const [success, setSuccess] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)
  const [careers, setCareers]=useState<Career[]>([])

  useEffect(()=>{
      const fetchCareers = async () => {
        try {
          const res = await axios.get('http://localhost:8000/api/careers')
          setCareers(res.data.data)
        } catch (error) {
          console.log('Error al obtener las carreras', error)
        }
      }
      fetchCareers()

      const fetchRole = async()=>{
        setLoading(true)
        try {
          const res = await axios.get('http://localhost:8000/api/roles')
          console.log('Roles obtenidos', res.data.data)
          setRole(res.data.data)
        } catch (error) {
          console.log('Error al obtener roles')
        }
        finally{
          setLoading(false)
        }
      }
      fetchRole()
  },[])

 const roleId = role
  ? role.find(r => r.name === 'TEACHER')?.id
  : "";   

  const handleRegister = async () => {
    try {
      setLoading(true)
      const res = await axios.post('http://localhost:8000/api/users', {
        name,
        email,
        roleId,
        password,
        careerId
      })
      setSuccess(true)
      console.log('Usuario registrado', res.data)
      setTimeout(()=>{
        navigate("/login")
      }, 3000)
    } catch (error) {
      console.log('Error al intentar crear el usuario')
      setErrorAlert(true)
      setTimeout(()=>{
        setErrorAlert(false)
      }, 3000)
      
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <div className="flex items-center justify-center min-h-screen bg-gray-900 p-4">
        <div className="w-full max-w-sm p-8 bg-gray-800 rounded-2xl shadow-lg space-y-6 text-gray-100">
          <h1 className="text-xl font-semibold text-center text-white">Registrarse</h1>

          <Label htmlFor="name">Nombre</Label>
          <Input
            required={true}
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
            required={true}
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
              required={true}
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
        {success && (
          <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
            <CheckCircle2Icon />
            <AlertTitle>El usuario se ha creado correctamente!</AlertTitle>
            <AlertDescription>
              El usuario con nombre {name} se ha creado correctamente!
            </AlertDescription>
          </Alert>
        )}
        {errorAlert && (
          <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
            <AlertCircleIcon />
            <AlertTitle>Error al crear usuario</AlertTitle>
            <AlertDescription>
              Ha ocurrido un error al crear el usuario, intente nuevamente
            </AlertDescription>
          </Alert>
        )}
    </>
  )
}

export default RegisterPage
