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

type Career={
    id: string
    name: string
  }

  const navigate=useNavigate()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const accessToken = localStorage.getItem('token')
  const userId=localStorage.getItem('id')
  const [careers, setCareers]=useState<Career[]>([])

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
const fetchCareerData=async()=>{
      setLoading(true)
      try {
        const res=await axios.get(`http://localhost:8000/api/careers/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`
          }
        })
        setCareers(res.data.data)
        console.log('Carrera del usuario', res.data)
      } catch (error) {
        console.log('Error al obtener la carrera')
      }
    } 
    fetchCareerData()
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
