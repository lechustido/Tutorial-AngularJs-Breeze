angular.module('breezeApp', ['breeze.angular'])
	.controller('breezeCtr', breezeCtr)
	.run();
function breezeCtr($scope, breeze) {
	var vm = $scope;

	//Manager de conexión de Breeze
	vm.manager = new breeze.EntityManager('breeze/BBDD');

	//Variables
	vm.respuesta;
	vm.nombreAlumno;
	vm.apellidoAlumno;
	vm.edadAlumno;
	vm.direccionAlumno;
	vm.matriculaAlumno;
	vm.nombreCurso;
	vm.precioCurso;

	//Funciones
	vm.consultarDatosAlumnos = consultarDatosAlumnos;
	vm.anadirAlumnos = anadirAlumnos;
	vm.borrarAlumnos = borrarAlumnos;
	vm.llamadaMetadatos = llamadaMetadatos;
	vm.modificarAlumno = modificarAlumno;

	//Llamadas iniciales obligatorias
	llamadaMetadatos();

	//Obtener todos los alumnos con sus matrículas.
	function consultarDatosAlumnos() {
		//'Alumnos' es el nombre de la tabla a la que queremos acceder.
		//Matricula1 es el nombre de la variable de navegabilidad para acceder a la tabla Matricula, es decir, el nombre que le da Breeze a la
		//clave foranea que relaciona a un alumno con su matrícula.
		var consulta = breeze.EntityQuery.from('Alumnos').expand('Matricula1');
		vm.manager.executeQuery(consulta)
			.then(function (promise) {
				vm.respuesta = promise.results;
			});	
	}

	//Crear un alumno nuevo con su matrícula asociada.
	function anadirAlumnos() {
		var matriculaId = generadorGUID();
		var alumnoId = generadorGUID();
		var matriculaInsertar = { Id: matriculaId, Precio: vm.precioCurso, Curso: vm.nombreCurso, FormStatus: 'new' };
		vm.manager.createEntity('Matricula', matriculaInsertar);
		var alumno = { Id: alumnoId, Nombre: vm.nombreAlumno, Apellido: vm.apellidoAlumno, Edad: vm.edadAlumno, Direccion: vm.direccionAlumno, Matricula: matriculaId, FormStatus: 'new' }
		vm.manager.createEntity('Alumnos', alumno);
		guardarCambios();
	}

	//Esta función nos permite modificar el nombre de un alumno
	function modificarAlumno(alumno) {
		vm.manager.addEntity(alumno);
		guardarCambios();
	}

	//Borrar un alumno seleccionado
	function borrarAlumnos(alumno) {
		alumno.entityAspect.setDeleted();
		guardarCambios();
	}

	//Guardar cualquier cambio realizado en el modelo
	function guardarCambios() {
			vm.manager.saveChanges();
	}

	//Función que nos permite obtener los metadatos y el modelo Breeze para poder hacer creaciones.Siempre debe llamarse antes de añadir un nuevo registro a la BBDD
	function llamadaMetadatos() {
		var consulta = breeze.EntityQuery.from('Metadata');
		vm.manager.executeQuery(consulta)
			.then(function (promise) {
			});	
	}

	//Esta función permite crear un GUID en JavaScript
	function generadorGUID() {	
			return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
				var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
				return v.toString(16);
			});
	}
}