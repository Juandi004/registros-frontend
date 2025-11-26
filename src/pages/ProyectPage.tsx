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
import { Textarea } from "@/components/ui/textarea"


type Proyect = {
  id: string
  name: string
  description: string
  status: string
  objectives: string[]
  problems: string
  summary: string
  cycle: string
  academic_period: string      
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

type UserProject={
  id: string,
  userId: string,
  projectId: string
}

const ProyectPage = () => {
  const [projects, setProjects] = useState<Proyect[]>([])
  const [projectName, setProjectName] = useState("")
  const [description, setDescription] = useState("")
  const [startDate, setStartDate]=useState("")
  const [endDate, setEndDate]=useState("")
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
  const [summary, setSummary]=useState('')
  const [cycle, setCycle]=useState('')
  const [objectives, setObjectives] = useState<string[]>([]);
  const [objectivesText, setObjectivesText] = useState<string>("");
  const [academicPeriod, setAcademicPeriod]=useState('')
  const [search, setSearch] = useState("")
  const [selectedProject, setSelectedProject] = useState<Proyect | null>(null);
  const [deleteSuccess, setDeleteSuccess]=useState(false)
  const [errorDelete, setErrorDelete]=useState(false)
  const [role, setRole]=useState<Role[]>([])
  const [userProjects, setUserProjects]=useState<UserProject[]>([]) 

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

  const fetchUserProyect = async () => {
    try {
      const req = await axios.get(`http://localhost:8000/api/user-projects/user/${userId}`)
      setUserProjects(req.data.data)
    } catch (error) {
      console.log('Error al obtener proyectos del usuario', error)
    }
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
      fetchUserProyect()
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
/*     const fetchUserProyects=async()=>{
      try {
        setLoading(true)
        const response= await axios.get('http://localhost:8000/api/users/proyects', {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setUserProjects(response.data.data)
      } catch (error) {
        console.log('Error al cargar los proyectos del usuario', error)
      }finally{
        setLoading(false)
      }
    }
    fetchUserProyects() */
    }, [])

    const loadProjectData = (project: Proyect) => {
        setSelectedProject(project);
        setProjectName(project.name);
        setDescription(project.description);
        setCareerId(project.careerId);
        setStartDate(project.startDate ?? "");
        setEndDate(project.endDate ?? "")
        setObjectives(project.objectives);                 
        setObjectivesText(project.objectives.join("\n"));
        setAcademicPeriod(project.academic_period)
        setCycle(project.cycle)
        setSummary(project.summary)
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
            objectives,
            startDate: startDate ? new Date(startDate).toISOString() : null,
            endDate: endDate ? new Date(endDate).toISOString() : null,
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
          careerId,
          summary,
          cycle,
          academic_period: academicPeriod,
          objectives,
          startDate: startDate ? new Date(startDate).toISOString() : null,
          endDate: endDate ? new Date(endDate).toISOString() : null,
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
/*   const careerName = user
  ? careers.find(c => c.id === user.careerId)?.name
  : ""; */

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

              <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-gray-800 rounded-xl p-6 ">
                <DialogHeader>
                  <DialogTitle className="text-l font-black">Añadir Proyecto</DialogTitle>
                </DialogHeader>
                  <Label className="text-bold">Nombre del proyecto</Label>
                  <Textarea
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Nombre del proyecto"
                    onChange={(e) => setProjectName(e.target.value)}
                  />
                  <Label className="text-bold">Descripción del proyecto</Label>
                  <Textarea
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Descripción del proyecto"
                    onChange={(e) => setDescription(e.target.value)}
                  />
                  <Label className="text-bold">Resumen</Label>
                  <Textarea
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Resumen del proyecto"
                    onChange={(e) => setSummary(e.target.value)}
                  />
                  <Label className="text-bold">Ciclo Académico</Label>
                  <select 
                  className="w-full text-xs p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:ring-cyan-400" 
                  value={cycle}
                  onChange={(e)=>setCycle(e.target.value)}
                  >
                    <option>ㅤㅤ</option>
                    <option>Primer Ciclo</option>
                    <option> Segundo Ciclo</option>
                    <option>Tercer Ciclo</option>
                    <option>Cuarto Ciclo</option>
                  </select>
                  <Label className="text-bold">Periodo Académico</Label>
                  <Input
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Marzo 2025 - Agosto 2025"
                    onChange={(e) => setAcademicPeriod(e.target.value)}
                  />
                  <Label className="text-bold">Objetivos</Label>
                    <Textarea
                      className="bg-gray-800 border border-gray-700 text-white"
                      placeholder="Escribe cada objetivo en una línea"
                      onChange={(e) => {
                        const lines = e.target.value
                          .split("\n")
                          .map(l => l.trim())
                          .filter(l => l.length > 0);
                        setObjectives(lines);
                      }}
                    />
                  <Label className="text-bold">Fecha de Inicio</Label>
                  <Input
                    type="date"
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    onChange={(e) => setStartDate(e.target.value)}
                  />
                  <Label className="text-bold">Fecha de Finalización</Label>
                  <Input
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Descripción del proyecto"
                    type="date"
                    onChange={(e) => setEndDate(e.target.value)}
                  />
               <Label>Carrera</Label>
                <select className="w-full text-xs p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:ring-cyan-400" value={careerId} onChange={(e)=>setCareerId(e.target.value)}>
                  <option value="">ㅤㅤ</option>
                  {careers.map(c=>(
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                <Label>Habilidades y/o tecnologías</Label>
                  <select className="w-full text-xs p-2 rounded-md bg-gray-700 text-white border border-gray-600 focus:border-cyan-400 focus:ring-cyan-400" value={careerId} onChange={(e)=>setCareerId(e.target.value)}>
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
          {projects.length === 0 && (
            <h1 className="text-white text-xl col-span-full text-center">
              No hay proyectos disponibles
            </h1>
          )}
          {projects.length > 0 &&
            projects
              .filter((p) =>
                p.name.toLowerCase().includes(search.toLowerCase()) ||
                p.description.toLowerCase().includes(search.toLowerCase()) ||
                p.skillsId?.toLowerCase().includes(search.toLowerCase()) /* ||
                p.status?.toLowerCase().includes(search.toLowerCase()) */
              )
              .map((p) => {
                const careerName = careers.find((c) => c.id === p.careerId)?.name;

                return (
                  <div
                    key={p.id}
                    className="p-4 bg-gray-900 rounded-lg text-white border border-gray-600 shadow-md"
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-1">
                        <h1 className="font-semibold text-lg">
                          <strong>Título:</strong> {p.name}
                        </h1>
                        <h2>
                          <strong>Descripción:</strong> {p.description}
                        </h2>
                        <h2>
                          <strong>Carrera:</strong> {careerName || "Sin carrera"}
                        </h2>
                        <h2>
                          <strong>Resumen:</strong>{p.summary}
                        </h2>
                        <h2>
                          <strong>Estado:</strong> {p.status}
                        </h2>
                        <h2>
                          <strong>Fecha de Inicio:</strong> {p.startDate?.slice(0, 10) || 'Pendiente por definir'}
                        </h2>
                        <h2>
                          <strong>Fecha de Finalización:</strong> {p.endDate?.slice(0,10) || 'Pendiente por definir'}
                        </h2>
                        <h2>
                          <strong>Objetivos: <br /> </strong>
                          <ul className="list-disc ml-5">
                          {p.objectives.map((o, i)=>(
                              <li key={i}>{o}</li>
                          ))}
                          </ul>          
                        </h2>
                      </div>

                      <div className="flex flex-col items-center gap-2">

                        {/* ELIMINAR */}
                        {roleName === "ADMIN" && (
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="ghost"
                                className="p-2 bg-gray-700 hover:bg-gray-600 cursor-pointer"
                              >
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
                                  <Button className="bg-gray-600 hover:bg-gray-700 cursor-pointer">
                                    Cancelar
                                  </Button>
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
                        )}

                        {/* EDITAR */}
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              onClick={() => loadProjectData(p)}
                              variant="ghost"
                              className="p-2 bg-gray-700 hover:bg-gray-600 cursor-pointer"
                            >
                              <Pencil className="w-5 h-5" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="w-[95vw] max-w-lg max-h-[90vh] overflow-y-auto bg-gray-800 rounded-xl p-6 ">
                              <DialogHeader>
                                <DialogTitle className="font-semibold text-lg">
                                  Editar Proyecto
                                </DialogTitle>
                              </DialogHeader>

                              <div className="grid gap-3 py-3">

                                <Label>Nombre del proyecto</Label>
                                <Textarea
                                  className="bg-gray-900 border-gray-700 text-white"
                                  value={projectName}
                                  onChange={(e) => setProjectName(e.target.value)}
                                />

                                <Label>Descripción</Label>
                                <Textarea
                                  className="bg-gray-900 border-gray-700 text-white"
                                  value={description}
                                  onChange={(e) => setDescription(e.target.value)}
                                />

                                <Label>Resumen</Label>
                                <Textarea
                                  className="bg-gray-900 border-gray-700 text-white"
                                  value={summary}
                                  onChange={(e) => setSummary(e.target.value)}
                                />

                                <Label>Ciclo Académico</Label>
                                <select
                                  className="w-full text-xs p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                                  value={cycle}
                                  onChange={(e) => setCycle(e.target.value)}
                                >
                                  <option>Primer Ciclo</option>
                                  <option>Segundo Ciclo</option>
                                  <option>Tercer Ciclo</option>
                                  <option>Cuarto Ciclo</option>
                                </select>

                                <Label>Periodo Académico</Label>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white"
                                  value={academicPeriod}
                                  onChange={(e) => setAcademicPeriod(e.target.value)}
                                />

                                <Label>Fecha de Inicio</Label>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white"
                                  value={startDate}
                                  onChange={(e) => setStartDate(e.target.value)}
                                  type="date"
                                />

                                <Label>Fecha de Finalización</Label>
                                <Input
                                  className="bg-gray-900 border-gray-700 text-white"
                                  value={endDate}
                                  onChange={(e) => setEndDate(e.target.value)}
                                  type="date"
                                />

                                <Label>Carrera</Label>
                                <select
                                  className="w-full text-xs p-2 rounded-md bg-gray-700 text-white border border-gray-600"
                                  value={careerId}
                                  onChange={(e) => setCareerId(e.target.value)}
                                >
                                  {careers.map((c) => (
                                    <option key={c.id} value={c.id}>
                                      {c.name}
                                    </option>
                                  ))}
                                </select>

                                <Label>Objetivos (uno por línea)</Label>
                                  <Textarea
                                    value={objectivesText}
                                    onChange={(e) => {
                                      const text = e.target.value;
                                      setObjectivesText(text);
                                      setObjectives(
                                        text
                                          .split("\n")
                                          .map((l) => l.trim())
                                          .filter((l) => l.length > 0)
                                      );
                                    }}
                                  />
                              </div>

                              <DialogFooter>
                                <DialogClose asChild>
                                  <Button className="bg-red-600 hover:bg-red-800 cursor-pointer">
                                    Cancelar
                                  </Button>
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
                );
              })}
          {success && (
            <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
              <CheckCircle2Icon />
              <AlertTitle>Proyecto creado/editado con éxito</AlertTitle>
              <AlertDescription>
                El proyecto {projectName} se procesó correctamente.
              </AlertDescription>
            </Alert>
          )}

          {errorAlert && (
            <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
              <AlertCircleIcon />
              <AlertTitle>Error</AlertTitle>
              <AlertDescription>
                Ocurrió un problema al crear o editar el proyecto.
              </AlertDescription>
            </Alert>
          )}

          {deleteSuccess && (
            <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
              <CheckCircle2Icon />
              <AlertTitle>Proyecto eliminado</AlertTitle>
              <AlertDescription>Se eliminó correctamente.</AlertDescription>
            </Alert>
          )}

          {errorDelete && (
            <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
              <AlertCircleIcon />
              <AlertTitle>Error al eliminar</AlertTitle>
              <AlertDescription>
                Ocurrió un problema eliminando el proyecto.
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