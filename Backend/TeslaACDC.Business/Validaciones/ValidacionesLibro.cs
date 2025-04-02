using System;

using FluentValidation;
using TeslaACDC.Data;
namespace TeslaACDC.Business.DTO;


public class ValidacionesLibro : AbstractValidator<LibroDetalle>
{

    private readonly IUnitOfWork _unitOfWork;

    public ValidacionesLibro(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;

        RuleFor(l => l.Titulo)
                .NotEmpty().WithMessage("El título es obligatorio.")
                .MaximumLength(150).WithMessage("El título no puede tener más de 150 caracteres.");

        RuleFor(l => l.ISBN13)
                .NotEmpty().WithMessage("El ISBN es obligatorio.")
                .Matches(@"^\d{3}-\d{9}\d$")
                .WithMessage("El formato del ISBN no es válido.");

        RuleFor(l => l.AnioPublicacion)
            .InclusiveBetween(1459, 2026)
            .WithMessage("El año de publicación debe estar entre 1450 Y 2025");

        RuleFor(libro => libro.ContraPortada)
       .MaximumLength(1500).WithMessage("La contraportada no puede tener más de 1500 caracteres.");

    }
}
