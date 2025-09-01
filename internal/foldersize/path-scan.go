package foldersize

import (
	"fmt"
	"io/fs"
	"os"
	"path/filepath"
	"sort"
)

type PathScanService struct {
	currentAnalysis *FolderAnalysis
	isAnalyzing     bool
}

func New() *PathScanService {
	return &PathScanService{
		isAnalyzing: false,
		currentAnalysis: &FolderAnalysis{
			Items: []ItemInfo{},
		},
	}
}

func (pss *PathScanService) ScanPath(path string) {
	items, err := os.ReadDir(path)
	if err != nil {
		fmt.Printf("Erro ao ler diretório")
		return
	}

	for _, item := range items {
		fullPath := filepath.Join(path, item.Name())
		fileInfo, err := os.Stat(fullPath)
		if err != nil {
			fmt.Printf("Ocorreu um erro ao buscar o status de %s", fullPath)
			continue
		}

		size, err := getItemSize(fullPath)
		if err != nil {
			return
		}

		itemType := ItemTypeFile
		if item.IsDir() {
			itemType = ItemTypeFolder
		}

		pss.currentAnalysis.Items = append(pss.currentAnalysis.Items, ItemInfo{
			Name:         item.Name(),
			Path:         fullPath,
			Size:         size,
			SizeHuman:    "a",
			LastModified: fileInfo.ModTime(),
			IsHidden:     false,
			Extension:    filepath.Ext(path),
			Type:         itemType,
		})
	}
}

func (pss *PathScanService) OrderByHeavyItem() {
	sort.Slice(pss.currentAnalysis.Items, func(i, j int) bool {
		return pss.currentAnalysis.Items[i].Size > pss.currentAnalysis.Items[j].Size
	})
}

func (pss *PathScanService) Items() []ItemInfo {
	return pss.currentAnalysis.Items
}

func getItemSize(folderPath string) (int64, error) {
	var totalSize int64

	err := filepath.Walk(folderPath, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}
		// If it's a regular file, add its size to the total
		if !info.IsDir() {
			totalSize += info.Size()
		}
		return nil
	})

	if err != nil {
		return 0, fmt.Errorf("error walking the directory: %w", err)
	}

	return totalSize, nil
}
