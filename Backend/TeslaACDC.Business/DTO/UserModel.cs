using System;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Business.DTO;

public class UserModel 
{
    public string id { get; set; }
    public string Name { get; set; }
    public string LastName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }

}
