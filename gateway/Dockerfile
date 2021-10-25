FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /src
COPY gateway.csproj .
RUN dotnet restore
COPY . .
RUN dotnet publich -c release -o /app

FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /app .
ENTRYPOINT ["dotnet","gateway.dll"]