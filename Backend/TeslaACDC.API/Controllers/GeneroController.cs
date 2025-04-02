using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GeneroController : ControllerBase
    {
        private readonly IGeneroService _generoService;

        public GeneroController(IGeneroService generoService)
        {
            _generoService = generoService;
        }

        [AllowAnonymous]
        [HttpGet]
        [Route("generos")]
        public async Task<IActionResult> GetAllGeneros()
        {
            var generos = await _generoService.GetAllGeneros();
            return Ok(generos);
        }

        [Authorize(Roles = "Admin")]
        [HttpPost]
        [Route("create")]
        public async Task<IActionResult> AddGenero(GeneroModel generoModel)
        {
            var nuevo = await _generoService.AddGenero(generoModel);
            return Ok(nuevo);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateGenero(int id, GeneroModel generoModel)
        {
            var updated = await _generoService.UpdateGenero(id, generoModel);
            return Ok(updated);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteGenero(int id)
        {
            var delete = await _generoService.DeleteGenero(id);
            return Ok(delete);
        }
    }
}
