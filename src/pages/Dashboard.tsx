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
  Eye 
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

type Career = {
  id: string
  name: string
  createdAt: string
}

type Skill = {
  id: string
  name: string
}

type Project = {
  id: string
  name: string
  status: string
  cycle: string
  createdAt: string
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
  
  const [recentProjects, setRecentProjects] = useState<Project[]>([])
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
      desc: "Proyectos PIENSA registrados"
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
      desc: "Tecnologías registradas"
    },
  ]

  const renderDialogContent = (key: string) => {
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
            <p className="text-gray-400 mt-1">Resumen general del sistema de gestión de proyectos.</p>
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
                  <CardContent className="p-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-400">{stat.label}</p>
                        <h3 className="text-3xl font-bold text-white mt-2">{stat.value}</h3>
                      </div>
                      <div className={`p-3 rounded-xl ${stat.bg}`}>
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

                      {(stat.key === 'careers' || stat.key === 'skills') && (
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-6 text-xs text-cyan-400 hover:text-cyan-300 hover:bg-cyan-950 p-0 px-2">
                              <Eye className="w-3 h-3 mr-1" /> Ver lista
                            </Button>
                          </DialogTrigger>
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
                                  <Button type="button" variant="outline" className="border-gray-700 text-gray-300 hover:bg-gray-800">
                                    Cerrar
                                  </Button>
                                </DialogClose>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <Card className="col-span-1 lg:col-span-3 bg-gray-900 border-gray-800 shadow-lg">
                <CardHeader className="border-b border-gray-800 pb-4">
                  <CardTitle className="text-lg font-bold text-white flex items-center gap-2">
                    <Clock className="w-5 h-5 text-cyan-500"/>
                    Últimos Proyectos
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  {recentProjects.length > 0 ? (
                    <div className="divide-y divide-gray-800">
                      {recentProjects.map((proj) => (
                        <div key={proj.id} className="p-4 hover:bg-gray-800/50 transition-colors flex justify-between items-center">
                          <div>
                            <h5 className="font-semibold text-gray-200 line-clamp-1">{proj.name}</h5>
                            <span className="text-xs text-gray-500">{proj.cycle || 'Ciclo sin definir'}</span>
                          </div>
                          <Badge variant="outline" className={`text-xs ${proj.status === 'Finalizado' ? 'text-green-400 border-green-800' : 'text-cyan-400 border-cyan-800'}`}>
                            {proj.status || 'Activo'}
                          </Badge>
                        </div>
                      ))}
                      <div className="p-4">
                        <Button variant="ghost" className="w-full text-sm text-gray-400 hover:text-white" onClick={() => navigate("/projects")}>
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