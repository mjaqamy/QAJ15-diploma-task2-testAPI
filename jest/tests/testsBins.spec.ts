import { BinsClient } from "../libs/apiClient";
import { Response } from "superagent";

describe("Тест API JSONBin (jest)", () => {
    const binsClient = new BinsClient();
    let createdId: string;
    const testObject = { name: "Anna", age: 25 };

    // POST (5 тестов)
    describe("Проверки для POST /b (Создание объекта)", () => {
        let resPost: Response;

        beforeAll(async () => {
            resPost = await binsClient.postObject(testObject);
            if (resPost.body && resPost.body.metadata) {
                createdId = resPost.body.metadata.id;
            }
        });

        test("1. POST - проверка успешного статуса 200", async () => {
            expect(resPost.status).toBe(200);
        });

        test("2. POST - проверка наличия блока metadata в ответе", async () => {
            expect(resPost.body).toHaveProperty("metadata");
        });

        test("3. POST - проверка сохраненного имени в record", async () => {
            expect(resPost.body.record.name).toBe("Anna");
        });

        test("4. POST - проверка сохраненного возраста в record", async () => {
            expect(resPost.body.record.age).toBe(25);
        });

        test("5. POST - проверка, что имя не пустое", async () => {
            expect(resPost.body.record.name.length).toBeGreaterThan(0);
        });
    });

    // GET (5 тестов)
    describe("Проверки для GET /b/{id} (Получение объекта)", () => {
        let resGet: Response;

        beforeAll(async () => {
            resGet = await binsClient.getObjectById(createdId);
        });

        test("1. GET - проверка статуса ответа 200", async () => {
            expect(resGet.status).toBe(200);
        });

        test("2. GET - проверка корректности данных внутри объекта", async () => {
            expect(resGet.body.record.name).toBe("Anna");
        });

        test("3. GET - проверка, что метаданные содержат правильный id", async () => {
            expect(resGet.body.metadata.id).toBe(createdId);
        });

        test("4. GET - Негативный: проверка статуса 404 при несуществующем id", async () => {
            const res = await binsClient.getObjectById("660000000000000000000000");
            expect(res.status).toBe(404);
        });

        test("5. GET - Негативный: проверка статуса 400 при неверном формате id", async () => {
            const res = await binsClient.getObjectById("invalid-format-id");
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid Bin Id provided");
        });
    });

    // PUT (5 тестов)
    describe("Проверки для PUT /b/{id} (Обновление объекта)", () => {
        const updatedObject = { name: "Anna Updated", age: 26 };
        let resPut: Response;

        beforeAll(async () => {
            resPut = await binsClient.putObject(createdId, updatedObject);
        });

        test("1. PUT - проверка успешного статуса 200", async () => {
            expect(resPut.status).toBe(200);
        });

        test("2. PUT - проверка, что имя объекта обновилось", async () => {
            expect(resPut.body.record.name).toBe("Anna Updated");
        });

        test("3. PUT - проверка, что возраст объекта обновился", async () => {
            expect(resPut.body.record.age).toBe(26);
        });

        test("4. PUT - Негативный: обновление несуществующего id возвращает 404", async () => {
            const res = await binsClient.putObject("660000000000000000000000", updatedObject);
            expect(res.status).toBe(404);
        });

        test("5. PUT - Негативный: обновление с неверным форматом id возвращает 400", async () => {
            const res = await binsClient.putObject("bad-id-format", updatedObject);
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid Bin Id provided");
        });
    });

    // DELETE (5 тестов)
    describe("Проверки для DELETE /b/{id} (Удаление объекта)", () => {
        test("1. DELETE - успешное удаление созданного объекта", async () => {
            const res = await binsClient.deleteObject(createdId);
            expect(res.status).toBe(200);
            expect(res.body.message).toContain("Bin deleted successfully");
        });

        test("2. DELETE - проверка, что ответ содержит id удаленного объекта", async () => {
            const tempRes = await binsClient.postObject(testObject);
            const tempId = tempRes.body.metadata.id;

            const res = await binsClient.deleteObject(tempId);
            expect(res.body.metadata.id).toBe(tempId);
        });

        test("3. DELETE - Негативный: повторное удаление того же объекта возвращает 404", async () => {
            const res = await binsClient.deleteObject(createdId);
            expect(res.status).toBe(404);
        });

        test("4. DELETE - Негативный: удаление объекта с несуществующим id возвращает 404", async () => {
            const res = await binsClient.deleteObject("660000000000000000000000");
            expect(res.status).toBe(404);
        });

        test("5. DELETE - Негативный: удаление с неверным форматом id возвращает 400", async () => {
            const res = await binsClient.deleteObject("wrong-id-format");
            expect(res.status).toBe(400);
            expect(res.body.message).toBe("Invalid Bin Id provided");
        });
    });
});
