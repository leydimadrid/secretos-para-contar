using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DonacionController : ControllerBase
    {
        private readonly IDonacionService _donacionService;

        public DonacionController(IDonacionService donacionService)
        {
            _donacionService = donacionService;
        }

        [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("donaciones")]
        public async Task<IActionResult> GetAllDonacion()
        {
            var donacion = await _donacionService.GetAllDonaciones();
            return Ok(donacion);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> AddDonacion(DonacionModel donacionModel)
        {
            var nuevo = await _donacionService.AddDonacion(donacionModel);
            return Ok(nuevo);
        }
    }
}
