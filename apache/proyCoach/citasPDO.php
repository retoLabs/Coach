<!DOCTYPE html>
<html>
	<head>
	<meta charset="UTF-8">
	<title>Citas</title>
	<link href="https://cdn.jsdelivr.net/npm/bootstrap@5.0.0-beta2/dist/css/bootstrap.min.css" rel="stylesheet" integrity="sha384-BmbxuPwQa2lc/FVzBcNJ7UAyJxM6wuqIj61tLrc4wSX0szH/Ev+nYRRuWlolflfl" crossorigin="anonymous">
	</head>

	<body>
	<?php
	try {
		$archivo = 'dbCitas.php';
		if (!file_exists($archivo)) {
			throw new Exception("<p>No se ha podido realizar la conexión con la base de datos</p>");
		}
		require_once $archivo;
	} catch (Exception $e) {echo $e->getMessage();}


	if (isset($_POST['submit'])) {
		echo "Pasa";
		echo $_POST['email'];
/*
		$statement = $db->prepare('INSERT INTO "visits" ("user_id", "url", "time")
    VALUES (:uid, :url, :time)');
$statement->bindValue(':uid', 1337);
$statement->bindValue(':url', '/test');
$statement->bindValue(':time', date('Y-m-d H:i:s'));
$statement->execute(); // you can reuse the statement with different values
*/

		$stmt = $dbConn->prepare('INSERT INTO "citas" ("email", "fecha", "hora", "tema") 
			VALUES ( :email, :fecha, :hora, :tema)');

		$stmt->bindValue(':email', $_POST['email'], SQLITE3_TEXT);
		$stmt->bindValue(':fecha', $_POST['fecha'], SQLITE3_TEXT);
		$stmt->bindValue(':hora',  $_POST['hora'], SQLITE3_TEXT);
		$stmt->bindValue(':tema',  $_POST['tema'], SQLITE3_TEXT);

		$stmt->execute();

		$db->close();
		header('Location: http://localhost/Coach/citas.html');
		die();	
	}
	else { echo "No pasa<br>";}

/*		$dbConn->exec('BEGIN');

		$dbConn->query('DELETE FROM "citas"');

		$dbConn->query('INSERT INTO "citas" ("email","fecha","hora","tema") 
			VALUES ("yo@xxxx.com", "10/11/2023","10:45","Java")');
		$dbConn->exec('COMMIT');

		$res = $dbConn->query('SELECT * FROM citas');

		while ($row = $res->fetchArray()) {
			echo "{$row['email']} {$row['fecha']} {$row['hora']} {$row['tema']}\n";
		}
*/	

	?>



	<div class="container">
	<div class="row align-items-start">
	<div class="col-2"></div>
        
	<div class="col-8">   
    <h2>Alta de citas</h2>

		<form action="" method="post">
			<div class="mb-3">
				<label for="email" class="form-label">eMail:</label>
				<input type="text" name="email" class="form-control">
			</div>

			<div class="mb-3">
				<label for="fecha" class="form-label">Fecha</label>
				<input type="text" name="fecha" class="form-control">
			</div>

			<div class="mb-3">
				<label for="hora" class="form-label">Hora:</label>
				<input type="text" name="hora" class="form-control">
			</div>

			<div class="mb-3">
				<label for="tema" class="form-label">Tema</label>
				<input type="text" name="tema" class="form-control">
			</div>

			<input class="btn btn-primary" type="submit" name="submit" value="Enviar">
		</form>

		</div> <! col-8 -->
    </div> <! row -->

		<div class="col-2"></div>
        
		</div> <! container -->
    </body>
</html>