using System.Linq.Expressions;
using Microsoft.EntityFrameworkCore;
using TeslaACDC.Data.Models;

namespace TeslaACDC.Data;

public class Repository<TId, TEntity> : IRepository<TId, TEntity>
    where TId : struct
    where TEntity : BaseEntity<TId>

{
    internal TeslaContext _context;
    internal DbSet<TEntity> _dbSet;

    public Repository(TeslaContext context)
    {
        _context = context;
        _dbSet = _context.Set<TEntity>();
    }
    public virtual async Task<IEnumerable<TEntity>> GetAllAsync(
        Expression<Func<TEntity, bool>> filter = null,
        Func<IQueryable<TEntity>, IOrderedQueryable<TEntity>> orderBy = null,
        string includeProperties = "")
    {
        IQueryable<TEntity> query = _dbSet;
        if (filter is not null)
        {
            query = query.Where(filter);
        }

        foreach (var includeProperty in includeProperties.Split(
            new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
        {
            query = query.Include(includeProperty);
        }

        if (orderBy is not null)
        {
            return await orderBy(query).ToListAsync();
        }
        else
        {
            return await query.ToListAsync();
        }
    }

    public virtual async Task<TEntity> FindAsync(TId id)
    {
        return await _dbSet.FindAsync(id);
    }

    public virtual async Task AddAsync(TEntity entity)
    {
        await _dbSet.AddAsync(entity);
    }


    public virtual async Task Update(TEntity entity)
    {
        _dbSet.Attach(entity);
        _context.Entry(entity).State = EntityState.Modified;
    }



    public virtual async Task Delete(TEntity entity)
    {
        if (_context.Entry(entity).State == EntityState.Detached)
        {
            _dbSet.Attach(entity);
        }
        _dbSet.Remove(entity);
    }

    public virtual async Task Delete(TId id)
    {
        TEntity entityToDelete = await _dbSet.FindAsync(id);
        await Delete(entityToDelete);
    }

    public virtual async Task Deactivate(TId id)
    {
        var entity = await _dbSet.FindAsync(id);
        if (entity != null)
        {
            entity.GetType().GetProperty("IsEnabled")?.SetValue(entity, false);
            _dbSet.Update(entity);
            await _context.SaveChangesAsync();
        }
    }

    public virtual IQueryable<TEntity> Query(string includeProperties = "")
    {
        IQueryable<TEntity> query = _dbSet;

        foreach (var includeProperty in includeProperties.Split(new char[] { ',' }, StringSplitOptions.RemoveEmptyEntries))
        {
            query = query.Include(includeProperty);
        }

        return query;
    }

    // Implementación del nuevo método CountAsync
    public async Task<int> CountAsync(Expression<Func<TEntity, bool>> filter = null)
    {
        IQueryable<TEntity> query = _dbSet;

        if (filter != null)
        {
            query = query.Where(filter);
        }

        return await query.CountAsync();
    }
}