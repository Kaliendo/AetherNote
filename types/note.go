package types

type Note struct {
	ID             string `json:"id"`
	Data           string `json:"data"`
	Views          int    `json:"views"`
	Expiration     int    `json:"expiration"`
	CustomPassword bool   `json:"customPassword"`
}
