using System;
using System.Linq.Expressions;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Data;

public interface IUserRepository
{
    Task AddAsync(ApplicationUser user);
    Task<ApplicationUser> FindAsync(string id);
    Task Update(ApplicationUser user);
    Task Delete(ApplicationUser user);
    Task<IEnumerable<ApplicationUser>> GetAllAsync(
        Expression<Func<ApplicationUser, bool>> filter = null,
        Func<IQueryable<ApplicationUser>, IOrderedQueryable<ApplicationUser>> orderBy = null,
        string includeProperties = ""
    );
}