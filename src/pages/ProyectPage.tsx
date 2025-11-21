import Sidebar from "@/components/SideBar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Dialog, DialogClose, DialogContent,  DialogHeader, DialogTrigger, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Search } from "lucide-react"

type Proyect = {
  id: string
  name: string
  description: string
  status: string      
  startDate?: string | null
  endDate?: string | null
  careerId: string
  skillsId?: string | null
  createdAt?: string
  updatedAt?: string 
  createdBy?: string 
}

type Career ={
  id: string,
  name: string,
}

type User = {
  id: string
  careerId: string
}

type Skill = {
  id: string,
  description: string,
}

const ProyectPage = () => {
  const [projects, setProjects] = useState<Proyect[]>([])
  const [proyectName, setProyectName] = useState("")
  const [description, setDescription] = useState("")
  const accessToken = localStorage.getItem("token")
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loading, setLoading]=useState(false)
  const [careerId, setCareerId]=useState('')
  const [careers, setCareers]=useState<Career[]>([])
  const [success, setSuccess]=useState(false)
  const [errorAlert, setErrorAlert]=useState(false)
  const [user, setUser]=useState<User | null>(null)
  const userId=localStorage.getItem('id')
  const [skills, setSkills]=useState<Skill[]>([])
  const [search, setSearch] = useState("")

  const fetchProjects = async () => {
        setLoadingProjects(true)
        try {
          const res = await axios.get("http://localhost:8000/api/projects", {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          setProjects(res.data.data)
        } catch (error) {
          console.log("Error al obtener los proyectos", error)
        }
        setLoadingProjects(false)
      }

    const fetchSkills=async()=>{
      try {
        const res=await axios.get('localhost:8000/api/skills', {
          headers: {
             Authorization: `Bearer ${accessToken}`
          }
        })
        setSkills(res.data.data)
      } catch (error) {
        console.log('Error al obtener las skills', error)
      }
    }

    useEffect(() => {
      const fetchCareers = async () => {
        try {
          const res = await axios.get('http://localhost:8000/api/careers', {
            headers: { Authorization: `Bearer ${accessToken}` }
          })
          setCareers(res.data.data)
        } catch (error) {
          console.log('Error al obtener las carreras', error)
        }
      }

      fetchCareers()
      fetchProjects()

    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setUser(response.data)
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    }, [])

/*   const fetchCareers=async()=>{
    try {
      const res= await axios.get('http://localhost:8000/api/careers', 
        {headers: {
          Authorization: `Bearer ${accessToken}`
        }}
      )
      setCareers(res.data.data)
      console.log('Carreras obtenidas', res.data.data)
    } catch (error) {
      console.log('Error al obtener las carreras')
    }
    fetchCareers()
  } */

    const handleCreateProyect=async()=>{
    try {
      const res=await axios.post('http://localhost:8000/api/projects',
        {
          name: proyectName,
          description,
          careerId
        }
      )
      setSuccess(true)
      setTimeout(()=>{
        setSuccess(false)
      }, 3000)
      console.log('Se creó el proyecto', res.data.data)
      await fetchProjects()
    } catch (error) {
      setErrorAlert(true)
            setTimeout(()=>{
        setErrorAlert(false)
      }, 3000)
      console.log('Error al crear un proyecto', error)
    }
  }

  return (
    <>
      <div className="flex bg-gray-800 min-h-screen">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-64 p-6 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-black text-white">Panel General</h2>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 opacity-60" />
                <Input
                  value={search}
                  onChange={(e)=>setSearch(e.target.value)}
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 w-70"
                />
              </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-xs">
                  + Nuevo Proyecto
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-l font-black">Añadir Proyecto</DialogTitle>
{/*                   <DialogDescription>
                    Ingresa la información básica del nuevo proyecto.
                  </DialogDescription> */}
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <Label className="text-bold">Información general del proyecto</Label>
                  <Input
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Nombre del proyecto"
                    onChange={(e) => setProyectName(e.target.value)}
                  />
                  <Input
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Descripción del proyecto"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                </div>
                <Label>Carrera</Label>
                <select className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:ring-cyan-400" value={careerId} onChange={(e)=>setCareerId(e.target.value)}>
                  <option value="">ㅤㅤ</option>
                  {careers.map(c=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Label>Habilidades y/o tecnologías</Label>
                  <select className="w-full p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:ring-cyan-400" value={careerId} onChange={(e)=>setCareerId(e.target.value)}>
                  <option value="">ㅤㅤ</option>
                  {skills.map(skill=>(
                    <option key={skill.id} value={skill.id}>{skill.description}</option>
                  ))}
                </select>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button variant="ghost">Cancelar</Button>
                  </DialogClose>
                  <Button onClick={handleCreateProyect}>Crear</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>

          <h3 className="text-white">Gestiona todos los proyectos PIENSA de las carreras del ITS Sudamericano</h3>
          {/* <h4 className="text-white mb-4">Proyectos Disponibles</h4> */}

          {loadingProjects ? (
          <div className="flex-1 ml-0 md:ml-64 p-6 transition-all min-h-screen max-w-screen py-3">
            <Loader2 className="w-10 h-10 animate-spin" />
            <h1 className="text-white">Cargando...</h1>
          </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
              {projects
              .filter(p=>
                p.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
                p.description.toLowerCase().includes(search.toLocaleLowerCase()) ||
                p.skillsId?.toLowerCase().includes(search.toLocaleLowerCase())
              )
              .map(p => {
                  const careerName = careers.find(c => c.id === p.careerId)?.name;
                return(
                <div key={p.id} className="p-4 bg-gray-700 rounded-lg text-white">
                  <h1><strong>Título:</strong> {p.name}</h1>
                  <h2><strong>Descripción:</strong> {p.description}</h2>
                  <h2><strong>Carrera:</strong> {careerName || "Sin carrera"}</h2>
                </div>
              )
              })}
                {success && (
                  <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
                    <CheckCircle2Icon />
                    <AlertTitle>El proyecto se ha creado correctamente!</AlertTitle>
                    <AlertDescription>
                      El proyecto con nombre {proyectName} se ha creado correctamente!
                    </AlertDescription>
                  </Alert>
                )}
                {errorAlert && (
                  <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
                    <AlertCircleIcon />
                    <AlertTitle>Error al crear el proyecto</AlertTitle>
                    <AlertDescription>
                      Ha ocurrido un error al crear el proyecto, intente nuevamente
                    </AlertDescription>
                  </Alert>
                )}             
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default ProyectPage
