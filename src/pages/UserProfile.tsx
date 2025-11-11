import SideBar from "@/components/SideBar"
import axios from "axios"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardTitle, CardContent } from "@/components/ui/card"

const UserProfile = () => {

  type User={
  name: string,
  username: string,
  age: number,
  avatar: string,
  email: string;
  likedMovies: string[]
}

  const navigate=useNavigate()

  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const token = localStorage.getItem('token')
  const id=Number(localStorage.getItem('id'))

  useEffect(() => {
       if (!token || !id) {
      navigate("/login")
      return
  } 
    const fetchData = async () => {
      try {
        setLoading(true)
        const response = await axios.get(`http://localhost:3000/user/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        })
        setUser(response.data)
      } catch (error) {
        console.error("Error al obtener datos del usuario:", error)
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchData()
    }
  }, [id])

  return (
    <>
      <SideBar />
      <div className="flex items-center justify-center">
        {loading && !user ?   (
          <h1>Cargando...</h1>
        ): (
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
                <h1><strong>Edad: </strong> {user?.age}</h1>
                <h1><strong> Username:</strong>  {user?.username}</h1>
                <h1><strong> E-mail:</strong>  {user?.email}</h1>
              </ul>
            </CardContent>
          </Card>
        )
      }
      </div>
    </>
  )
}

export default UserProfile
