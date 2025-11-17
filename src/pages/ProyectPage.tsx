import Sidebar from "@/components/SideBar"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogHeader, DialogTrigger, DialogFooter, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import axios from "axios"
import type { User } from "@/types/User"

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

const ProyectPage = () => {
  const [projects, setProjects] = useState<Proyect[]>([])
  const [proyectName, setProyectName]=useState('')
  const [description, setDescription]=useState('')
  const userId=localStorage.getItem("id")
  const accessToken=localStorage.getItem("token")
  const [user, setUser]=useState<User | null>(null)
  const [loading, setLoading]=useState(false)

        useEffect(() => {
        const fetchUser = async () => {
            setLoading(true)
            try {
            const res = await axios.get(`https://localhost:8000/api/users/${userId}`, {
                headers: { Authorization: `Bearer ${accessToken}` },
            });
            setUser(res.data);
            } catch (error) {
            console.log("Error al obtener el usuario", error);
            }
            setLoading(false)
        };

        const fetchProyects = async () => {
            setLoading(true)
            try {
            const res = await axios.get('https://localhost:8000/api/projects');
            setProjects(res.data);
            } catch (error) {
            console.log('Error al obtener los proyectos', error);
            }
            setLoading(false)
        };

        if (userId && accessToken) fetchUser();
        fetchProyects();
        }, [userId, accessToken]);

  const handleCreateProyect = async() => {
    setLoading(true)
    try {
        const req= await axios.post('https://localhost:8000/projects', {
            name: proyectName, description
        }
        )
        setLoading(false)
        console.log('Proyecto creado', req.data)
    } catch (error) {
        console.log('Error al crear un proyecto', error)
    }
  } 

  return (
    <>
    <div className="flex bg-gay-800 min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-0 md:ml-64 p-6 transition-all">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-white">Panel General</h2>
          <Dialog>
            <DialogTrigger className="bg-cyan-600 hover:bg-cyan-700 text-white px-4 py-2 rounded-lg text-xs">
            + Nuevo Proyecto
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
                    onChange={(e)=>setProyectName(e.target.value)}
                />
                <Input
                    className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white"
                    placeholder="Descripción del proyecto"
                    onChange={(e)=>setDescription(e.target.value)}
                />
                </div>

                <DialogFooter>
                <Button variant="ghost">Cancelar</Button>
                <Button onClick={handleCreateProyect}>Crear</Button>
                </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <h3>Gestiona todos los proyectos PIENSA de las carreras del ITS Sudamericano</h3>
        <h4>Proyectos Disponibles</h4>
        { loading && (!projects || !user) ? (
            <h1>Cargando...</h1>
        ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map(p => (
                <div key={p.id}>
                    <h1>Título: {p.name}</h1>
                    <h2>Descripción: {p.description}</h2>
                    <h2>Carrera: {p.careerId}</h2>
                </div>
            ))}
        </div>
        ) }
      </main>
    </div>
    <Dialog>
      <form>
        <DialogTrigger asChild>
          <Button variant="outline">Open Dialog</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Edit profile</DialogTitle>
            <DialogDescription>
              Make changes to your profile here. Click save when you&apos;re
              done.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4">
            <div className="grid gap-3">
              <Label htmlFor="name-1">Name</Label>
              <Input id="name-1" name="name" defaultValue="Pedro Duarte" />
            </div>
            <div className="grid gap-3">
              <Label htmlFor="username-1">Username</Label>
              <Input id="username-1" name="username" defaultValue="@peduarte" />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit">Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
   </>
    
  )
}

export default ProyectPage
