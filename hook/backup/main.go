// package main

// import (
// 	"bytes"
// 	"context"
// 	"log"

// 	"github.com/minio/minio-go/v7"
// 	"github.com/minio/minio-go/v7/pkg/credentials"
// 	"github.com/pocketbase/pocketbase"
// 	"github.com/pocketbase/pocketbase/core"
// )

// func main() {
// 	app := pocketbase.New()

// 	minioClient, err := minio.New("", &minio.Options{
// 		Creds:  credentials.NewStaticV4("", "", ""),
// 		Secure: false,
// 	})
// 	if err != nil {
// 		log.Fatal("Gagal menghubungkan ke MinIO:", err)
// 	}

// 	app.OnRecordAfterCreateRequest("pesanan").Add(func(e *core.RecordCreateEvent) error {
		
// 		bucketName := "backup-bucket"
// 		objectName := "backup_" + e.Record.Id + ".json"
		
// 		content := []byte(`{"id": "` + e.Record.Id + `", "status": "created"}`)
// 		reader := bytes.NewReader(content)

// 		info, err := minioClient.PutObject(context.Background(), bucketName, objectName, reader, int64(len(content)), minio.PutObjectOptions{
// 			ContentType: "application/json",
// 		})

// 		if err != nil {
// 			log.Println("Gagal upload ke MinIO:", err)
// 		} else {
// 			log.Printf("Berhasil upload ke MinIO: %s (Size: %d)\n", info.Key, info.Size)
// 		}

// 		return nil
// 	})

// 	if err := app.Start(); err != nil {
// 		log.Fatal(err)
// 	}
// }