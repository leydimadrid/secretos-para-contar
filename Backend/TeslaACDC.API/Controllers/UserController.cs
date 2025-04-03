using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;

namespace TeslaACDC.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;
        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        // [Authorize(Roles = "Admin")]
        [HttpGet]
        [Route("usuarios")]
        public async Task<ActionResult<IEnumerable<UserModel>>> GetAllUsuarios()
        {
            var usuarios = await _userService.GetAllUsuarios();
            return Ok(usuarios);
        }

        [Authorize(Roles = "Admin")]
        [HttpPut]
        [Route("Update/{id}")]
        public async Task<IActionResult> UpdateUsuario(string id, [FromBody] UserModel userModel)
        {
            var updatedUsuario = await _userService.UpdateUsuario(id, userModel);
            return Ok(updatedUsuario);
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete]
        [Route("Delete/{id}")]
        public async Task<IActionResult> DeleteUsuario(string id)
        {
            var deleteUsuario = await _userService.DeleteUsuario(id);
            return Ok(deleteUsuario);
        }
    }
}
