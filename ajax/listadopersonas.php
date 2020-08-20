<?php require_once('cfg/core.php') ?>
<div class="bar">
<a id="new" class="button" style="cursor:pointer" onclick="agregar();">Nuevo Cliente</a>
</div>
<table>
    <thead>
        <tr>
            <th>Id</th>
            <th>Nombre</th>
            <th>Apellido</th>
            <th>Fecha de Nacimiento</th>
            <th>Editar</th>
            <th>Borrar</th>
        </tr>
    </thead>
	<tbody>
	<?php
		$clientes=new Clientes();
		$cliente=$clientes->mostrar();
		foreach($cliente as $cl){
            echo'<tr>
                <td>'.$cl['id'].'</td>
                <td>'.$cl['nombre'].'</td>
                <td>'.$cl['apellido'].'</td>
                <td>'.$cl['fecha_nac'].'</td>
                <td><a class="edit" style="cursor:pointer" onclick="editar('.$cl['id'].',\''.$cl['nombre'].'\',\''.$cl['apellido'].'\',\''.$cl['fecha_nac'].'\');">Editar</a></td>
                <td><a class="delete" style="cursor:pointer" onclick="if(!confirm(\'Se borrará cliente seleccionado\'))return false; else borrar('.$cl['id'].')">Borrar</a></td>
            </tr>';	
		}
	?>
    </tbody>
</table>