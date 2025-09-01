import {
  ResizablePanelGroup,
  ResizablePanel,
  ResizableHandle,
} from "@/components/ui/resizable";
import { FileList } from "@/components/file-list";
import usePathStore from "@/stores/path.store";
import { ScannerLayout } from "./layouts/scanner-layout";
import { useState, useEffect } from "react";
import { ScanFolder } from "../../../wailsjs/go/main/App";
import { cn } from "@/lib/utils";

// Interface baseada na estrutura Go ItemInfo
interface FileItem {
  name: string;
  path: string;
  size: number;
  sizeHuman: string;
  fileCount: number;
  folderCount: number;
  lastModified: string;
  isHidden: boolean;
  extension: string;
  type: string;
  // Campos computados para compatibilidade
  isDirectory: boolean;
}

export function Scanner() {
  const pathStore = usePathStore();
  const [selectedFile, setSelectedFile] = useState<string | undefined>();
  const [currentPath, setCurrentPath] = useState(pathStore.path || "/");
  const [currentFiles, setCurrentFiles] = useState<FileItem[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Função para escanear pasta usando a API Go
  const scanCurrentFolder = async (path: string) => {
    if (!path) return;

    setIsLoading(true);
    setError(null);

    try {
      // Chama a função Go ScanFolder
      const items = await ScanFolder(path);

      // Converte os dados para o formato esperado pelo FileList
      const convertedItems: FileItem[] = items.map((item: any) => ({
        ...item,
        isDirectory: item.type === "folder",
        // Converter a data se necessário
        lastModified: item.lastModified
          ? new Date(item.lastModified).toISOString()
          : new Date().toISOString(),
      }));

      setCurrentFiles(convertedItems);
    } catch (err) {
      console.error("Erro ao escanear pasta:", err);
      setError("Erro ao carregar pasta");
      setCurrentFiles([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Escanear pasta quando o caminho mudar
  useEffect(() => {
    if (currentPath) {
      scanCurrentFolder(currentPath);
    }
  }, [currentPath]);

  // Atualizar caminho quando a store mudar
  useEffect(() => {
    if (pathStore.path && pathStore.path !== currentPath) {
      setCurrentPath(pathStore.path);
    }
  }, [pathStore.path]);

  const handleFileSelect = (file: FileItem) => {
    if (file.isDirectory) {
      // Navegar para a pasta
      setCurrentPath(file.path);
    } else {
      // Selecionar arquivo
      setSelectedFile(file.path);
      console.log("Arquivo selecionado:", file);
    }
  };

  const handlePathChange = (newPath: string) => {
    setCurrentPath(newPath);
    setSelectedFile(undefined); // Limpar seleção ao mudar de pasta
  };

  return (
    <ScannerLayout>
      <ResizablePanelGroup
        direction="horizontal"
        className="flex min-h-screen w-screen"
      >
        <ResizablePanel className="flex w-1/4 max-w-1/4">
          {isLoading ? (
            <div className="flex mx-auto items-center justify-center h-full">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
                <p className="text-sm text-gray-600">Escaneando pasta...</p>
              </div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center text-red-600">
                <p className="text-sm">{error}</p>
                <button
                  onClick={() => scanCurrentFolder(currentPath)}
                  className="mt-2 px-3 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                >
                  Tentar novamente
                </button>
              </div>
            </div>
          ) : (
            <FileList
              files={currentFiles}
              selectedFile={selectedFile}
              onFileSelect={handleFileSelect}
              currentPath={currentPath}
              onPathChange={handlePathChange}
              className="w-full"
            />
          )}
        </ResizablePanel>

        <ResizableHandle />

        <ResizablePanel>
          <div className={cn("flex flex-col h-full")}>
            <div className="p-3 border-b bg-gray-50 h-20 max-h-20">
              <div className="flex items-center gap-2 mb-2">
                Novo menu
                <span className="text-xs text-gray-500 truncate">
                  {currentPath}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-sm text-gray-700">
                  Arquivos
                </h3>
                <div className="flex gap-1">Lateral</div>
              </div>
            </div>

            <div className="p-4">
            
            teste
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </ScannerLayout>
  );
}
