import superagent from "superagent";
import { PostObjectRequestBody, PutObjectRequestBody } from "./types";
import dotenv from "dotenv";
dotenv.config();

export class BinsClient {
    private URL = "https://api.jsonbin.io/v3/b";
    private API_KEY = process.env.API_KEY || "";

    async postObject(bodyObject: PostObjectRequestBody) {
        return await superagent
            .post(this.URL)
            .set("X-Master-Key", this.API_KEY)
            .set("Content-Type", "application/json")
            .send(bodyObject)
            .catch((error) => error.response || error);
    }

    async getObjectById(id: string) {
        return await superagent
            .get(`${this.URL}/${id}`)
            .set("X-Master-Key", this.API_KEY)
            .catch((error) => error.response || error);
    }

    async putObject(id: string, bodyObjectPut: PutObjectRequestBody) {
        return await superagent
            .put(`${this.URL}/${id}`)
            .set("X-Master-Key", this.API_KEY)
            .set("Content-Type", "application/json")
            .send(bodyObjectPut)
            .catch((error) => error.response || error);
    }

    async deleteObject(id: string) {
        return await superagent
            .delete(`${this.URL}/${id}`)
            .set("X-Master-Key", this.API_KEY)
            .catch((error) => error.response || error);
    }
}
