// using Microsoft.VisualStudio.TestTools.UnitTesting;

// namespace TeslaACDC.Testing;
// using TeslaACDC.Business.Services;
// using TeslaACDC.Data.IRepository;
// using TeslaACDC.Data.Models;
// using TeslaACDC.Data;
// using NSubstitute;
// using System.Net;
// using NSubstitute.ExceptionExtensions;

// [TestClass]
// public class AlbumTests
// {

//     private readonly Album _correctAlbum;
//     private IAlbumRepository<int, Album> _albumRepository;

//     public AlbumTests()
//     {
//         _albumRepository = Substitute.For<IAlbumRepository<int, Album>>();
//         _correctAlbum = new Album()
//         {
//             Id = 1,
//         };
//     }

//     [TestMethod]
//     public async Task FindById_FindsSomething()
//     {
//         // Arrange
//         // Mocking
//         _albumRepository.FindAlbumById(1).ReturnsForAnyArgs(Task.FromResult<Album>(_correctAlbum));
//         var service = new AlbumService(_albumRepository);

//         // Act
//         var result = await service.FindAlbumById(1);

//         // Assert
//         Assert.AreEqual(result.TotalElements, 1);
//     }

//     [TestMethod]
//     public async Task FindById_NotFound()
//     {
//         // Arrange
//         // Mocking
//         _albumRepository.FindAlbumById(1).ReturnsForAnyArgs(Task.FromResult<Album>(null));
//         var service = new AlbumService(_albumRepository);

//         // Act
//         var result = await service.FindAlbumById(1);

//         // Assert
//         Assert.IsTrue(result.TotalElements == 0 && result.StatusCode == HttpStatusCode.NotFound);
//     }

//     [TestMethod]
//     public async Task FindById_ThrowException()
//     {
//         // Arrange
//         // Mocking
//         _albumRepository.FindAlbumById(1).ThrowsAsyncForAnyArgs(new Exception("Error!"));
//         var service = new AlbumService(null);

//         // Act
//         // Assert
//         Assert.ThrowsExceptionAsync<Exception>(() => service.FindAlbumById(1));
//     }

//     [TestMethod]
//     public async Task AddAlbum_NameIsIncorrect()
//     {
//         // Arrange
//         // Mocking
//         _albumRepository.AddAlbum(new Album());
//         var service = new AlbumService(_albumRepository);

//         // Act
//         var result = await service.AddAlbum(_correctAlbum);

//         // Assert
//         Assert.AreEqual(result.TotalElements, 0);
//     }
// }
