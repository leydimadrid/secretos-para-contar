using System;

namespace TeslaACDC.Data.Models;

using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

public class FileUploadOperationFilter : IOperationFilter
{
    public void Apply(OpenApiOperation operation, OperationFilterContext context)
    {
        var fileUploadMime = "multipart/form-data";
        if (operation.RequestBody == null || !operation.RequestBody.Content.Any(x => x.Key.Equals(fileUploadMime, StringComparison.InvariantCultureIgnoreCase)))
            return;

        var fileParams = context.MethodInfo.GetParameters().Where(p => p.ParameterType == typeof(IFormFile) || p.ParameterType.GetProperties().Any(prop => prop.PropertyType == typeof(IFormFile))).ToList();
        if (fileParams.Count == 0)
            return;

        operation.RequestBody.Content[fileUploadMime].Schema.Properties =
            operation.RequestBody.Content[fileUploadMime].Schema.Properties ?? new Dictionary<string, OpenApiSchema>();
    }
}