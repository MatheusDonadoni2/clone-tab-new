const { CLIENT_PUBLIC_FILES_PATH } = require("next/dist/shared/lib/constants");
const { exec } = require("node:child_process");

function checkPostgres() {
  exec("docker exec postgres-dev pg_isready --host localhost", handleReturn);

  function handleReturn(error, stdout, stderr) {
    if (stdout.search("accepting connections") === -1) {
      process.stdout.write(".");
      checkPostgres();
      return;
    }

    console.log("\nPostgres está pronto e aceitando conexões. \n");
  }
}

process.stdout.write("\n\nAguardando base de dados aceita conexões.");
checkPostgres();