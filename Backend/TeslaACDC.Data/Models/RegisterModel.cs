using System.ComponentModel.DataAnnotations;

namespace TeslaACDC.Data.Models;

public class RegisterModel
{
    [Required(ErrorMessage = "User name is required")]
    public string Name { get; set; } = string.Empty;

    [Required(ErrorMessage = "User lastname is required")]
    public string LastName { get; set; } = string.Empty;

    [Required(ErrorMessage = "User name is required")]
    public string UserName { get; set; } = string.Empty;

    [EmailAddress]
    [Required(ErrorMessage = "Email is required")]
    public string Email { get; set; } = string.Empty;

    [Required(ErrorMessage = "Password is required")]
    public string Password { get; set; } = string.Empty;
}
