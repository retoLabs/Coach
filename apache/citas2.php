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
		$stmt = $dbConn->prepare('UPDATE "citas" set email=:email,tema=:tema WHERE id=:id;');

		$stmt->bindValue(':id',    $_POST['id'], SQLITE3_NUM);
		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
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
		$stmt = $dbConn->prepare('UPDATE "citas" set email=:email,tema=:tema WHERE id=:id;');

		$stmt->bindValue(':id',    $_POST['id'], SQLITE3_NUM);
		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
		$stmt->bindValue(':tema',  $_POST['tema'], SQLITE3_TEXT);

		$stmt->execute();

 	}



		$dbConn->close();
//		header('Location: http://localhost/Coach/citas.html');
		die();	
?>
