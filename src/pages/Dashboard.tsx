import Sidebar from "@/components/SideBar"

const Dashboard = () => {
  return (
    <div className="flex h-screen bg-gray-900 text-gray-100">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="w-full p-6 bg-gray-900 text-center">
          <h1 className="text-xl font-bold text-white">Página Principal</h1>
        </header>
        <main className="flex-1 ml-0 md:ml-64 p-6 transition-all">
          <a href="#" className="bg-neutral-primary-soft block max-w-sm p-6 border border-default rounded-base shadow-xs hover:bg-neutral-secondary-medium">
              <h5 className="mb-3 text-2xl font-semibold tracking-tight text-heading leading-8">Noteworthy technology acquisitions 2021</h5>
              <p className="text-body">Here are the biggest technology acquisitions of 2025 so far, in reverse chronological order.</p>
          </a>
        </main>
      </div>
    </div>
  ) 
}

export default Dashboard
