import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import usePathStore from "@/stores/path.store";

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
  isDirectory: boolean;
}

interface FileListProps {
  files: FileItem[];
  selectedFile?: string;
  onFileSelect: (file: FileItem) => void;
  className?: string;
  currentPath: string;
  onPathChange: (newPath: string) => void;
}

// Função para formatar tamanhos de forma amigável
const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  // Para tamanhos pequenos (B, KB), mostrar 2 casas decimais
  // Para tamanhos maiores (MB, GB, TB), mostrar 1 casa decimal
  const decimals = i <= 1 ? 2 : 1;
  
  const size = parseFloat((bytes / Math.pow(k, i)).toFixed(decimals));
  
  // Adicionar espaçamento para alinhar melhor
  return `${size} ${sizes[i]}`;
};

// Função para formatar datas de forma amigável
const formatDate = (dateString: string): string => {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    // Se for hoje, mostrar apenas a hora
    if (diffDays === 1) {
      return `Hoje às ${date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    
    // Se for ontem
    if (diffDays === 2) {
      return `Ontem às ${date.toLocaleTimeString('pt-BR', { 
        hour: '2-digit', 
        minute: '2-digit' 
      })}`;
    }
    
    // Se for na última semana
    if (diffDays <= 7) {
      return `${diffDays - 1} dia(s) atrás`;
    }
    
    // Se for no último mês
    if (diffDays <= 30) {
      const weeks = Math.floor(diffDays / 7);
      return `${weeks} semana(s) atrás`;
    }
    
    // Se for no último ano
    if (diffDays <= 365) {
      return date.toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: 'short'
      });
    }
    
    // Se for mais antigo
    return date.toLocaleDateString('pt-BR', {
      year: 'numeric',
      month: 'short'
    });
    
  } catch {
    return 'Data inválida';
  }
};

export function FileList({ 
  files, 
  selectedFile, 
  onFileSelect, 
  className, 
  currentPath, 
  onPathChange 
}: FileListProps) {
  const pathStore = usePathStore()
  const { sortBy, sortOrder } = pathStore

  // Ordenar todos os itens juntos, independente do tipo
  const sortedFiles = [...files].sort((a, b) => {
    let comparison = 0;
    
    switch (sortBy) {
      case 'name':
        comparison = a.name.localeCompare(b.name);
        break;
      case 'size':
        comparison = a.size - b.size;
        break;
      case 'date':
        comparison = new Date(a.lastModified).getTime() - new Date(b.lastModified).getTime();
        break;
      default:
        comparison = a.name.localeCompare(b.name);
    }
    
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const handleFileClick = (file: FileItem) => {
    if (file.isDirectory) {
      // Navegar para a pasta
      onPathChange(file.path);
    } else {
      // Selecionar arquivo
      onFileSelect(file);
    }
  };

  const handleBackClick = () => {
    const pathParts = currentPath.split(/[\\/]/).filter(Boolean);
    if (pathParts.length > 1) {
      const newPath = pathParts.slice(0, -1).join('/');
      onPathChange(newPath);
    }
  };

  const canGoBack = currentPath.split(/[\\/]/).filter(Boolean).length > 1;

  return (
    <div className={cn("flex flex-col h-full", className)}>
      {/* Header com navegação */}
      <div className="p-3 border-b bg-gray-50 h-20 max-h-20">
        <div className="flex items-center gap-2 mb-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
            disabled={!canGoBack}
            className="h-7 px-2 text-xs"
          >
            ← Voltar
          </Button>
          <span className="text-xs text-gray-500 truncate">
            {currentPath}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-sm text-gray-700">
            Arquivos ({files.length})
          </h3>
          <div className="flex gap-1">
            {(['name', 'size', 'date'] as const).map((sort) => (
              <Button
                key={sort}
                variant={sortBy === sort ? "default" : "ghost"}
                size="sm"
                onClick={() => {
                  if (sortBy === sort) {
                    pathStore.setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
                  } else {
                    pathStore.setSortBy(sort);
                    pathStore.setSortOrder('asc');
                  }
                }}
                className="h-6 px-2 text-xs"
              >
                {sort === 'name' && 'Nome'}
                {sort === 'size' && 'Tamanho'}
                {sort === 'date' && 'Data'}
                {sortBy === sort && (
                  <span className="ml-1">
                    {sortOrder === 'asc' ? '↑' : '↓'}
                  </span>
                )}
              </Button>
            ))}
          </div>
        </div>
      </div>

      <ScrollArea className="h-[83.5vh] w-full">
        <div className="p-2 space-y-1">
          {sortedFiles.map((item) => (
            <div
              key={item.path}
              onClick={() => handleFileClick(item)}
              className={cn(
                "flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors",
                item.isDirectory 
                  ? "hover:bg-blue-50 border border-transparent hover:border-blue-200"
                  : "hover:bg-gray-100",
                selectedFile === item.path && "bg-blue-100 border border-blue-200"
              )}
            >
              <div className="flex-shrink-0 w-5 h-5">
                {item.isDirectory ? (
                  <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z" clipRule="evenodd" />
                  </svg>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className={cn(
                    "text-sm font-medium truncate flex-1 mr-2",
                    item.isDirectory ? "text-blue-900" : "text-gray-900"
                  )}>
                    {item.name}
                  </span>
                  <span className={cn(
                    "text-xs flex-shrink-0",
                    "text-gray-500"
                  )}>
                    {formatFileSize(item.size)}
                  </span>
                </div>
                
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  {!item.isDirectory && item.extension && (
                    <>
                      <span className="bg-gray-200 px-1 py-0.5 rounded text-xs">
                        {item.extension}
                      </span>
                      <span>•</span>
                    </>
                  )}
                  <span>{formatDate(item.lastModified)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>

      {/* Footer com contadores */}
      <div className="p-3 border-t bg-gray-50 text-xs text-gray-600 mt-auto">
        <div className="flex justify-between">
          <span>{files.length} item(s)</span>
          <span>
            {files.filter(f => f.isDirectory).length} pasta(s), {files.filter(f => !f.isDirectory).length} arquivo(s)
          </span>
        </div>
      </div>
    </div>
  );
}

