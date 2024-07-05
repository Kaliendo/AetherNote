package db

import (
	"AetherNote/types"
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
	"time"
)

type DB struct {
	*redis.Client
}

func CreateConnection() DB {
	client := redis.NewClient(&redis.Options{
		Addr:     fmt.Sprintf("%s:%s", os.Getenv("REDIS_HOST"), os.Getenv("REDIS_PORT")),
		Password: "",
		DB:       0,
	})
	_, err := client.Ping(context.Background()).Result()
	if err != nil {
		log.Fatal(err)
	}
	return DB{client}
}

func (d DB) SaveNote(n types.Note) error {
	ctx := context.Background()
	hashKey := fmt.Sprintf("note:%s", n.ID)
	hashMap := map[string]any{
		"data":           n.Data,
		"views":          n.Views,
		"customPassword": n.CustomPassword,
	}

	err := d.HSet(ctx, hashKey, hashMap).Err()
	if err != nil {
		return fmt.Errorf("Error storing data in Redis: %v", err)
	}

	if n.Expiration > 0 {
		ttl := time.Duration(n.Expiration) * time.Second
		if err = d.Expire(ctx, hashKey, ttl).Err(); err != nil {
			return err
		}
	}
	return nil
}
