using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Business.Services;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DescargaAudiolibroController : ControllerBase
    {
        private readonly IDescargaAudiolibroService _descargaAudiolibroService;

        public DescargaAudiolibroController(IDescargaAudiolibroService descargaAudiolibroService)
        {
            _descargaAudiolibroService = descargaAudiolibroService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("descargas")]
        public async Task<IActionResult> GetAllDescargas()
        {
            var descargas = await _descargaAudiolibroService.GetAllDescargas();
            return Ok(descargas);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> AddDescarga(DescargaModelAudiolibro descargaModel)
        {
            var nuevo = await _descargaAudiolibroService.AddDescarga(descargaModel);
            return Ok(nuevo);
        }
    }
}
