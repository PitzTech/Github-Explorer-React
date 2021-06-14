import conn from "axios"

const api = conn.create({
	baseURL: "https://api.github.com/"
})

export default api
