FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src
COPY backend/AbaMela.Api/AbaMela.Api.csproj backend/AbaMela.Api/
RUN dotnet restore backend/AbaMela.Api/AbaMela.Api.csproj
COPY backend/AbaMela.Api/ backend/AbaMela.Api/
RUN dotnet publish backend/AbaMela.Api/AbaMela.Api.csproj -c Release -o /app/publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app
ENV ASPNETCORE_URLS=http://+:8080
EXPOSE 8080
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "AbaMela.Api.dll"]
