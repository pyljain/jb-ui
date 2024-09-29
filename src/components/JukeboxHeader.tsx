import { Music } from "lucide-react";

const JukeboxHeader = () => (
    <div className="bg-gray-900 text-white py-3 mb-6 shadow-md">
      <div className="container mx-auto flex items-center justify-between px-4">
        <div className="flex items-center space-x-3">
          <Music className="w-6 h-6 text-red-400" />
          <h1 className="text-xl tracking-wide font-semibold">JUKEBOX</h1>
        </div>
        <nav>
          <ul className="flex space-x-4 text-sm">
            <li><a href="#" className="hover:text-red-400 font-thin font-extralight transition-colors">DASHBOARD</a></li>
            <li><a href="#" className="hover:text-red-400 font-thin font-extralight transition-colors">RUNS</a></li>
            <li><a href="#" className="hover:text-red-400 font-thin font-extralight transition-colors">SETTINGS</a></li>
          </ul>
        </nav>
      </div>
    </div>
  );

export default JukeboxHeader;