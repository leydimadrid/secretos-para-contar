using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class LecturaController : ControllerBase
    {
        private readonly ILecturaService _lecturaService;

        public LecturaController(ILecturaService lecturaService)
        {
            _lecturaService = lecturaService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("lecturas")]
        public async Task<IActionResult> GetAllLecturas()
        {
            var lecturas = await _lecturaService.GetAllLecturas();
            return Ok(lecturas);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> AddLectura(LecturaModel lecturaModel)
        {
            var nuevo = await _lecturaService.AddLectura(lecturaModel);
            return Ok(nuevo);
        }
    }
}
