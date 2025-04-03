using System;
using TeslaACDC.Business.DTO;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.Interfaces;

public interface IUserService
{
    // Métodos de autenticación
    Task<bool> RegisterAdmin(RegisterModel userModel);
    Task<bool> RegisterUser(RegisterModel userModel);
    Task<TokenResponse> Login(LoginModel loginModel);

    // Métodos de gestión de usuarios (CRUD)
    public Task<BaseMessage<IEnumerable<UserModel>>> GetAllUsuarios();
    public Task<BaseMessage<IEnumerable<UserModel>>> UpdateUsuario(string id, UserModel userModel);
    public Task<BaseMessage<IEnumerable<UserModel>>> DeleteUsuario(string id);
}
