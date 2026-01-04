import SideBar from "@/components/SideBar"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import avatarPlaceholder from "../assets/avatar.png"
import { Loader2, Mail, GraduationCap, Shield, Camera } from "lucide-react" 
import { DialogTrigger, Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter, DialogClose } from "@/components/ui/dialog"
import { Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

type UserData = {
  name: string
  email: string
  careerId: string
  roleId: string
  avatar?: string
  image?: string 
}

type Career = { id: string; name: string }
type Role = { id: string; name: string }

const UserProfile = () => {
  const navigate = useNavigate()
  const accessToken = localStorage.getItem('token')
  const userId = localStorage.getItem('id')

  const [loading, setLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [careerName, setCareerName] = useState("Cargando...")
  const [roleName, setRoleName] = useState("Cargando...")
  
  const [name, setName] = useState('')
  
  // Referencia al input oculto
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Función al hacer clic en el botón de cámara
  const handleAvatarClick = () => {
    fileInputRef.current?.click()
  }

  // Función al seleccionar el archivo
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    if (!file.type.startsWith("image/")) {
      alert("Por favor selecciona un archivo de imagen válido")
      return
    }

    const formData = new FormData()
    formData.append("file", file)

    try {
      setIsUploading(true)
      
      await axios.post(
        `http://localhost:8000/api/users/upload-profile-image/${userId}`, 
        formData, 
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${accessToken}`
          },
        }
      )
      
      // Forzamos la recarga del perfil para ver la imagen nueva
      await loadProfile()

    } catch (error) {
      console.error("Error subiendo imagen:", error)
      alert("Error al subir la imagen. Verifica que el backend esté corriendo y la carpeta 'uploads' exista.")
    } finally {
      setIsUploading(false)
    }
  }

  const handleEditUser = async()=> {
    if (!name.trim()) return;

    try {
      setLoading(true)
      await axios.patch(`http://localhost:8000/api/users/${userId}`, 
        { name },
        { headers: { Authorization: `Bearer ${accessToken}` } }
      )
      setName('') 
    } catch (error) {
      console.log('Error al editar el usuario', error)
    }
    finally{
      setLoading(false)
    }
    await loadProfile()
  }

  const loadProfile = async () => {
    if(!user) setLoading(true)
    
    try {
      const headers = { Authorization: `Bearer ${accessToken}` }
      const userRes = await axios.get(`http://localhost:8000/api/users/${userId}`, { headers })
      const userData = userRes.data
      setUser(userData)
      
      const [careersRes, rolesRes] = await Promise.all([
        axios.get("http://localhost:8000/api/careers", { headers }),
        axios.get("http://localhost:8000/api/roles", { headers })
      ])
      const foundCareer = careersRes.data.data.find((c: Career) => c.id === userData.careerId)
      const foundRole = rolesRes.data.data.find((r: Role) => r.id === userData.roleId)

      setCareerName(foundCareer ? foundCareer.name : "Sin asignar")
      setRoleName(foundRole ? foundRole.name : "Usuario")

    } catch (error) {
      console.error("Error cargando perfil:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!accessToken || !userId) {
      navigate("/login")
      return
    }
    loadProfile()
  }, [userId, accessToken, navigate])

  return (
    <div className="flex bg-gray-950 min-h-screen text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 ml-0 md:ml-64 p-6 flex items-center justify-center">
        {loading && !user ? (
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <span className="text-gray-400 text-sm">Cargando perfil...</span>
          </div>
        ) : (
          <Card className="w-full max-w-sm bg-gray-900 border-gray-800 shadow-xl">
            <CardHeader className="flex flex-col items-center pb-2">
              
              {/* --- INICIO SECCIÓN FOTO (MODIFICADA PARA VERSE SIEMPRE) --- */}
              <div className="relative w-32 h-32 mb-6">
                {/* Imagen Circular */}
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-gray-800 bg-gray-700 shadow-md">
                  <img 
                    src={user?.image || avatarPlaceholder} 
                    alt="Avatar" 
                    className="w-full h-full object-cover" 
                  />
                </div>

                {/* BOTÓN DE CÁMARA FLOTANTE (SIEMPRE VISIBLE) */}
                <button 
                  onClick={handleAvatarClick}
                  className="absolute bottom-0 right-1 bg-cyan-600 hover:bg-cyan-700 text-white p-2 rounded-full shadow-lg border-4 border-gray-900 transition-all active:scale-95"
                  title="Cambiar foto de perfil"
                >
                  {isUploading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <Camera className="w-5 h-5" />
                  )}
                </button>

                {/* Input file oculto */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  className="hidden" 
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
              {/* --- FIN SECCIÓN FOTO --- */}

              <div className="flex flex-row justify-around w-full items-center">  
                <div>
                  <h2 className="text-2xl font-bold text-white px-3 justify-self-center">{user?.name}</h2>
                </div>
                <div>
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button className="hover:bg-gray-700">
                        <Pencil className="h-4"/>
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                      <DialogHeader><DialogTitle>Editar Nombre de usuario</DialogTitle></DialogHeader>
                      <div className="space-y-3 py-4">
                        <div>
                          <Label>Nombre</Label>
                          <Input 
                            onChange={(e) => setName(e.target.value)} 
                            placeholder={user?.name || "Escribe el nuevo nombre"} 
                            className="bg-gray-900 border-gray-600 mt-1 placeholder:text-gray-500" 
                            value={name}
                          />
                        </div>
                      </div>
                      <DialogFooter>
                        <DialogClose asChild><Button variant="ghost" className="hover:bg-gray-700">Cancelar</Button></DialogClose>
                        <Button className="bg-green-600 hover:bg-green-700" onClick={handleEditUser}>Editar</Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
              </div>
              <span className="text-cyan-500 font-medium text-sm bg-cyan-950/50 px-3 py-1 rounded-full border border-cyan-900">
                {roleName}
              </span>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50">
                <div className="bg-gray-700 p-2 rounded-full text-gray-300">
                  <Mail className="w-5 h-5" />
                </div>
                <div className="overflow-hidden">
                  <p className="text-xs text-gray-500 uppercase font-semibold">Correo</p>
                  <p className="text-sm text-gray-200 truncate" title={user?.email}>{user?.email}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50">
                <div className="bg-gray-700 p-2 rounded-full text-gray-300">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Carrera</p>
                  <p className="text-sm text-gray-200">{careerName}</p>
                </div>
              </div>

              <div className="flex items-center gap-4 p-3 rounded-lg bg-gray-800/50">
                <div className="bg-gray-700 p-2 rounded-full text-gray-300">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Rol de Usuario</p>
                  <p className="text-sm text-gray-200 capitalize">{roleName}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}

export default UserProfile