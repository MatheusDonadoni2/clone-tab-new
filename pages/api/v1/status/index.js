import database from "infra/database";

async function status(request, response) {
  const updated_at = new Date().toISOString();

  const databaseVersionResult = await database.query("SHOW server_version;");
  const databaseVersionResultValue =
    databaseVersionResult.rows[0].server_version;

  const databaseMaxConnectionsResult = await database.query(
    "SHOW max_connections",
  );
  const databaseMaxConnectionsResultValue =
    databaseMaxConnectionsResult.rows[0].max_connections;

  const databaseName = process.env.POSTGRES_DB;
  const databaseOpenedConnectionsResult = await database.query({
    text: `SELECT COUNT(1)::int from pg_stat_activity WHERE datname = $1`,
    values: [databaseName],
  });
  const databaseOpenedConnectionsResultValue =
    databaseOpenedConnectionsResult.rows[0].count;

  response.status(200).json({
    updated_at: updated_at,
    dependencies: {
      database: {
        version: databaseVersionResultValue,
        max_connections: parseInt(databaseMaxConnectionsResultValue),
        opened_connections: parseInt(databaseOpenedConnectionsResultValue),
      },
    },
  });
}

export default status;
