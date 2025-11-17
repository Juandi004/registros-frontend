import SideBar from "@/components/SideBar"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardTitle, CardContent } from "@/components/ui/card"

const UserProfile = () => {

  type User={
  name: string,
  careerId: string
  avatar: string,
  email: string;
}

  const navigate=useNavigate()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const accessToken = localStorage.getItem('token')
  const userId=localStorage.getItem('id')

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

    if (userId) {
      fetchData()
    }
  }, [userId])

  return (
    <>
      <SideBar />
      <div className="flex-1 ml-0 md:ml-64 p-6 transition-all min-h-screen">
        {loading && !user ? (
            <h1>Cargando...</h1>
          ) : (
            <Card className="flex items-center justify-center">
              <CardTitle>Perfil de Usuario</CardTitle>
              <CardContent>
                <ul className="flex flex-col gap-4 p-6 w-150 max-w-sm">
                  <div className="avatar">
                    <div className="ring-primary ring-offset-base-100 w-24 rounded-full ring-2 ring-offset-2">
                      <img src={user?.avatar} />
                    </div>
                  </div>
                  <h1><strong>Nombre: </strong> {user?.name}</h1>
                  <h1><strong> Carrera:</strong> {user?.careerId}</h1>
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
