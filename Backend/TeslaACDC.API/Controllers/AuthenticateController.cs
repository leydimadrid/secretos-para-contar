using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data.Models;

[Route("api/[controller]")]
[ApiController]
// [Authorize]
public class AuthenticateController : ControllerBase
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IUserService _userService;
    private readonly IConfiguration _configuration;

    public AuthenticateController(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IUserService userService)
    {
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
        _userService = userService;
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login(LoginModel loginModel)
    {
        var response = await _userService.Login(loginModel);
        if (!string.IsNullOrEmpty(response.Token))
        {
            return Ok(response);
        }
        return Unauthorized();
    }

    
    [HttpPost("register/admin")]
    public async Task<IActionResult> RegisterAdmin(RegisterModel registerModel)
    {
        var response = await _userService.RegisterAdmin(registerModel);

        if (response)
        {
            return Ok(new { Success = true, Message = "Admin registrado con éxito." });
        }

        return BadRequest(new { Success = false, Message = "Error al registrar admin." });
    }

    [HttpPost("register/user")]
    [AllowAnonymous]
    public async Task<IActionResult> RegisterUser(RegisterModel registerModel)
    {
        var response = await _userService.RegisterUser(registerModel);

        if (response)
        {
            return Ok(new { Success = true, Message = "Usuario registrado con éxito." });
        }

        return BadRequest(new { Success = false, Message = "Error al registrar usuario." });
    }

}