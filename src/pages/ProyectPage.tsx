import Sidebar from "@/components/SideBar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Dialog, DialogClose, DialogContent,  DialogHeader, DialogTrigger, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Loader2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, CheckCircle2Icon, Search, Pencil, Trash } from "lucide-react"
import { Label } from "@/components/ui/label"


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
  careerId: string,
  roleId: string
}

type Skill = {
  id: string,
  description: string,
}

  type Role = {
    id: string,
    name: string
  }

const ProyectPage = () => {
  const [projects, setProjects] = useState<Proyect[]>([])
  const [projectName, setProjectName] = useState("")
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
  const [selectedProject, setSelectedProject] = useState<Proyect | null>(null);
  const [deleteSuccess, setDeleteSuccess]=useState(false)
  const [errorDelete, setErrorDelete]=useState(false)
  const [role, setRole]=useState<Role[]>([])
  
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

/*     const fetchSkills=async()=>{
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
    } */

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

    const loadProjectData = (project: Proyect) => {
        setSelectedProject(project);
        setProjectName(project.name);
        setDescription(project.description);
        setCareerId(project.careerId);
      };

    const handleDeleteProyect=async(id: string)=>{
      try {
        setLoading(true)
        await axios.delete(`http://localhost:8000/api/projects/${id}`)
        setDeleteSuccess(true)
        setTimeout(()=>{
          setDeleteSuccess(false)
        }, 3000)
        await fetchProjects(  )
      } catch (error) {
        setErrorDelete(true)
        console.log(error)
        setTimeout(()=>{
          setErrorDelete(false)
        }, 3000)
      }finally{
        setLoading(false)
      }
    }

      const handleEditProyect = async (id: string) => {
        setLoading(true)
        try {
          setLoading(true);
          await axios.patch(`http://localhost:8000/api/projects/${id}`, {
            name: projectName,
            description,
            careerId,
          });

          setSuccess(true);
          setTimeout(() => setSuccess(false), 3000);

          await fetchProjects();
        } catch (error) {
          setErrorAlert(true);
          setTimeout(() => setErrorAlert(false), 3000);
        } finally {
          setLoading(false);
        }
      };

    const handleCreateProyect=async()=>{
    try {
      const res=await axios.post('http://localhost:8000/api/projects',
        {
          name: projectName,
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

  const roleName = user ? role.find(r=> r.id === user.roleId)?.name: "";
  const careerName = user
  ? careers.find(c => c.id === user.careerId)?.name
  : "";

  return (
    <>
      <div className="flex bg-gray-800 min-h-screen">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-64 p-6 transition-all w-screen">
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
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-xs cursor-pointer">
                  + Nuevo Proyecto
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md bg-gray-800">
                <DialogHeader>
                  <DialogTitle className="text-l font-black">Añadir Proyecto</DialogTitle>
                </DialogHeader>

                <div className="grid gap-4 py-4">
                  <Label className="text-bold">Nombre del proyecto:</Label>
                  <Input
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Nombre del proyecto"
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <Label className="text-bold">Descripción del proyecto:</Label>
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
                    <Button variant="ghost" className="bg-red-600 cursor-pointer hover:bg-red-800">Cancelar</Button>
                  </DialogClose>
                  <Button className="bg-green-600 cursor-pointer hover:bg-green-800" onClick={handleCreateProyect}>Crear</Button>
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
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6 py-6">
              {projects
              .filter(p=>
                p.name.toLowerCase().includes(search.toLocaleLowerCase()) ||
                p.description.toLowerCase().includes(search.toLocaleLowerCase()) ||
                p.skillsId?.toLowerCase().includes(search.toLocaleLowerCase())
              )
              .map(p => {
                  const careerName = careers.find(c => c.id === p.careerId)?.name;
                return(
                <>
                  <div
                    key={p.id}
                    className="p-4 bg-gray-900 rounded-lg text-white border border-gray-600 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h1 className="font-semibold text-lg"><strong>Título:</strong> {p.name}</h1>
                        <h2><strong>Descripción:</strong> {p.description}</h2>
                        <h2><strong>Carrera:</strong> {careerName || "Sin carrera"}</h2>
                      </div>
                      <div className="flex flex-col items-center gap-2">
                      {roleName==='ADMIN'?(
                        <>
                          <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" className="p-2 bg-gray-700 hover:bg-gray-600 cursor-pointer">
                              <Trash className="w-5 h-5 stroke-red-500" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-md bg-gray-800">
                            <DialogHeader>
                              <DialogTitle>Eliminar Proyecto</DialogTitle>
                            </DialogHeader>
                            <DialogDescription>
                              ¿Está seguro que desea eliminar el proyecto {p.name}?
                            </DialogDescription>
                            <DialogFooter>
                              <DialogClose asChild>
                                <Button className="bg-gray-600 hover:bg-gray-700 cursor-pointer">Cancelar</Button>
                              </DialogClose>
                              <Button
                                className="bg-red-600 hover:bg-red-800 cursor-pointer"
                                onClick={() => handleDeleteProyect(p.id)}
                              >
                                Eliminar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        </>
                      ):(
                        <></>
                      )}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => loadProjectData(p)}
                              variant="ghost"
                              className="p-2 bg-gray-700 hover:bg-gray-600 cursor-pointer "
                            >
                              <Pencil className="w-5 h-5" />
                            </Button>
                          </DialogTrigger>

                          <DialogContent className="sm:max-w-md bg-gray-800">
                            <DialogHeader>
                              <DialogTitle className="font-semibold text-lg">Editar Proyecto</DialogTitle>
                            </DialogHeader>
                            <div className="grid gap-3 py-3">
                              <Label>Nombre del proyecto</Label>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white"
                                value={projectName}
                                onChange={(e) => setProjectName(e.target.value)}
                              />

                              <Label>Descripción</Label>
                              <Input
                                className="bg-gray-900 border-gray-700 text-white"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                              />
                            </div>

                            <DialogFooter>
                              <DialogClose asChild>
                                <Button className="bg-red-600 hover:bg-red-800 cursor-pointer">Cancelar</Button>
                              </DialogClose>
                              <Button
                                className="bg-green-600 hover:bg-green-800 cursor-pointer"
                                onClick={() => handleEditProyect(p.id)}
                              >
                                Editar
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                  </div>
                </>
              )
              })}
                {success && (
                  <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
                    <CheckCircle2Icon />
                    <AlertTitle>El proyecto se ha creado o editado correctamente!</AlertTitle>
                    <AlertDescription>
                      El proyecto con nombre {projectName} se ha creado o editado correctamente!
                    </AlertDescription>
                  </Alert>
                )}
                {errorAlert && (
                  <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
                    <AlertCircleIcon />
                    <AlertTitle>Error al crear o editar el proyecto</AlertTitle>
                    <AlertDescription>
                      Ha ocurrido un error al crea o editar el proyecto, intente nuevamente
                    </AlertDescription>
                  </Alert>
                )}
                {deleteSuccess && (
                  <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
                    <CheckCircle2Icon />
                    <AlertTitle>El proyecto se ha eliminado correctamente!</AlertTitle>
                    <AlertDescription>
                      El proyecto seleccionado se ha eliminado correctamente!
                    </AlertDescription>
                  </Alert>
                )}
                {errorDelete && (
                  <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
                    <AlertCircleIcon />
                    <AlertTitle>Error al eliminar el proyecto</AlertTitle>
                    <AlertDescription>
                      Ha ocurrido un error al eliminar el proyecto, intente nuevamente
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