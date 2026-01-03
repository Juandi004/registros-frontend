import Sidebar from "@/components/SideBar"
import { useEffect, useState } from "react"
import axios from "axios"
import { 
  FolderGit2,  
  GraduationCap, 
  Code2, 
  Loader2, 
  ArrowRight,
  Clock,
  CheckCircle2,
  Eye,
  Calendar,
  ExternalLink
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useNavigate } from "react-router-dom"
import { 
  Dialog, 
  DialogHeader, 
  DialogFooter, 
  DialogTrigger, 
  DialogContent, 
  DialogTitle,   
  DialogDescription,
  DialogClose
} from "@/components/ui/dialog"
import type { Proyect } from "@/types/Proyect" 

type Career = {
  id: string
  name: string
  createdAt: string
}

type Skill = {
  id: string
  name: string
}

const Dashboard = () => {
  const navigate = useNavigate()
  const accessToken = localStorage.getItem("token")
  
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({
    totalProjects: 0,
    totalUsers: 0,
    totalCareers: 0,
    totalSkills: 0
  })
  
  const [recentProjects, setRecentProjects] = useState<Proyect[]>([])
  const [allProjects, setAllProjects] = useState<Proyect[]>([]) 
  const [careersList, setCareersList] = useState<Career[]>([])
  const [skillsList, setSkillsList] = useState<Skill[]>([])

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true)
        const headers = { Authorization: `Bearer ${accessToken}` }
        const [projectsRes, usersRes, careersRes, skillsRes] = await Promise.allSettled([
          axios.get("http://localhost:8000/api/projects", { headers }),
          axios.get("http://localhost:8000/api/users", { headers }),
          axios.get("http://localhost:8000/api/careers", { headers }),
          axios.get("http://localhost:8000/api/skills", { headers })
        ])

        if (projectsRes.status === 'fulfilled') {
          const projectsData = projectsRes.value.data.data
          setStats(prev => ({ ...prev, totalProjects: projectsData.length }))
          setRecentProjects(projectsData.slice(0, 3))
          setAllProjects(projectsData) 
        }
        if (usersRes.status === 'fulfilled') {
          const usersData = usersRes.value.data.data
          setStats(prev => ({ ...prev, totalUsers: usersData ? usersData.length : 0 }))
        }
        if (careersRes.status === 'fulfilled') {
          const careersData = careersRes.value.data.data
          setStats(prev => ({ ...prev, totalCareers: careersRes.value.data.meta.total }))
          setCareersList(careersData)
        }
        if (skillsRes.status === 'fulfilled') {
           const skillsData = skillsRes.value.data.data || []
           const total = skillsRes.value.data.meta?.total || skillsData.length || 0
           setStats(prev => ({ ...prev, totalSkills: total }))
           setSkillsList(skillsData)
        }

      } catch (error) {
        console.error("Error cargando dashboard:", error)
      } finally {
        setLoading(false)
      }
    }

    if (accessToken) {
      fetchDashboardData()
    }
  }, [accessToken])

  const statCards = [
    { 
      key: "projects",
      label: "Proyectos Registrados", 
      value: stats.totalProjects, 
      icon: FolderGit2, 
      color: "text-cyan-500", 
      bg: "bg-cyan-500/10",
      desc: "Proyectos ya registrados"
    },
    { 
      key: "careers",
      label: "Carreras Ofertadas", 
      value: stats.totalCareers, 
      icon: GraduationCap, 
      color: "text-yellow-500", 
      bg: "bg-yellow-500/10",
      desc: "Carreras de tercer nivel"
    },
    { 
      key: "skills",
      label: "Habilidades Técnicas", 
      value: stats.totalSkills, 
      icon: Code2, 
      color: "text-emerald-500", 
      bg: "bg-emerald-500/10",
      desc: "Habilidades registradas"
    },
  ]

  const renderDialogContent = (key: string) => {
    if (key === 'projects') {
      return (
        <div className="grid gap-4 py-4">
          {allProjects.length > 0 ? (
             allProjects.map(project => (
              <div key={project.id} className="flex items-center p-3 bg-gray-800 rounded-md border border-gray-700">
                <FolderGit2 className="w-5 h-5 text-cyan-500 mr-3" />
                <span className="text-sm font-medium text-gray-200">{project.name}</span>
              </div>
             ))
          ) : (
            <p className="text-gray-500">No hay proyectos registrados.</p>
          )}
        </div>
      )
    }
    if (key === 'careers') {
      return (
        <div className="grid gap-4 py-4">
          {careersList.length > 0 ? (
             careersList.map(career => (
              <div key={career.id} className="flex items-center p-3 bg-gray-800 rounded-md border border-gray-700">
                <GraduationCap className="w-5 h-5 text-yellow-500 mr-3" />
                <span className="text-sm font-medium text-gray-200">{career.name}</span>
              </div>
             ))
          ) : (
            <p className="text-gray-500">No hay carreras registradas.</p>
          )}
        </div>
      )
    }
    if (key === 'skills') {
      return (
        <div className="flex flex-wrap gap-2 py-4">
          {skillsList.length > 0 ? (
            skillsList.map(skill => (
              <Badge key={skill.id} variant="secondary" className="bg-emerald-500/20 text-emerald-400 hover:bg-emerald-500/30 px-3 py-1">
                 {skill.name}
              </Badge>
            ))
          ) : (
            <p className="text-gray-500">No hay habilidades registradas.</p>
          )}
        </div>
      )
    }
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-950 text-gray-100 font-sans">
      <Sidebar />
      
      <main className="flex-1 ml-0 md:ml-64 p-8 transition-all">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">Panel de Control</h1>
            <p className="text-gray-400 mt-1">Sistema de gestión de proyectos</p>
          </div>
          <Button className="bg-cyan-600 hover:bg-cyan-700" onClick={() => navigate("/projects")}>
            Ver Todos los Proyectos
          </Button>
        </header>

        {loading ? (
          <div className="h-96 flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="w-10 h-10 animate-spin mb-2 text-cyan-500" />
            <p>Sincronizando datos del sistema...</p>
          </div>
        ) : (
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {statCards.map((stat, index) => (
                <Card key={index} className="bg-gray-900 border-gray-800 shadow-lg hover:border-gray-700 transition-all relative">
                  <Dialog>
                    {/* IMPORTANTE: 
                      Para "Carreras" y "Skills" (no projects), toda la tarjeta abre el modal.
                      Para "Projects", se maneja por separado dentro del CardContent.
                    */}
                    {stat.key !== 'projects' ? (
                      <DialogTrigger asChild>
                         <CardContent className="p-6 cursor-pointer group">
                           {/* Contenido de Carreras/Skills (Toda la tarjeta es botón) */}
                           <div className="flex justify-between items-start">
                              <div>
                                <p className="text-sm font-medium text-gray-400 group-hover:text-cyan-400 transition-colors">{stat.label}</p>
                                <h3 className="text-3xl font-bold text-white mt-2 group-hover:text-cyan-400 transition-colors">{stat.value}</h3>
                              </div>
                              <div className={`p-3 rounded-xl ${stat.bg} group-hover:opacity-80 transition-opacity`}>
                                <stat.icon className={`w-6 h-6 ${stat.color}`} />
                              </div>
                            </div>
                            <div className="mt-4 flex items-center justify-between">
                              <div className="flex items-center text-xs text-gray-500">
                                <span className="flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-green-500" /> 
                                  {stat.desc}
                                </span>
                              </div>
                              {/* Texto Ver lista simulado */}
                              <div className="h-6 flex items-center text-xs text-cyan-400 group-hover:text-cyan-300 font-medium px-2">
                                <Eye className="w-3 h-3 mr-1" /> Ver lista
                              </div>
                            </div>
                         </CardContent>
                      </DialogTrigger>
                    ) : (
                      <CardContent className="p-6">
                        {/* Contenido de PROYECTOS (Botones separados) */}
                        <div className="flex justify-between items-start">
                          <div>
                            {/* Título y Número: Van a /projects */}
                            <p 
                              className="text-sm font-medium text-gray-400 hover:text-cyan-400 transition-colors cursor-pointer"
                              onClick={() => navigate("/projects")}
                            >
                              {stat.label}
                            </p>
                            <h3 
                              className="text-3xl font-bold text-white mt-2 cursor-pointer hover:text-cyan-400 transition-colors"
                              onClick={() => navigate("/projects")}
                            >
                              {stat.value}
                            </h3>
                          </div>
                          
                          {/* Ícono: Abre el Modal (Tiene cursor-pointer explícito) */}
                          <DialogTrigger asChild>
                             <div className={`p-3 rounded-xl ${stat.bg} cursor-pointer hover:opacity-80 transition-opacity`}>
                               <stat.icon className={`w-6 h-6 ${stat.color}`} />
                             </div>
                          </DialogTrigger>
                        </div>

                        <div className="mt-4 flex items-center justify-between">
                          <div className="flex items-center text-xs text-gray-500">
                            <span className="flex items-center gap-1">
                              <CheckCircle2 className="w-3 h-3 text-green-500" /> 
                              {stat.desc}
                            </span>
                          </div>

                          {/* Botón Ver lista: Abre el Modal (Tiene cursor-pointer explícito) */}
                          <DialogTrigger asChild>
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              className="h-6 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950 p-0 px-2 cursor-pointer"
                            >
                              <Eye className="w-3 h-3 mr-1" /> Ver lista
                            </Button>
                          </DialogTrigger>
                        </div>
                      </CardContent>
                    )}

                    {/* Contenido del Modal (Común para todos) */}
                    <DialogContent className="bg-gray-900 border-gray-800 text-white max-h-[80vh] overflow-y-auto">
                      <DialogHeader>
                        <DialogTitle className="text-xl flex items-center gap-2">
                          <stat.icon className={`w-5 h-5 ${stat.color}`} />
                          Lista de {stat.label}
                        </DialogTitle>
                        <DialogDescription className="text-gray-400">
                          Listado completo registrado en el sistema.
                        </DialogDescription>
                      </DialogHeader>
                      
                      {renderDialogContent(stat.key)}

                      <DialogFooter>
                          <DialogClose asChild>
                            <Button type="button" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800 cursor-pointer">
                              Cerrar
                            </Button>
                          </DialogClose>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </Card>
              ))}
            </div>

            {/* --- SECCIÓN ÚLTIMOS PROYECTOS (ESTÁNDAR) --- */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="col-span-1 lg:col-span-3 bg-gray-900 border-gray-800 shadow-lg hover:border-gray-700 transition-all">
                
                {/* Header CLICKABLE */}
                <CardHeader 
                  className="border-b border-gray-800 pb-4 cursor-pointer hover:bg-gray-800/50 transition-colors"
                  onClick={() => navigate("/projects")}
                >
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2 group">
                    <Clock className="w-5 h-5 text-cyan-500"/>
                    <span className="group-hover:text-cyan-400 transition-colors">Últimos Proyectos</span>
                    <span className="ml-auto text-xs font-normal text-gray-500 group-hover:text-gray-300 flex items-center">
                      Ver todo <ArrowRight className="w-3 h-3 ml-1"/>
                    </span>
                  </CardTitle>
                </CardHeader>

                <CardContent className="p-0">
                  {recentProjects.length > 0 ? (
                    <div className="divide-y divide-gray-800">
                      
                      {recentProjects.map((proj) => (
                        <Dialog key={proj.id}>
                          <DialogTrigger asChild>
                            <div className="p-4 hover:bg-gray-800/50 transition-colors flex justify-between items-center cursor-pointer group/item">
                              <div>
                                <h5 className="font-semibold text-gray-200 line-clamp-1 group-hover/item:text-cyan-400 transition-colors">
                                  {proj.name}
                                </h5>
                                <span className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                                  {proj.startDate ? (
                                     <>
                                      <Calendar className="w-3 h-3"/> {new Date(proj.startDate).toLocaleDateString()}
                                     </>
                                  ) : 'Sin fecha'}
                                  <span className="mx-1">•</span> 
                                  {proj.careerId ? 'Carrera asignada' : 'Sin carrera'}
                                </span>
                              </div>
                              <Badge variant="outline" className={`text-xs ${proj.status === 'Finalizado' ? 'text-green-400 border-green-800' : 'text-cyan-400 border-cyan-800'}`}>
                                {proj.status || 'Activo'}
                              </Badge>
                            </div>
                          </DialogTrigger>

                          <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-lg">
                            <DialogHeader>
                              <DialogTitle className="text-xl flex items-center gap-2 text-cyan-400">
                                <FolderGit2 className="w-5 h-5"/>
                                Detalles del Proyecto
                              </DialogTitle>
                            </DialogHeader>
                            
                            <div className="space-y-4 py-4">
                              <div>
                                <h4 className="text-sm font-medium text-gray-400">Nombre del Proyecto</h4>
                                <p className="text-lg font-semibold text-white">{proj.name}</p>
                              </div>
                              <div>
                                <h4 className="text-sm font-medium text-gray-400">Descripción</h4>
                                <p className="text-sm text-gray-300 mt-1 leading-relaxed">
                                  {proj.description || "No hay descripción disponible para este proyecto."}
                                </p>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="p-3 bg-gray-800 rounded-lg">
                                  <span className="text-xs text-gray-500 block mb-1">Estado</span>
                                  <Badge className={proj.status === 'Finalizado' ? 'bg-green-500/20 text-green-400' : 'bg-cyan-500/20 text-cyan-400'}>
                                    {proj.status || 'En Progreso'}
                                  </Badge>
                                </div>
                                <div className="p-3 bg-gray-800 rounded-lg">
                                  <span className="text-xs text-gray-500 block mb-1">Fecha de Inicio</span>
                                  <div className="text-sm font-medium">
                                    {proj.startDate ? new Date(proj.startDate).toLocaleDateString() : 'No definida'}
                                  </div>
                                </div>
                              </div>
                            </div>

                            <DialogFooter>
                              <Button 
                                onClick={() => navigate(`/projects/${proj.id}`)} 
                                variant="secondary" 
                                className="mr-2 cursor-pointer"
                              >
                                Ver completo
                              </Button>
                              <DialogClose asChild>
                                <Button variant="outline" className="border-gray-700 text-gray-300 cursor-pointer">Cerrar</Button>
                              </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      ))}

                      <div className="p-4">
                        <Button 
                          variant="ghost" 
                          className="w-full text-sm text-gray-400 hover:text-white hover:bg-gray-800 cursor-pointer" 
                          onClick={() => navigate("/projects")}
                        >
                          Ver todos <ArrowRight className="w-4 h-4 ml-2"/>
                        </Button>
                      </div>

                    </div>
                  ) : (
                    <div className="p-8 text-center text-gray-500 text-sm">
                      No hay actividad reciente.
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </main>
    </div>
  ) 
}

export default Dashboard