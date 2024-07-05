package config

import (
	"log"
	"os"
	"strconv"
	"sync"

	"github.com/joho/godotenv"
)

var (
	uploadLimit       int64
	maxExpirationTime int
	maxViews          int
	once              sync.Once
)

func init() {
	once.Do(func() {
		if err := godotenv.Load(); err != nil {
			log.Fatal(err)
		}

		maxExpirationTimeStr, err := strconv.Atoi(os.Getenv("MAX_EXPIRATION_TIME"))
		if err != nil {
			log.Fatalln(err)
		}
		maxExpirationTime = maxExpirationTimeStr

		maxViewsStr, err := strconv.Atoi(os.Getenv("MAX_VIEWS"))
		if err != nil {
			log.Fatalln(err)
		}
		maxViews = maxViewsStr

		uploadLimitStr, err := strconv.Atoi(os.Getenv("UPLOAD_LIMIT"))
		if err != nil {
			log.Fatalln(err)
		}
		uploadLimit = int64(uploadLimitStr)
	})
}

func GetUploadLimit() int64 {
	return uploadLimit
}

func GetMaxExpirationTime() int {
	return maxExpirationTime
}

func GetMaxViews() int {
	return maxViews
}
