using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DescargaLibroController : ControllerBase
    {
        private readonly IDescargaLibroService _descargaLibroService;

        public DescargaLibroController(IDescargaLibroService descargaLibroService)
        {
            _descargaLibroService = descargaLibroService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("descargas")]
        public async Task<IActionResult> GetAllDescargas()
        {
            var descargas = await _descargaLibroService.GetAllDescargas();
            return Ok(descargas);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> AddDescarga(DescargaModelLibro descargaModel)
        {
            var nuevo = await _descargaLibroService.AddDescarga(descargaModel);
            return Ok(nuevo);
        }
    }
}
