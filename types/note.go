package types

type Note struct {
	ID             string `json:"id"`
	Data           string `json:"data"`
	Views          int    `json:"views"`
	Expiration     int    `json:"expiration"`
	CustomPassword bool   `json:"customPassword"`
}

func (n *Note) Validate() map[string]string {
	errorMap := make(map[string]string)
	if n.Data == "" {
		errorMap["data"] = "Missing or invalid field"
	}
	if n.Views <= 0 {
		errorMap["views"] = "Missing or invalid field"
	}
	if n.Expiration < 0 {
		errorMap["expiration"] = "Invalid field"
	}
	return errorMap
}
