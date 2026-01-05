import SideBar from "@/components/SideBar"
import axios from "axios"
import { useEffect, useState, useRef } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import avatarPlaceholder from "../assets/avatar.png"
import { Loader2, Mail, GraduationCap, Pencil, Camera, Shield } from "lucide-react"
import { DialogTrigger, Dialog, DialogTitle, DialogContent, DialogHeader, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

// Tipos
type UserData = {
  id: string
  name: string
  email: string
  careerId: string
  roleId: string
  image?: string 
}

type Career = { id: string; name: string }
type Role = { id: string; name: string }

const UserProfile = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Obtener credenciales
  const accessToken = localStorage.getItem('token')
  const userId = localStorage.getItem('id')

  // --- ESTADOS DE PERFIL ---
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [user, setUser] = useState<UserData | null>(null)
  const [careerName, setCareerName] = useState("Cargando...")
  const [roleName, setRoleName] = useState("Cargando...")
  const [name, setName] = useState('') 
  
  // Estado para el modal de nombre
  const [isEditNameOpen, setIsEditNameOpen] = useState(false)

  // 1. CARGAR PERFIL
  const loadProfile = async () => {
    if (!userId || !accessToken) return
    setLoading(true)
    try {
      const headers = { Authorization: `Bearer ${accessToken}` }
      
      // Cargar datos del usuario
      const userRes = await axios.get(`http://localhost:8000/api/users/${userId}`, { headers })
      const userData = userRes.data
      setUser(userData)

      // Cargar catálogos
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

  // 2. FUNCIONES DE PERFIL
  const handleEditUser = async () => {
    if (!name.trim()) return
    try {
      setLoading(true)
      await axios.patch(`http://localhost:8000/api/users/${userId}`, { name }, {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      await loadProfile() 
      setName('')
      setIsEditNameOpen(false) // Cerrar modal
    } catch (error) {
      console.error('Error editando usuario', error)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const formData = new FormData()
    formData.append('file', file)
    setUploading(true)
    try {
      await axios.patch(`http://localhost:8000/api/users/${userId}/image`, formData, {
        headers: { 'Content-Type': 'multipart/form-data', Authorization: `Bearer ${accessToken}` }
      })
      await loadProfile()
    } catch (error) {
      console.error("Error subiendo imagen:", error)
    } finally {
      setUploading(false)
    }
  }

  useEffect(() => {
    if (!accessToken || !userId) {
      navigate("/login")
      return
    }
    loadProfile()
  }, [userId, accessToken])

  return (
    <div className="flex bg-gray-950 min-h-screen text-gray-100 font-sans">
      <SideBar />

      <main className="flex-1 ml-0 md:ml-64 p-6 flex items-center justify-center">
        
        {loading && !user ? (
          <div className="flex flex-col items-center gap-2 mt-20 w-full">
            <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
            <span className="text-gray-400 text-sm">Cargando perfil...</span>
          </div>
        ) : (
          <Card className="w-full max-w-sm bg-gray-900 border-gray-800 shadow-xl overflow-hidden shrink-0">
            <CardHeader className="flex flex-col items-center pb-2 relative pt-8">
              
              {/* FOTO */}
              <div 
                className="group relative w-28 h-28 rounded-full overflow-hidden border-4 border-gray-800 mb-4 bg-gray-800 cursor-pointer shadow-2xl"
                onClick={() => fileInputRef.current?.click()}
              >
                {uploading ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-black/60 z-10">
                    <Loader2 className="w-8 h-8 text-cyan-500 animate-spin" />
                  </div>
                ) : (
                  <>
                    <img 
                      src={user?.image ? `http://localhost:8000${user.image}` : avatarPlaceholder} 
                      alt="Avatar" 
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110 group-hover:opacity-40" 
                      onError={(e) => { e.currentTarget.src = avatarPlaceholder }}
                    />
                    <div className="absolute inset-0 flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <Camera className="w-8 h-8 text-white mb-1" />
                      <span className="text-[10px] text-white font-bold uppercase">Foto</span>
                    </div>
                  </>
                )}
              </div>
              <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />

              {/* NOMBRE */}
              <div className="flex flex-row items-center gap-2 mt-2">
                <h2 className="text-2xl font-bold text-white">{user?.name}</h2>
                
                <Dialog 
                  open={isEditNameOpen} 
                  onOpenChange={(open) => {
                    setIsEditNameOpen(open);
                    if(open) setName('');
                  }}
                >
                  <DialogTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-gray-800 text-gray-500 hover:text-cyan-400">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-900 border-gray-800 text-white">
                    <DialogHeader><DialogTitle>Editar Nombre</DialogTitle></DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nuevo Nombre</Label>
                        <Input 
                          value={name} 
                          placeholder={user?.name} 
                          onChange={(e) => setName(e.target.value)} 
                          className="bg-gray-950 border-gray-700"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button variant="ghost" onClick={() => setIsEditNameOpen(false)}>Cancelar</Button>
                      <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={handleEditUser} disabled={!name.trim()}>Guardar</Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </CardHeader>

            <CardContent className="space-y-3 mt-6 px-6 pb-8">
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-950/50 border border-gray-800/50">
                <div className="bg-gray-800 p-2 rounded-lg text-cyan-500"><Mail className="w-5 h-5" /></div>
                <div className="overflow-hidden">
                  <p className="text-[10px] text-gray-500 uppercase font-black">Correo</p>
                  <p className="text-sm text-gray-200 truncate font-medium">{user?.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-950/50 border border-gray-800/50">
                <div className="bg-gray-800 p-2 rounded-lg text-purple-500"><GraduationCap className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black">Carrera</p>
                  <p className="text-sm text-gray-200 font-medium">{careerName}</p>
                </div>
              </div>

              {/* ROL DEBAJO DE CARRERA */}
              <div className="flex items-center gap-4 p-3 rounded-xl bg-gray-950/50 border border-gray-800/50">
                <div className="bg-gray-800 p-2 rounded-lg text-green-500"><Shield className="w-5 h-5" /></div>
                <div>
                  <p className="text-[10px] text-gray-500 uppercase font-black">Rol</p>
                  <p className="text-sm text-gray-200 font-medium uppercase tracking-wider">{roleName}</p>
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