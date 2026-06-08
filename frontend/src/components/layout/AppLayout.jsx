import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

const AppLayout = () => (
  <div className="soft-grid min-h-screen bg-slate-50/80 text-slate-950 transition-colors dark:bg-ink dark:text-white">
    <Sidebar />
    <div className="min-h-screen lg:pl-72">
      <Topbar />
      <main className="mx-auto w-full max-w-7xl px-4 pb-24 pt-6 sm:px-6 lg:px-8">
        <Outlet />
      </main>
    </div>
  </div>
);

export default AppLayout;
