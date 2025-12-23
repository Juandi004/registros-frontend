import Sidebar from "@/components/SideBar"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogHeader, DialogTrigger, DialogFooter, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"
import { Loader2, CalendarIcon, GraduationCap, BookOpen, FileText, Code2, CheckCircle2Icon, Pencil, Trash, Plus, User2 } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircleIcon, Search } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"

const skillSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
})

const projectSchema = z.object({
  name: z.string().min(1, "El nombre es obligatorio"),
  description: z.string().min(1, "La problemática es obligatoria"),
  summary: z.string().optional(),
  deliverables: z.string().optional(),
  cycle: z.string().min(1, "Selecciona un ciclo"),
  academic_period: z.string().min(1, "Selecciona un periodo"),
  startDate: z.string().min(1, "Fecha de inicio requerida"),
  endDate: z.string().min(1, "Fecha de fin requerida"),
  careerId: z.string().min(1, "Selecciona una carrera"),
  objectives: z.string().min(1, "Debes ingresar al menos un objetivo"),
  status: z.string().min(1, "El estado es obligatorio"),
})

type Project = {
  id: string
  name: string
  description: string
  status: string
  objectives: string[]
  problems: string
  summary: string
  cycle: string
  academic_period: string
  createdBy: string
  user: {
    id: string
    name: string
    email: string
  }
  startDate?: string | null
  endDate?: string | null
  careerId: string
  createdAt?: string
  updatedAt?: string
  deliverables: string[]
}

type Career = {
  id: string,
  name: string,
}

type User = {
  id: string
  careerId: string,
  roleId: string,
  email: string,
  name: string
}

type Skill = {
  id: string,
  name: string,
  description: string,
  details: JSON
}

type ProjectSkill = {
  id: string
  projectId: string
  skillId: string
}

type Role = {
  id: string,
  name: string
}

const ProyectPage = () => {
  const [projects, setProjects] = useState<Project[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [projectSkills, setProjectSkills] = useState<ProjectSkill[]>([])
  const [selectedSkills, setSelectedSkills] = useState<string[]>([])

  const accessToken = localStorage.getItem("token")
  const [loadingProjects, setLoadingProjects] = useState(false)
  const [loading, setLoading] = useState(false)
  const [careers, setCareers] = useState<Career[]>([])
  const [success, setSuccess] = useState(false)
  const [errorAlert, setErrorAlert] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const userId = localStorage.getItem('id')

  const [search, setSearch] = useState("")
  const [skillSearch, setSkillSearch] = useState("")
  const [filterStatus, setFilterStatus] = useState("TODOS");
  const [filterStatusUserProjects, setFilterStatusUserProjects] = useState("TODOS")
  const statusOptions = ["TODOS", "en progreso", "completado"];
  const statusUserProjects = ["TODOS", "mis proyectos"]
  
  const [deleteSuccess, setDeleteSuccess] = useState(false)
  const [errorDelete, setErrorDelete] = useState(false)
  const [role, setRole] = useState<Role[]>([])
  const [userProjects, setUserProjects] = useState<Project[]>([])

  const [viewProject, setViewProject] = useState<Project | null>(null)
  const [isViewOpen, setIsViewOpen] = useState(false)

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [editingProject, setEditingProject] = useState<Project | null>(null)

  const createSkillForm = useForm<z.infer<typeof skillSchema>>({
    resolver: zodResolver(skillSchema),
    defaultValues: { name: "", description: "" }
  })

  const createProjectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "",
      description: "",
      summary: "",
      deliverables: "",
      cycle: "",
      academic_period: "",
      startDate: "",
      endDate: "",
      careerId: "",
      objectives: "",
      status: "en progreso",
    }
  })

  const editProjectForm = useForm<z.infer<typeof projectSchema>>({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      name: "", description: "", summary: "", deliverables: "",
      cycle: "", academic_period: "", startDate: "", endDate: "",
      careerId: "", objectives: "", status: "",
    }
  })

  const fetchProjects = async () => {
    setLoadingProjects(true)
    try {
      const res = await axios.get("http://localhost:8000/api/projects", {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setProjects(res.data.data)
    } catch (error) {
      console.log(error)
    }
    setLoadingProjects(false)
  }

  const fetchUserProjects = async () => {
    if (!userId) return;
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8000/api/users-projects/user/${userId}`, {
        headers: { Authorization: `Bearer ${accessToken}` }
      });
      const projectsOnly = response.data.map((item: any) => item.project);
      setUserProjects(projectsOnly);
    } catch (error) {
      setUserProjects([]);
    } finally {
      setLoading(false);
    }
  }

  const handleCreateSkill = async (values: z.infer<typeof skillSchema>) => {
    setLoading(true)
    try {
      await axios.post('http://localhost:8000/api/skills', {
        name: values.name,
        description: values.description,
        details: JSON.stringify({
          "level": "N/A",
          "category": "N/A"
        })
      })
      fetchSkillsData();
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      createSkillForm.reset();
    } catch (error) {
      setErrorAlert(true);
      setTimeout(() => setErrorAlert(false), 3000);
    } finally {
      setLoading(false)
    }
  }

  const fetchSkillsData = async () => {
    try {
      const resSkills = await axios.get('http://localhost:8000/api/skills', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setSkills(resSkills.data.data)

      const resProjectSkills = await axios.get('http://localhost:8000/api/porjects-skills', {
        headers: { Authorization: `Bearer ${accessToken}` }
      })
      setProjectSkills(resProjectSkills.data.data)
    } catch (error) {
      console.log(error)
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
        console.log(error)
      }
    }

    fetchCareers()
    fetchProjects()
    fetchSkillsData()

    const fetchRole = async () => {
      setLoading(true)
      try {
        const res = await axios.get('http://localhost:8000/api/roles')
        setRole(res.data.data)
      } catch (error) {
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
    fetchRole()

    const fetchUser = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:8000/api/users/${userId}`, {
          headers: { Authorization: `Bearer ${accessToken}` }
        })
        setUser(response.data)
      } catch (error) {
        console.error(error)
      } finally {
        setLoading(false)
      }
    }
    fetchUser()
    fetchUserProjects()
  }, [])

  const getProjectSkillsDisplay = (projectId: string) => {
    const relations = projectSkills.filter(ps => ps.projectId === projectId);
    return relations.map(rel => skills.find(s => s.id === rel.skillId)).filter(Boolean) as Skill[];
  }

  const toggleSkillSelection = (skillId: string) => {
    setSelectedSkills(prev =>
      prev.includes(skillId) ? prev.filter(id => id !== skillId) : [...prev, skillId]
    );
  }

  const loadProjectData = (project: Project) => {
    setEditingProject(project)
    const existingSkillIds = projectSkills
      .filter(ps => ps.projectId === project.id)
      .map(ps => ps.skillId);
    setSelectedSkills(existingSkillIds);

    editProjectForm.reset({
      name: project.name,
      description: project.description,
      summary: project.summary || "",
      deliverables: project.deliverables?.join("\n") || "",
      cycle: project.cycle,
      academic_period: project.academic_period,
      startDate: project.startDate ? project.startDate.split('T')[0] : "",
      endDate: project.endDate ? project.endDate.split('T')[0] : "",
      careerId: project.careerId,
      objectives: project.objectives?.join("\n") || "",
      status: project.status
    })
    setIsEditOpen(true)
  };

  const handleDeleteProyect = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation()
    try {
      setLoading(true)
      await axios.delete(`http://localhost:8000/api/projects/${id}`)
      setDeleteSuccess(true)
      setTimeout(() => setDeleteSuccess(false), 3000)
      await fetchProjects()
      await fetchSkillsData()
    } catch (error) {
      setErrorDelete(true)
      setTimeout(() => setErrorDelete(false), 3000)
    } finally {
      setLoading(false)
    }
  }

  const handleEditProyect = async (values: z.infer<typeof projectSchema>) => {
    if (!editingProject) return
    setLoading(true)
    try {
      const objectivesArray = values.objectives.split("\n").map(l => l.trim()).filter(l => l.length > 0)
      const deliverablesArray = values.deliverables ? values.deliverables.split("\n").map(l => l.trim()).filter(l => l.length > 0) : []

      await axios.patch(`http://localhost:8000/api/projects/${editingProject.id}`, {
        ...values,
        objectives: objectivesArray,
        deliverables: deliverablesArray,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
      });

      const currentRelations = projectSkills.filter(ps => ps.projectId === editingProject.id);
      const currentSkillIds = currentRelations.map(ps => ps.skillId);
      const skillsToAdd = selectedSkills.filter(sid => !currentSkillIds.includes(sid));

      if (skillsToAdd.length > 0) {
        await Promise.all(skillsToAdd.map(skillId =>
          axios.post('http://localhost:8000/api/porjects-skills', { projectId: editingProject.id, skillId })
        ));
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      await fetchProjects();
      await fetchSkillsData();
      setIsEditOpen(false)
    } catch (error) {
      setErrorAlert(true);
      setTimeout(() => setErrorAlert(false), 3000);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProyect = async (values: z.infer<typeof projectSchema>) => {
    try {
      setLoading(true)
      const objectivesArray = values.objectives.split("\n").map(l => l.trim()).filter(l => l.length > 0)
      const deliverablesArray = values.deliverables ? values.deliverables.split("\n").map(l => l.trim()).filter(l => l.length > 0) : []

      const res = await axios.post('http://localhost:8000/api/projects', {
        ...values,
        objectives: objectivesArray,
        deliverables: deliverablesArray,
        startDate: new Date(values.startDate).toISOString(),
        endDate: new Date(values.endDate).toISOString(),
        createdBy: userId,
      });

      const projectId = res.data.id;

      await axios.post('http://localhost:8000/api/users-projects', { userId, projectId });

      if (selectedSkills.length > 0) {
        await Promise.all(selectedSkills.map(skillId =>
          axios.post('http://localhost:8000/api/porjects-skills', { projectId, skillId })
        ));
      }
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
      createProjectForm.reset();
      setSelectedSkills([]);
      setIsCreateOpen(false);
      await fetchProjects();
      await fetchUserProjects();
      await fetchSkillsData();
    } catch (error) {
      setErrorAlert(true);
      setTimeout(() => setErrorAlert(false), 3000);
    } finally {
      setLoading(false)
    }
  };

  const roleName = user ? role.find(r => r.id === user.roleId)?.name : "";

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return "Pendiente";
    return new Date(dateString).toLocaleDateString('es-ES', { year: 'numeric', month: 'short', day: 'numeric' });
  }

  const renderFormFields = (form: any) => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
      <FormField control={form.control} name="name" render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className="text-gray-300">Nombre del Proyecto</FormLabel>
          <FormControl><Textarea className="bg-gray-900 border-gray-600 mt-1" {...field} /></FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="description" render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className="text-gray-300">Problemática</FormLabel>
          <FormControl><Textarea className="bg-gray-900 border-gray-600 mt-1" {...field} /></FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="summary" render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className="text-gray-300">Resumen Ejecutivo</FormLabel>
          <FormControl><Textarea className="bg-gray-900 border-gray-600 mt-1" {...field} /></FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="cycle" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-300">Ciclo</FormLabel>
          <FormControl>
            <select className="w-full mt-1 p-2 rounded-md bg-gray-900 border border-gray-600 text-sm text-white" {...field}>
              <option value="">Seleccionar...</option>
              <option>Primer Ciclo</option>
              <option>Segundo Ciclo</option>
              <option>Tercer Ciclo</option>
              <option>Cuarto Ciclo</option>
            </select>
          </FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="academic_period" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-300">Periodo Académico</FormLabel>
          <FormControl>
            <select className="w-full mt-1 p-2 rounded-md bg-gray-900 border border-gray-600 text-sm text-white" {...field}>
              <option value="">Seleccionar...</option>
              <option>Sep 2025 - Feb 2026</option>
              <option>Mar 2026 - Ago 2026</option>
              <option>Sep 2026 - Feb 2027</option>
              <option>Mar 2027 - Ago 2027</option>
              <option>Sep 2027 - Feb 2028</option>
              <option>Mar 2028 - Ago 2028</option>
            </select>
          </FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="startDate" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-300">Fecha Inicio</FormLabel>
          <FormControl><Input type="date" className="bg-gray-900 border-gray-600 mt-1" {...field} /></FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="endDate" render={({ field }) => (
        <FormItem>
          <FormLabel className="text-gray-300">Fecha Fin</FormLabel>
          <FormControl><Input type="date" className="bg-gray-900 border-gray-600 mt-1" {...field} /></FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="careerId" render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className="text-gray-300">Carrera</FormLabel>
          <FormControl>
            <select className="w-full mt-1 p-2 rounded-md bg-gray-900 border border-gray-600 text-sm text-white" {...field}>
              <option value="">Seleccionar carrera...</option>
              {careers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <div className="md:col-span-2 bg-gray-900/50 p-4 rounded-lg border border-gray-700">
        <Label className="text-cyan-400 font-bold mb-3 block items-center gap-2">
          <Code2 className="w-4 h-4" /> Habilidades Requeridas
        </Label>
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            value={skillSearch}
            onChange={(e) => setSkillSearch(e.target.value)}
            type="text"
            placeholder="Buscar habilidad..."
            className="pl-9 bg-gray-800 border-gray-600 text-white focus:ring-cyan-500 focus:border-cyan-500 text-sm h-9"
          />
        </div>
        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto">
          {skills
            .filter(s => {
              const term = skillSearch.toLowerCase()
              return s.name.toLowerCase().includes(term)
            })
            .map((skill) => (
              <div key={skill.id}
                className={`flex items-center space-x-2 p-2 rounded cursor-pointer border transition-colors ${selectedSkills.includes(skill.id) ? 'bg-cyan-900/40 border-cyan-500' : 'hover:bg-gray-800 border-transparent'}`}
                onClick={() => toggleSkillSelection(skill.id)}>
                <div className={`w-4 h-4 rounded border flex items-center justify-center ${selectedSkills.includes(skill.id) ? 'bg-cyan-600 border-cyan-600' : 'border-gray-500'}`}>
                  {selectedSkills.includes(skill.id) && <CheckCircle2Icon className="w-3 h-3 text-white" />}
                </div>
                <span className="text-sm text-gray-300">{skill.name}</span>
              </div>
            ))}
        </div>
        <p className="text-xs text-gray-500 mt-2 text-right">{selectedSkills.length} seleccionadas</p>
      </div>
      <FormField control={form.control} name="objectives" render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className="text-gray-300">Objetivos (uno por línea)</FormLabel>
          <FormControl><Textarea className="bg-gray-900 border-gray-600 mt-1 h-32" placeholder="- Objetivo 1&#10;- Objetivo 2" {...field} /></FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="deliverables" render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className="text-gray-300">Entregables (uno por línea)</FormLabel>
          <FormControl><Textarea className="bg-gray-900 border-gray-600 mt-1 h-32" placeholder="- Entregable 1&#10;- Entregable 2" {...field} /></FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
      <FormField control={form.control} name="status" render={({ field }) => (
        <FormItem className="md:col-span-2">
          <FormLabel className="text-gray-300">Estado del proyecto </FormLabel>
          <FormControl>
            <select className="w-full mt-1 p-2 rounded-md bg-gray-900 border border-gray-600 text-sm text-white" {...field}>
              <option value="">Selecciona un estado...</option>
              <option>en progreso</option>
              <option>completado</option>
            </select>
          </FormControl>
          <FormMessage className="text-red-500 text-xs" />
        </FormItem>
      )} />
    </div>
  )

  return (
    <div className="flex bg-gray-900 min-h-screen text-gray-100 font-sans">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 transition-all w-full overflow-x-hidden">
        <div className="flex flex-col xl:flex-row justify-between items-start xl:items-center mb-8 gap-6">
          <div className="flex-shrink-0">
            <h2 className="text-3xl font-bold text-white tracking-tight">Panel de Proyectos</h2>
            <p className="text-gray-400 text-sm mt-1">Gestión integral de proyectos PIENSA - ITS Sudamericano</p>
          </div>

          <div className="flex flex-col w-full xl:w-auto gap-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  type="text"
                  placeholder="Buscar..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-cyan-600 hover:bg-cyan-700 text-white font-semibold shadow-lg shadow-cyan-900/20 whitespace-nowrap" onClick={() => { createProjectForm.reset(); setSelectedSkills([]) }}>
                    + Nuevo Proyecto
                  </Button>
                </DialogTrigger>
                <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
                  <DialogHeader>
                    <DialogTitle className="text-xl font-bold text-cyan-400">Crear Nuevo Proyecto</DialogTitle>
                  </DialogHeader>
                  <Form {...createProjectForm}>
                    <form onSubmit={createProjectForm.handleSubmit(handleCreateProyect)}>
                      {renderFormFields(createProjectForm)}
                      <DialogFooter>
                        <Button type="button" variant="ghost" className="hover:bg-gray-700" onClick={() => setIsCreateOpen(false)}>Cancelar</Button>
                        <Button type="submit" className="bg-cyan-600 hover:bg-cyan-700" disabled={loading}>{loading ? "Creando..." : "Guardar Proyecto"}</Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            </div>

            <div className="flex flex-col sm:flex-row gap-6 p-1">
              <div className="space-y-1">
                <h5 className="text-xs font-semibold text-cyan-400/80 uppercase tracking-wide">Estado</h5>
                <div className="flex flex-wrap gap-2">
                  {statusOptions.map((status) => (
                    <Badge
                      key={status}
                      onClick={() => setFilterStatus(status)}
                      variant={filterStatus === status ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1 transition-all ${filterStatus === status
                          ? "bg-cyan-600 hover:bg-cyan-700 text-white border-cyan-600"
                          : "text-gray-400 border-gray-600 hover:border-cyan-500 hover:text-cyan-400"
                        }`}
                    >
                      {status}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-1">
                <h5 className="text-xs font-semibold text-purple-400/80 uppercase tracking-wide">Origen</h5>
                <div className="flex flex-wrap gap-2">
                  {statusUserProjects.map((option) => (
                    <Badge
                      key={option}
                      onClick={() => setFilterStatusUserProjects(option)}
                      variant={filterStatusUserProjects === option ? "default" : "outline"}
                      className={`cursor-pointer px-3 py-1 transition-all ${filterStatusUserProjects === option
                          ? "bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
                          : "text-gray-400 border-gray-600 hover:border-purple-500 hover:text-purple-400"
                        }`}
                    >
                      {option}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {loadingProjects ? (
          <div className="flex flex-col items-center justify-center h-64">
            <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mb-4" />
            <p className="text-gray-400">Cargando proyectos...</p>
          </div>
        ) : (
          <div className="space-y-10">
            <div className="bg-gray-800 rounded-xl border border-gray-700 shadow-xl overflow-hidden">
              <div className="p-4 border-b border-gray-700 bg-gray-900/30 flex justify-between items-center">
                <h2 className="text-lg font-bold text-white">Directorio Completo de Proyectos</h2>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button className="bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2 text-sm">
                      <Plus className="w-4 h-4" /> Nueva Skill
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-gray-800 border-gray-700 text-white">
                    <DialogHeader><DialogTitle>Crear Skill</DialogTitle></DialogHeader>
                    <Form {...createSkillForm}>
                      <form onSubmit={createSkillForm.handleSubmit(handleCreateSkill)} className="space-y-3 py-4">
                        <FormField control={createSkillForm.control} name="name" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre</FormLabel>
                            <FormControl><Input className="bg-gray-900 border-gray-600 mt-1" placeholder="Ej: Python" {...field} /></FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )} />
                        <FormField control={createSkillForm.control} name="description" render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción</FormLabel>
                            <FormControl><Input className="bg-gray-900 border-gray-600 mt-1" placeholder="Descripción breve" {...field} /></FormControl>
                            <FormMessage className="text-red-500 text-xs" />
                          </FormItem>
                        )} />
                        <DialogFooter>
                          <DialogClose asChild><Button variant="ghost" className="hover:bg-gray-700">Cancelar</Button></DialogClose>
                          <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>{loading ? "Creando skill..." : "Crear Skill"}</Button>
                        </DialogFooter>
                      </form>
                    </Form>
                  </DialogContent>
                </Dialog>
              </div>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader className="bg-gray-900/50">
                    <TableRow className="border-gray-700 hover:bg-gray-900/50">
                      <TableHead className="text-gray-300 font-bold min-w-[250px]">Proyecto</TableHead>
                      <TableHead className="text-gray-300 font-bold">Detalles & Skills</TableHead>
                      <TableHead className="text-gray-300 font-bold min-w-[150px]">Objetivos</TableHead>
                      <TableHead className="text-gray-300 font-bold min-w-[150px]">Fechas & Estado</TableHead>
                      <TableHead className="text-gray-300 font-bold text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {projects.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center h-32 text-gray-500">No se encontraron proyectos.</TableCell>
                      </TableRow>
                    ) : (
                      projects.filter(p => {
                        const careerName = careers.find((c) => c.id === p.careerId)?.name
                        const term = search.toLowerCase();
                        const projectSkillsList = getProjectSkillsDisplay(p.id);
                        const hasSkill = projectSkillsList.some(s => s.name.toLowerCase().includes(term));
                        const matchesSearch = (
                          (p.name && p.name.toLowerCase().includes(term)) ||
                          (p.description && p.description.toLowerCase().includes(term)) ||
                          (careerName && careerName.toLowerCase().includes(term)) ||
                          hasSkill
                        );
                        const matchesStatus = filterStatus === "TODOS" || p.status === filterStatus;
                        const isMyProject = userProjects.some(up => up.id === p.id) || p.createdBy === userId;

                        const matchesUser = filterStatusUserProjects === "TODOS" ||
                          (filterStatusUserProjects === "mis proyectos" && isMyProject);
                        return matchesSearch && matchesStatus && matchesUser;
                      }).map((p) => {
                        const careerName = careers.find((c) => c.id === p.careerId)?.name;
                        const isAdmin = roleName === "ADMIN";
                        const isOwner = userProjects.some((up) => up.id === p.id);
                        const mySkills = getProjectSkillsDisplay(p.id);
                        return (
                          <TableRow
                            key={p.id}
                            className="border-gray-700 hover:bg-gray-700/30 transition-colors group align-top cursor-pointer"
                            onClick={() => { setViewProject(p); setIsViewOpen(true); }}
                          >
                            <TableCell className="py-4 align-top">
                              <div className="space-y-2">
                                <p className="text-white font-bold text-lg leading-tight">{p.name}</p>
                                <div className="space-y-1 text-sm text-gray-400">
                                  <div className="flex items-center gap-2"><GraduationCap className="w-3 h-3" /> {careerName || "Sin Carrera"}</div>
                                  <div className="flex items-center gap-2"><BookOpen className="w-3 h-3" /> {p.cycle}</div>
                                  <div className="flex items-center gap-2"><CalendarIcon className="w-3 h-3" /> {p.academic_period}</div>
                                  <div className="flex items-center gap-2">
                                    <User2 className="w-3 h-3" />
                                    {p.user?.name || "Desconocido"}
                                  </div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 align-top">
                              <div className="space-y-3 w-[300px] whitespace-normal">
                                <div>
                                  <span className="text-xs font-semibold text-gray-500 uppercase">Problemática</span>
                                  <p className="text-sm text-gray-300 leading-relaxed break-words line-clamp-3">
                                    {p.description}
                                  </p>
                                </div>

                                {p.summary && (
                                  <div className="bg-gray-900/40 p-2 rounded border border-gray-700/50">
                                    <span className="text-xs font-semibold text-gray-500 uppercase block mb-1">Resumen</span>
                                    <p className="text-xs text-gray-400 italic break-words line-clamp-2">
                                      {p.summary}
                                    </p>
                                  </div>
                                )}

                                {mySkills.length > 0 && (
                                  <div className="flex flex-wrap gap-1 mt-2">
                                    {mySkills.map(sk => (
                                      <span key={sk.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-cyan-900/30 text-cyan-200 border border-cyan-800">
                                        {sk.name}
                                      </span>
                                    ))}
                                  </div>
                                )}
                              </div>
                            </TableCell>
                            <TableCell className="py-4 align-top max-w-[250px]">
                              {p.objectives && p.objectives.length > 0 ? (
                                <ul className="list-disc pl-4 space-y-1 break-words">
                                  {p.objectives.slice(0, 3).map((obj, i) => (
                                    <li key={i} className="text-sm text-gray-400 leading-snug line-clamp-2">
                                      - {obj}
                                    </li>
                                  ))}
                                  {p.objectives.length > 3 && (
                                    <li className="text-xs text-cyan-500 italic">
                                      ... y {p.objectives.length - 3} más
                                    </li>
                                  )}
                                </ul>
                              ) : (
                                <span className="text-xs text-gray-600 italic">
                                  Sin objetivos registrados
                                </span>
                              )}
                            </TableCell>
                            <TableCell className="py-4 align-top">
                              <div className="space-y-3">
                                <Badge variant="outline" className={`${p.status === 'Finalizado' ? 'text-green-400 border-green-900 bg-green-900/20' : 'text-cyan-400 border-cyan-900 bg-cyan-900/20'}`}>
                                  {p.status || "N/A"}
                                </Badge>
                                <div className="text-xs text-gray-400">
                                  <div className="mb-1"><span className="text-gray-600">Inicio:</span> <br />{formatDate(p.startDate)}</div>
                                  <div><span className="text-gray-600">Fin:</span> <br />{formatDate(p.endDate)}</div>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell className="py-4 align-top text-right">
                              <div className="flex justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                                {(isAdmin || isOwner) && (
                                  <Button variant="ghost" size="icon" className="h-8 w-8 text-cyan-500 hover:text-cyan-400 hover:bg-cyan-900/20" onClick={() => loadProjectData(p)}>
                                    <Pencil className="w-4 h-4" />
                                  </Button>
                                )}
                                {isAdmin && (
                                  <Dialog>
                                    <DialogTrigger asChild>
                                      <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-400 hover:bg-red-900/20"><Trash className="w-4 h-4" /></Button>
                                    </DialogTrigger>
                                    <DialogContent className="bg-gray-800 border-gray-700 text-white">
                                      <DialogHeader><DialogTitle>¿Eliminar Proyecto?</DialogTitle></DialogHeader>
                                      <DialogDescription className="text-gray-400">Esta acción no se puede deshacer.</DialogDescription>
                                      <DialogFooter>
                                        <Button className="bg-red-600 hover:bg-red-700" onClick={(e) => handleDeleteProyect(e, p.id)}>Confirmar Eliminación</Button>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        )
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            {success && <Alert className="fixed top-5 right-5 w-auto bg-green-600 border-green-500 text-white shadow-xl animate-in slide-in-from-right"><CheckCircle2Icon /><AlertTitle>Éxito</AlertTitle><AlertDescription>Operación realizada correctamente.</AlertDescription></Alert>}
            {errorAlert && <Alert className="fixed top-5 right-5 w-auto bg-red-600 border-red-500 text-white shadow-xl animate-in slide-in-from-right"><AlertCircleIcon /><AlertTitle>Error</AlertTitle><AlertDescription>Hubo un problema.</AlertDescription></Alert>}
            {deleteSuccess && <Alert className="fixed top-5 right-5 w-auto bg-green-600 border-green-500 text-white shadow-xl animate-in slide-in-from-right"><CheckCircle2Icon /><AlertTitle>Eliminado</AlertTitle><AlertDescription>El proyecto ha sido eliminado.</AlertDescription></Alert>}
          </div>
        )}
      </main>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] overflow-y-auto bg-gray-800 border-gray-700 text-white">
          <DialogHeader><DialogTitle className="text-xl font-bold text-cyan-400">Editar Proyecto</DialogTitle></DialogHeader>
          <Form {...editProjectForm}>
            <form onSubmit={editProjectForm.handleSubmit(handleEditProyect)}>
              {renderFormFields(editProjectForm)}
              <DialogFooter>
                <Button type="button" variant="ghost" className="hover:bg-gray-700" onClick={() => setIsEditOpen(false)}>Cancelar</Button>
                <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={loading}>Guardar Cambios</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewOpen} onOpenChange={setIsViewOpen}>
        <DialogContent className="min-w-2xl w-full max-w-4xl bg-slate-900 border-slate-700 text-slate-100 p-0">
          <div className="max-h-[80vh] overflow-y-auto p-6 space-y-6 break-words break-all">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-cyan-400 flex items-center gap-2">
                <FileText className="w-6 h-6" /> {viewProject?.name}
              </DialogTitle>
              <DialogDescription className="text-slate-400">
                Detalles completos del proyecto
              </DialogDescription>
            </DialogHeader>
            {viewProject && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-800/50 p-4 rounded-lg">
                  <div>
                    <h4 className="text-xs font-bold text-cyan-500 uppercase mb-1">Carrera</h4>
                    <p className="text-sm">{careers.find(c => c.id === viewProject.careerId)?.name || "N/A"}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-500 uppercase mb-1">Periodo & Ciclo</h4>
                    <p className="text-sm">{viewProject.academic_period} - {viewProject.cycle}</p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-500 uppercase mb-1">Fechas</h4>
                    <p className="text-sm text-slate-300">
                      {formatDate(viewProject.startDate)} al {formatDate(viewProject.endDate)}
                    </p>
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-cyan-500 uppercase mb-1">Estado</h4>
                    <Badge variant="outline" className="text-cyan-300 border-cyan-700">{viewProject.status}</Badge>
                  </div>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-1">Problemática</h3>
                  <div className="text-slate-300 leading-relaxed whitespace-pre-wrap break-words bg-slate-950/30 p-3 rounded-md border border-slate-800 overflow-hidden">
                    {viewProject.description}
                  </div>
                </div>
                {viewProject.summary && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-1">Resumen Ejecutivo</h3>
                    <div className="text-slate-300 leading-relaxed whitespace-pre-wrap break-words bg-slate-950/30 p-3 rounded-md border border-slate-800 overflow-hidden">
                      {viewProject.summary}
                    </div>
                  </div>
                )}
                {viewProject.objectives?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-1">Objetivos</h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300 break-words">
                      {viewProject.objectives.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {viewProject.deliverables?.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-1">Entregables</h3>
                    <ul className="list-disc pl-5 space-y-2 text-slate-300 break-words">
                      {viewProject.deliverables.map((obj, i) => (
                        <li key={i}>{obj}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 border-b border-slate-700 pb-1">Tecnologías / Skills</h3>
                  <div className="flex flex-wrap gap-2">
                    {getProjectSkillsDisplay(viewProject.id).map(skill => (
                      <Badge key={skill.id} className="bg-slate-700 hover:bg-slate-600 text-white">
                        {skill.name}
                      </Badge>
                    ))}
                  </div>
                </div>

              </div>
            )}
            <DialogFooter>
              <Button onClick={() => setIsViewOpen(false)} className="bg-cyan-600 hover:bg-cyan-700 text-white">
                Cerrar
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  )
}
export default ProyectPage