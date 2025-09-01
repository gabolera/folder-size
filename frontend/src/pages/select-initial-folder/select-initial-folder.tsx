import usePathStore from "@/stores/path.store";
import { SelectFolder } from "../../../wailsjs/go/main/App";

export default function SelectInitialFolder() {
  const pathStore = usePathStore();

  const handleFolderSelect = async () => {
    try {
      const folderPath = await SelectFolder();
      if (folderPath) {
        pathStore.definePath(folderPath);
      }
    } catch (error) {
      console.error("Erro ao selecionar pasta:", error);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <div className="text-center space-y-4">         
          <button 
            onClick={handleFolderSelect}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Selecionar Pasta
          </button>

          {pathStore.path && (
            <div className="mt-4 p-4 bg-gray-100 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Pasta selecionada:</p>
              <p className="text-sm font-mono text-gray-800 break-all">
                {pathStore.path}
              </p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
