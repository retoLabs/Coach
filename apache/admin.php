<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Citas</title>
</head>
<body>
<?php
	try {
		$archivo = './dbCitas.php';
		if (!file_exists($archivo)) {
			throw new Exception("<p>No se ha podido realizar la conexión con la base de datos</p>");
		}
		require_once $archivo;
	} catch (Exception $e) {echo $e->getMessage();}

	if (isset($_POST['submit'])) {
		echo "Pasa";

		$stmt = $dbConn->prepare('INSERT INTO "citas" ("email", "fecha", "hora", "tema") 
			VALUES ( :email, :fecha, :hora, :tema)');

		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
		$stmt->bindValue(':fecha', $_POST['fecha'], SQLITE3_TEXT);
		$stmt->bindValue(':hora',  $_POST['hora'], SQLITE3_TEXT);
		$stmt->bindValue(':tema',  $_POST['tema'], SQLITE3_TEXT);

		$stmt->execute();

		unset($_POST['submit']);
	}
	
	$stmtQry = $dbConn->prepare('SELECT * FROM "citas";');

	$results = $stmtQry->execute();
	while ($row = $results->fetchArray()) {
		echo $row['email'] . $row['fecha'] .$row['hora'] .$row['tema'] . "<br>";
	}

?>

	<form action="" method="post">
		<input type="hidden" name="email"><br>
		<label for="fecha">fecha</label>
		<input type="text" name="fecha"><br>
		<label for="hora">hora</label>
		<input type="text" name="hora"><br>
		<input type = "hidden" name="tema"></textarea>
		<input type="submit" name="submit" value="Enviar">
	</form>


</body>
</html>