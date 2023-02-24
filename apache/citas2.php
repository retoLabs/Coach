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
		$stmt = $dbConn->prepare('UPDATE "citas" set 
			email=:email,
			tema=:tema, 
			inic=:inic, 
			stat="RES" 
			WHERE id=:id;');

		$stmt->bindValue(':id',    $_POST['id'], SQLITE3_NUM);
		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
		$stmt->bindValue(':tema',  $_POST['tema'], SQLITE3_TEXT);
		$stmt->bindValue(':inic',  $_POST['inic'], SQLITE3_TEXT);

		$stmt->execute();
		echo "Primera cita insertada";
		echo "Le enviaremos email para confirmar dirección de correo";
	}
	else {

	echo "Ya hay citas de este email. No hay que confirmar: <br>";
  $results->reset();

	while ($row = $results->fetchArray()) {
		echo $row['email'] . $row['fecha'] .$row['hora'] .$row['tema'] . "<br>";
	}

		echo "Insertando nueva cita<br>";
		$stmt = $dbConn->prepare('UPDATE "citas" set 
			email=:email,
			tema=:tema,
			inic=:inic,
			stat= "OK"
			WHERE id=:id;');

		$stmt->bindValue(':id',    $_POST['id'], SQLITE3_NUM);
		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
		$stmt->bindValue(':tema',  $_POST['tema'], SQLITE3_TEXT);
		$stmt->bindValue(':inic',  $_POST['inic'], SQLITE3_TEXT);

		$stmt->execute();

 	}



		$dbConn->close();
//		header('Location: http://localhost/Coach/citas.html');
		die();	
?>
<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Citas 2</title>
</head>
<body>

</body>
</html>