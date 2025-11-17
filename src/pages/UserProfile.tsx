import SideBar from "@/components/SideBar"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardTitle, CardContent } from "@/components/ui/card"
import avatar from "../assets/avatar.png"
import { Loader2 } from "lucide-react"

const UserProfile = () => {
  type User={
  name: string,
  careerId: string
  avatar: string,
  email: string;
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

/*   type Career={
    id: string
    name: string
  } */

  const navigate=useNavigate()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const accessToken = localStorage.getItem('token')
  const userId=localStorage.getItem('id')
/*   const [career, setCareer]=useState<Career | null >(null)
  const careerId=localStorage.getItem('careerId') */

  useEffect(() => {
      if (!accessToken || !userId) {
      navigate("/login")
      return
  } 
    const fetchData = async () => {
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

/*     const fetchCareerData=async()=>{
      setLoading(true)
      try {
        const res=await axios.get(`http://localhost:8000/api/careers/${careerId}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setCareer(res.data)
        console.log('Carrera del usuario', res.data)
      } catch (error) {
        console.log('Error al obtener la carrera')
      }
    } */
    if (userId) {
      fetchData()
    }
/*     if(!career){
      fetchCareerData()
    } */
  }, [userId])

  const careerName = user
  ? careers.find(c => c.id === user.careerId)?.name
  : "";

  return (
    <>
      <SideBar />
      <div className="flex-1 ml-0 md:ml-64 p-6 transition-all min-h-screen max-w-screen">
        {loading && !user ? (
          <div className="flex flex-col justify-center items-center h-screen">
            <Loader2 className="w-10 h-10 animate-spin" />
            <h2 className="mt-4">Cargando...</h2>
          </div>
          ) : (
            <Card className="flex items-center justify-center">
              <CardTitle>Perfil de Usuario</CardTitle>
              <CardContent>
                <ul className="flex flex-col gap-4 p-6 w-150 max-w-screen justify-center items-center">
                  <div className="avatar">
                    <div className="bg-gay-800 flex items-center justify-center">
                      <img src={avatar} className="flex flex-col items-center py-5 border-gray-800" />
                    </div>
                  </div>
                  <h1><strong>Nombre: </strong> {user?.name}</h1>
                  <h1><strong>Carrera: </strong>{careerName}</h1>
                  <h1><strong> E-mail:</strong> {user?.email}</h1>
                </ul>
              </CardContent>
            </Card>
          )}

      </div>
    </>
  )
}

export default UserProfile
