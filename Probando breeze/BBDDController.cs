using Breeze.ContextProvider;
using Breeze.ContextProvider.EF6;
using Breeze.WebApi2;
using Newtonsoft.Json.Linq;
using System.Linq;
using System.Web.Http;

namespace Probando_breeze
{
	[BreezeController]
	public class BBDDController : ApiController
	{
		readonly EFContextProvider<BreezeEntities> _contextProvider =
			new EFContextProvider<BreezeEntities>();

		// ~/breeze/BBDD/Metadata 
		[HttpGet]
		public string Metadata()
		{
			return _contextProvider.Metadata();
		}

		//Para llamar a este método,
		// ~/breeze/BBDD(Nombre del Controlador)/Matricula(Nombre del método)
		[HttpGet]
		public IQueryable<Matricula> Matricula()
		{
			return _contextProvider.Context.Matricula;
		}

		[HttpGet]
		public IQueryable<Alumnos> Alumnos()
		{
			return _contextProvider.Context.Alumnos;
		}

		// ~/breeze/todos/SaveChanges
		[HttpPost]
		public SaveResult SaveChanges(JObject saveBundle)
		{
			return _contextProvider.SaveChanges(saveBundle);
		}
	}
}