package foldersize

import "time"

const (
	ItemTypeFolder = "folder"
	ItemTypeFile   = "file"
)

type ItemInfo struct {
	Name         string    `json:"name"`
	Path         string    `json:"path"`
	Size         int64     `json:"size"`
	SizeHuman    string    `json:"sizeHuman"`
	FileCount    int64     `json:"fileCount"`
	FolderCount  int64     `json:"folderCount"`
	LastModified time.Time `json:"lastModified"`
	IsHidden     bool      `json:"isHidden"`
	Extension    string    `json:"extension"`
	Type         string    `json:"type"`
}

type FolderAnalysis struct {
	CurrentPath    string        `json:"currentPath"`
	TotalSize      int64         `json:"totalSize"`
	TotalSizeHuman string        `json:"totalSizeHuman"`
	ItemCount      int           `json:"itemCount"`
	FolderCount    int           `json:"folderCount"`
	FileCount      int           `json:"fileCount"`
	Items          []ItemInfo    `json:"items"`
	AnalysisTime   time.Duration `json:"analysisTime"`
	Timestamp      time.Time     `json:"timestamp"`
}
