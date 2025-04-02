using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class EscuchaController : ControllerBase
    {
        private readonly IEscuchaService _escuchaService;
        public EscuchaController(IEscuchaService escuchaService)
        {
            _escuchaService = escuchaService;
        }
        
        [AllowAnonymous]
        [HttpGet]
        [Route("escuchas")]
        public async Task<IActionResult> GetAllEscuchas()
        {
            var escuchas = await _escuchaService.GetAllEscuchas();
            return Ok(escuchas);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> AddEscucha(EscuchaModel escuchaModel)
        {
            var nuevo = await _escuchaService.AddEscucha(escuchaModel);
            return Ok(nuevo);
        }
    }
}
