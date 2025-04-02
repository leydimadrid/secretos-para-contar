using System;
using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Data;

public class UserRepository : IUserRepository
{
    private readonly DbContext _context;

    public UserRepository(DbContext context)
    {
        _context = context;
    }

    public async Task AddAsync(ApplicationUser user)
    {
        await _context.Set<ApplicationUser>().AddAsync(user);
        await _context.SaveChangesAsync();
    }

    public async Task<ApplicationUser> FindAsync(string id) =>
        await _context.Set<ApplicationUser>().FindAsync(id);

    public async Task Update(ApplicationUser user)
    {
        _context.Set<ApplicationUser>().Update(user);
        await _context.SaveChangesAsync();
    }

    public async Task Delete(ApplicationUser user)
    {
        _context.Set<ApplicationUser>().Remove(user);
        await _context.SaveChangesAsync();
    }

    public async Task<IEnumerable<ApplicationUser>> GetAllAsync(
        Expression<Func<ApplicationUser, bool>> filter = null,
        Func<IQueryable<ApplicationUser>, IOrderedQueryable<ApplicationUser>> orderBy = null,
        string includeProperties = ""
    )
    {
        IQueryable<ApplicationUser> query = _context.Set<ApplicationUser>();

        if (filter != null)
            query = query.Where(filter);

        if (orderBy != null)
            return await orderBy(query).ToListAsync();

        return await query.ToListAsync();
    }
}