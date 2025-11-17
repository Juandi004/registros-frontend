import Sidebar from "@/components/SideBar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import axios from "axios"


type Proyect = {
  id: string
  name: string
  description: string
  status: string      
  startDate?: string | null
  endDate?: string | null
  careerId: string
  skillsId?: string | null
  createdAt: string
  updatedAt: string 
  createdBy: string 
}

type Career = {
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


const ProyectPage = () => {
  const [projects, setProjects] = useState<Proyect[]>([])
  const [proyectName, setProyectName] = useState("")
  const [description, setDescription] = useState("")
  const accessToken = localStorage.getItem("token")
  const [loadingProjects, setLoadingProjects] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      setLoadingProjects(true)
      try {
        const res = await axios.get("http://localhost:8000/api/projects", 
          {headers: {
            Authorization: `Bearer ${accessToken}`,
          }}
        )
        setProjects(res.data.data)
      } catch (error) {
        console.log("Error al obtener los proyectos", error)
      }
      setLoadingProjects(false)
    }
    fetchProjects()
  }, [])

  const handleCreateProyect = async () => {
    setLoadingProjects(true)
    try {
      const req = await axios.post(
        "http://localhost:8000/api/projects",
        { name: proyectName, description },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
                "Cache-Control": "no-cache",
                Pragma: "no-cache",
          },
        }
      )
      console.log("Proyecto creado", req.data)
    } catch (error) {
      console.log("Error al crear un proyecto", error)
    }
    setLoadingProjects(false)
  }
  

  return (
    <>
      <div className="flex bg-gray-800 min-h-screen">
        <Sidebar />

        <main className="flex-1 ml-0 md:ml-64 p-6 transition-all">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">Panel General</h2>
            <Dialog>
              <DialogTrigger asChild>
                <Button className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-xs">
                  + Nuevo Proyecto
                </Button>
              </DialogTrigger>

              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-m">Crear Proyecto</DialogTitle>
                  <DialogDescription>
                    Ingresa la información básica del nuevo proyecto.
                  </DialogDescription>
                </DialogHeader>

                <div className="grid gap-4 py-4">
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
          <h4 className="text-white mb-4">Proyectos Disponibles</h4>

          {loadingProjects ? (
            <h1 className="text-white">Cargando...</h1>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map(p => {
                const careerName = careers.find(c => c.id === p.careerId)?.name;
                return(
                <div key={p.id} className="p-4 bg-gray-700 rounded-lg text-white">
                  <h1><strong>Título:</strong> {p.name}</h1>
                  <h2><strong>Descripción:</strong> {p.description}</h2>
                  <h2><strong>Carrera:</strong> {careerName || "Sin carrera"}</h2>
                </div>
              )
              })}
            </div>
          )}
        </main>
      </div>
    </>
  )
}

export default ProyectPage
