
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
		<label for="email">email</label>
		<input type="text" name="email"><br>
	      <select>
        <option value="0">Seleccione:</option>
        <?php
					$stmtQry = $dbConn->prepare('SELECT * FROM "citas" WHERE length("email") =  0;');
				 	$results = $stmtQry->execute();
					while ($row = $results->fetchArray()) {
						echo '<option value="'.$row['id'].'">'.$row['fecha'].'&nbsp'.$row['hora'].'</option>';
					}
        ?>
      </select><br>
 
		<label for="fecha">fecha</label>
		<input type="text" name="fecha"><br>
		<label for="hora">hora</label>
		<input type="text" name="hora"><br>
		<label for="tema">tema</label>
		<textarea name="tema"></textarea>
		<input type="submit" name="go" value="Enviar">
	</form>
</body>
</html>