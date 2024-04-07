<?php
		echo "Validando correo<br>";
	try {
		$archivo = 'dbCitas.php';
		if (!file_exists($archivo)) {
			throw new Exception("<p>No se ha podido realizar la conexión con la base de datos</p>");
		}
		require_once $archivo;
	} catch (Exception $e) {echo $e->getMessage();}


		$stmt = $dbConn->prepare('UPDATE "citas" set 
			stat= "OK"
			WHERE id=:id;');

		$stmt->bindValue(':id',    $_GET['id'], SQLITE3_NUM);

		$stmt->execute();
		
?>