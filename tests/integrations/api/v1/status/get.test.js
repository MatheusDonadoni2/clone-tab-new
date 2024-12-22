import orchestrator from "tests/orchestrator";

beforeAll(async () => {
  await orchestrator.waitForAllServices();
});

test("Get to /api/v1/status", async () => {
  const response = await fetch("http://localhost:3000/api/v1/status");
  expect(response.status).toBe(200);

  const responseBody = await response.json();
  expect(responseBody.updated_at).toBeDefined();

  const parseUpdatedAt = new Date(responseBody.updated_at).toISOString();
  expect(parseUpdatedAt).toEqual(responseBody.updated_at);

  const databaseVersion = responseBody.dependencies.database.version;
  expect(databaseVersion).toEqual("16.0");

  const databaseMaxConnection =
    responseBody.dependencies.database.max_connections;
  expect(databaseMaxConnection).toEqual(100);

  const databaseOpenedConnections =
    responseBody.dependencies.database.opened_connections;

  expect(databaseOpenedConnections).toEqual(1);
});
