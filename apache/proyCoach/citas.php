
		<?php
	try {
		$archivo = 'dbCitas.php';
		if (!file_exists($archivo)) {
			throw new Exception("<p>No se ha podido realizar la conexión con la base de datos</p>");
		}
		require_once $archivo;
	} catch (Exception $e) {echo $e->getMessage();}

	?>

<!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<title>Citas</title>
</head>
<body>

	<form action="citas2.php" method="post">
	      <select name="id">
        <option value="0">Seleccione:</option>
        <?php
					$stmtQry = $dbConn->prepare("SELECT * FROM citas WHERE stat = 'INI';");
				 	$results = $stmtQry->execute();
					while ($row = $results->fetchArray()) {
						echo '<option value="'.$row['id'].'">'.$row['fecha'].'&nbsp'.$row['hora'].'</option>';
					}



        ?>
      </select><br>
 		<?php 
			$ahora = new DateTime('now', new DateTimeZone('UTC'));
			echo '<input type="hidden" name="inic" value="'. $ahora->format('Y-m-d H:i:s').'">';
		?>
		<label for="email">email</label>
		<input type="text" name="email"><br>
		<label for="tema">tema</label>
		<textarea name="tema"></textarea>
		<input type="submit" name="go" value="Enviar">
	</form>
</body>
</html>