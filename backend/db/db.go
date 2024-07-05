package db

import (
	"AetherNote/config"
	"AetherNote/types"
	"context"
	"fmt"
	"github.com/redis/go-redis/v9"
	"log"
	"os"
	"strconv"
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
	hashKey := n.CreateHashKey()
	hashMap := n.CreateHashMap()

	err := d.HSet(ctx, hashKey, hashMap).Err()
	if err != nil {
		return fmt.Errorf("Error storing data in Redis: %v", err)
	}

	configExpirationTime := config.GetMaxExpirationTime()
	if configExpirationTime == -1 {
		return nil
	}

	var ttl time.Duration
	if n.Expiration > 0 {
		ttl = time.Duration(n.Expiration) * time.Second
	} else {
		ttl = time.Duration(config.GetMaxExpirationTime()) * time.Second
	}
	if err = d.Expire(ctx, hashKey, ttl).Err(); err != nil {
		return err
	}
	return nil
}

func (d DB) FetchNote(id string) (types.Note, error) {
	hashKey := fmt.Sprintf("%s:%s", os.Getenv("REDIS_PREFIX"), id)
	var n types.Note
	ctx := context.Background()

	fetchNotePipeline := func(tx *redis.Tx) error {
		result, err := tx.HGetAll(ctx, hashKey).Result()
		if err != nil {
			return err
		}

		if len(result) == 0 {
			return fmt.Errorf("key does not exist")
		}

		views, _ := strconv.Atoi(result["views"])

		_, err = tx.TxPipelined(ctx, func(pipe redis.Pipeliner) error {
			pipe.HIncrBy(ctx, hashKey, "views", -1)
			n.Data = result["data"]
			customPasswordVal, _ := strconv.ParseBool(result["customPassword"])
			n.CustomPassword = customPasswordVal
			if views <= 1 {
				pipe.Del(ctx, hashKey)
			}
			return nil
		})
		return err
	}

	err := d.Watch(ctx, fetchNotePipeline, hashKey)
	if err != nil {
		return n, err
	}
	return n, nil
}
