using AutoMapper;

namespace TeslaACDC.Business.Mapping;
using TeslaACDC.Data.Models;
using TeslaACDC.Business.DTO;

public class MappingProfile : Profile
{
    public MappingProfile()
    {
        CreateMap<LibroCrear, Libro>()
            .ReverseMap();

        CreateMap<Libro, LibroResumen>()
        .ReverseMap();

        CreateMap<AudiolibroResumen, Audiolibro>()
            .ReverseMap();

        CreateMap<AutorResumen, Autor>()
            .ReverseMap();

        CreateMap<AutorCrear, Autor>()
            .ReverseMap();

        CreateMap<Genero, GeneroModel>().ReverseMap();

        CreateMap<DescargaLibro, DescargaModelLibro>()
            .ReverseMap();
        CreateMap<DescargaAudiolibro, DescargaModelAudiolibro>()
        .ReverseMap();

        CreateMap<Lectura, LecturaModel>()
            .ReverseMap();

        CreateMap<Escucha, EscuchaModel>()
            .ReverseMap();

        CreateMap<ApplicationUser, UserModel>().ReverseMap();

        CreateMap<Donacion, DonacionModel>().ReverseMap();
    }
}
