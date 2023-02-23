<?php
	try {
		$archivo = 'dbCitas.php';
		if (!file_exists($archivo)) {
			throw new Exception("<p>No se ha podido realizar la conexión con la base de datos</p>");
		}
		require_once $archivo;
	} catch (Exception $e) {echo $e->getMessage();}


	$stmtQry = $dbConn->prepare('SELECT * FROM "citas" WHERE email = :email;');
	$stmtQry->bindValue(':email', $_POST['email'], SQLITE3_TEXT);

	$results = $stmtQry->execute();

	if (empty($results->fetchArray())) {
		echo "Insertando cita<br>";
		$stmt = $dbConn->prepare('INSERT INTO "citas" ("email", "fecha", "hora", "tema") 
			VALUES ( :email, :fecha, :hora, :tema)');

		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
		$stmt->bindValue(':fecha', $_POST['fecha'], SQLITE3_TEXT);
		$stmt->bindValue(':hora',  $_POST['hora'], SQLITE3_TEXT);
		$stmt->bindValue(':tema',  $_POST['tema'], SQLITE3_TEXT);

		$stmt->execute();
		echo "Le enviaremos email para confirmar";
	}
	else {

	echo "Ya hay citas de este email. No hay que confirmar: <br>";
  $results->reset();

	while ($row = $results->fetchArray()) {
		echo $row['email'] . $row['fecha'] .$row['hora'] .$row['tema'] . "<br>";
	}

		echo "Insertando nueva cita<br>";
		$stmt = $dbConn->prepare('INSERT INTO "citas" ("email", "fecha", "hora", "tema") 
			VALUES ( :email, :fecha, :hora, :tema)');

		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
		$stmt->bindValue(':fecha', $_POST['fecha'], SQLITE3_TEXT);
		$stmt->bindValue(':hora',  $_POST['hora'], SQLITE3_TEXT);
		$stmt->bindValue(':tema',  $_POST['tema'], SQLITE3_TEXT);

		$stmt->execute();

 	}



		$dbConn->close();
//		header('Location: http://localhost/Coach/citas.html');
		die();	
?>
