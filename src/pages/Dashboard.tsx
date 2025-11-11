import Sidebar from "@/components/SideBar"

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="w-full p-6 bg-gray-900 text-center">
          <h1 className="text-2xl font-bold text-cyan-400">Dashboard</h1>
          <button className="bg-gray-400">Añadir Proyecto</button>
        </header>

        {/* Contenido */}
        <main className="flex-1 overflow-auto p-6 flex justify-center items-start">
            <h1>Proyectos: </h1>
        </main>
      </div>
    </div>
  )
}

export default Dashboard
