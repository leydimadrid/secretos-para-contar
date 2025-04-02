using System.IdentityModel.Tokens.Jwt;
using System.Net;
using System.Security.Claims;
using System.Text;
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.IdentityModel.Tokens;
using TeslaACDC.Business.DTO;
using TeslaACDC.Business.Interfaces;
using TeslaACDC.Data;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Services;

public class UserService : IUserService
{
    private readonly UserManager<ApplicationUser> _userManager;
    private readonly RoleManager<IdentityRole> _roleManager;
    private readonly IConfiguration _configuration;
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;


    public UserService(UserManager<ApplicationUser> userManager, RoleManager<IdentityRole> roleManager, IConfiguration configuration, IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
        _userManager = userManager;
        _roleManager = roleManager;
        _configuration = configuration;
    }

    public async Task<BaseMessage<UserModel>> GetAllUsuarios()
    {
        var lista = await _unitOfWork.UserRepository.GetAllAsync();
        var listaMapeada = _mapper.Map<List<UserModel>>(lista);

        return lista.Any()
            ? BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.OK, lista.Count())
            : BuildMessage(listaMapeada.ToList(), "", HttpStatusCode.NotFound, 0);
    }

    public async Task<BaseMessage<UserModel>> UpdateUsuario(string id, UserModel userModel)
    {
        var error = new List<string>();
        if (error.Any())
        {
            return BuildMessage(null, string.Join(", ", error), HttpStatusCode.BadRequest, 0);
        }
        var userEntity = await _unitOfWork.UserRepository.FindAsync(id);
        if (userEntity == null)
        {
            return BuildMessage(new List<UserModel>(), "Usuario no encontrado", HttpStatusCode.NotFound, 0);
        }

        _mapper.Map(userModel, userEntity);


        _unitOfWork.UserRepository.Update(userEntity);
        await _unitOfWork.SaveAsync();

        // Mapeo del usuario actualizado a userModel para la respuesta
        var usuarioActualizado = _mapper.Map<UserModel>(userEntity);

        return BuildMessage(new List<UserModel> { usuarioActualizado }, "", HttpStatusCode.OK, 1);
    }

    public async Task<BaseMessage<UserModel>> DeleteUsuario(string id)
    {
        var usuario = await _unitOfWork.UserRepository.FindAsync(id);
        if (usuario == null)
        {
            return BuildMessage(new List<UserModel>(), "Usuario no encontrado", HttpStatusCode.NotFound, 0);
        }

        _unitOfWork.UserRepository.Delete(usuario);
        await _unitOfWork.SaveAsync();

        var usuarioEliminado = _mapper.Map<UserModel>(usuario);

        return BuildMessage(new List<UserModel> { usuarioEliminado }, "", HttpStatusCode.OK, 1);
    }

    public async Task<TokenResponse> Login(LoginModel loginModel)
    {
        var user = await _userManager.FindByEmailAsync(loginModel.Email);
        if (user != null && await _userManager.CheckPasswordAsync(user, loginModel.Password))
        {
            var userRoles = await _userManager.GetRolesAsync(user);
            var authClaims = new List<Claim>
            {
                new Claim(ClaimTypes.Email, user.Email),
                new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString())
            };

            foreach (var userRole in userRoles)
            {
                authClaims.Add(new Claim(ClaimTypes.Role, userRole));
            }

            var authSignKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:SecretKey"]));
            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddDays(7),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSignKey, SecurityAlgorithms.HmacSha256)
            );

            return new TokenResponse()
            {
                Token = new JwtSecurityTokenHandler().WriteToken(token),
                Expiration = token.ValidTo,
                Email = user.Email,
                Name = user.Name,
                UserId = user.Id
            };
        }
        return new TokenResponse();
    }

    public async Task<bool> RegisterAdmin(RegisterModel userModel)
    {

        var userExist = await _userManager.FindByNameAsync(userModel.UserName);
        if (userExist != null)
        {
            return false;
        }

        ApplicationUser user = new ApplicationUser()
        {
            Name = userModel.Name,
            LastName = userModel.LastName,
            Email = userModel.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = userModel.UserName
        };


        var result = await _userManager.CreateAsync(user, userModel.Password);
        if (!result.Succeeded)
        {
            return false;
        }

        if (!await _roleManager.RoleExistsAsync(UserRoles.Admin))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.Admin));
        }

        if (!await _roleManager.RoleExistsAsync(UserRoles.User))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));
        }

        if (await _roleManager.RoleExistsAsync(UserRoles.Admin))
        {
            await _userManager.AddToRoleAsync(user, UserRoles.Admin);
        }
        return true;
    }

    public async Task<bool> RegisterUser(RegisterModel userModel)
    {
        var userExist = await _userManager.FindByNameAsync(userModel.UserName);
        if (userExist != null)
        {
            return false;
        }

        ApplicationUser user = new ApplicationUser()
        {
            Name = userModel.Name,
            LastName = userModel.LastName,
            Email = userModel.Email,
            SecurityStamp = Guid.NewGuid().ToString(),
            UserName = userModel.UserName
        };

        var result = await _userManager.CreateAsync(user, userModel.Password);
        if (!result.Succeeded)
        {
            return false;
        }


        if (!await _roleManager.RoleExistsAsync(UserRoles.User))
        {
            await _roleManager.CreateAsync(new IdentityRole(UserRoles.User));
        }

        await _userManager.AddToRoleAsync(user, UserRoles.User);

        return true;
    }

    private BaseMessage<UserModel> BuildMessage(List<UserModel> responseElements, string message = "", HttpStatusCode
        statusCode = HttpStatusCode.OK, int totalElements = 0)
    {
        return new BaseMessage<UserModel>()
        {
            Message = message,
            StatusCode = statusCode,
            TotalElements = totalElements,
            ResponseElements = responseElements
        };
    }
}