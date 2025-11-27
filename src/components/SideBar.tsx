import { useEffect, useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import axios from "axios"
import { useAuthStore } from "@/store/authStore"
import { Home, User, Settings, LogOut, Menu } from "lucide-react"
import avatar from "../assets/avatar.png"
import { Dialog, DialogClose, DialogContent, DialogTrigger, DialogDescription, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog"
import { Button } from "./ui/button"
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "./ui/alert"

const Sidebar = () => {

  const userId = useAuthStore((s) => s.userId)
  const user = useAuthStore((s) => s.user)
  const setUser = useAuthStore((s) => s.setUser)
  const navigate = useNavigate()
  const isLogged = useAuthStore((s) => s.isLoggedIn)
  const logoutStore = useAuthStore((s) => s.logout)
  const accesToken = localStorage.getItem("token")
  const [success, setSuccess]=useState(false)
  const [errorAlert, setErrorAlert]=useState(false)
  const [open, setOpen] = useState(true)

  useEffect(() => {
    if (!isLogged || !accesToken || !userId) return
    axios.get(`http://localhost:8000/api/users/${userId}`, {
        headers: { Authorization: `Bearer ${accesToken}` },
      })
      .then((res) => setUser(res.data))
      .catch((err) => console.log(err))
  }, [isLogged, userId, accesToken, setUser])

  const handleLogout = () => {
    try {
    localStorage.removeItem("token")
    localStorage.removeItem("id")
    logoutStore()
    setSuccess(true)
    setTimeout(()=>{
      setSuccess(false);
      navigate("/login")
    }, 2000)
    } catch (error) {
      setErrorAlert(true)
    }
  }

  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="md:hidden fixed top-4 left-4 z-50 p-2 bg-gray-800 text-gray-200 rounded-md"
      >
        <Menu className="w-6 h-6" />
      </button>
      {open && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-30 md:hidden"
          onClick={() => setOpen(false)}
        ></div>
      )}
      <aside
        className={`fixed top-0 left-0 h-full bg-gray-900 text-gray-100 shadow-xl transition-all duration-300 z-40 
        ${open ? "translate-x-0" : "-translate-x-full"} w-64`}
      >
        <div className="flex items-center justify-center py-6 border-b border-gray-800 gap-3">
          <img src="https://cdn-icons-png.flaticon.com/512/4196/4196599.png" alt="icon" className="w-7 h-7 "/>
          <h1 className="text-white font-bold text-xl">ThesisManager</h1>
        </div>

        {isLogged && user && (
          <div className="flex flex-col items-center py-5 border-b border-gray-800">
            <img src={avatar} className="w-15 h-15 rounded-full object-cover mb-3 bg-white  " />
            <p className="font-semibold">{user.name}</p>
            <p className="text-sm text-gray-400">{user.email}</p>
          </div>
        )}

        <nav className="flex flex-col gap-1 p-3 mt-4">
          <NavItem to="/dashboard" icon={<Home />} label="Dashboard" />
          <NavItem to="/profile" icon={<User />} label="Perfil" />
          <NavItem to="/projects" icon={<Settings />} label="Proyectos" />

        <div className="py-7">
          {isLogged && (
              <Dialog>
                <DialogTrigger asChild className=" bg-red-600 rounded-lg hover:bg-red-800 cursor-pointer">
                  <button className="flex items-center gap-2 p-3 mt-4 w-full text-left">
                    <LogOut className="w-5 h-5" />
                    <span>Cerrar Sesión</span>
                  </button>
                </DialogTrigger>

                <DialogContent className="sm:max-w-md bg-gray-800">
                  <DialogHeader>
                    <DialogTitle className="text-m">Cerrar Sesión</DialogTitle>
                  </DialogHeader>

                  <DialogDescription>
                    ¿Está seguro que desea cerrar sesión?
                  </DialogDescription>

                  <DialogFooter>
                    <DialogClose asChild>
                      <Button className="bg-gray-700 hover:bg-gray-900" variant="ghost">
                        Cancelar
                      </Button>
                    </DialogClose>
                    <Button
                      className="bg-red-500 hover:bg-red-900 cursor-pointer"
                      onClick={handleLogout}
                    >
                      Cerrar Sesión
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
          )}
          {success && (
          <Alert className="fixed top-4 right-4 w-auto bg-green-700 text-white">
            <CheckCircle2Icon />
            <AlertTitle>Sesión cerrada</AlertTitle>
            <AlertDescription>
              Se ha cerrado sesión correctamente!
            </AlertDescription>
          </Alert>
        )}
        {errorAlert && (
          <Alert className="fixed top-4 right-4 w-auto bg-red-700 text-white">
            <AlertCircleIcon />
            <AlertTitle>Error al cerrar sesión</AlertTitle>
            <AlertDescription>
              Ha ocurrido un error intentar cerrar sesión, <br />intente nuevamente
            </AlertDescription>
          </Alert>
        )}
          </div>
        </nav>
      </aside>
    </>
  )
}

const NavItem = ({ to, icon, label }: { to: string; icon: any; label: string }) => (
  <NavLink
    to={to}
    className={({ isActive }) =>
      `flex items-center gap-3 p-3 rounded-lg transition-all ${
        isActive ? "bg-cyan-700 text-white" : "hover:bg-gray-800 text-gray-300"
      }`
    }
  >
    <div className="grid place-items-center">{icon}</div>
    <span>{label}</span>
  </NavLink>
)

export default Sidebar
