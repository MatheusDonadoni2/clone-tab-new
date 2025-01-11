import useSWR from "swr";

async function fetchAPI(key) {
  const response = await fetch(key);
  const responseBody = await response.json();
  return responseBody;
}

export default function StatusPage() {
  return (
    <>
      <UpdatedAt />
    </>
  );
}

function UpdatedAt() {
  const { isLoading, data } = useSWR(
    "http://localhost:3000/api/v1/status",
    fetchAPI,
    {
      refreshInterval: 2000,
    },
  );

  let updatedAtText = "Carregando...";
  let databaseStatusInformation = "Carregando...";

  if (!isLoading && data) {
    updatedAtText = new Date(data.updated_at).toLocaleString("pt-BR");

    databaseStatusInformation = (
      <>
        <div>Versão: {data.dependencies.database.version}</div>
        <div>
          Conexões abertas: {data.dependencies.database.opened_connections}
        </div>
        <div>
          Conexões máximas: {data.dependencies.database.max_connections}
        </div>
      </>
    );
  }

  return (
    <>
      <h1>Status</h1>
      <div>{updatedAtText}</div>
      <h1>Database</h1>
      <div>{databaseStatusInformation}</div>
    </>
  );
}
