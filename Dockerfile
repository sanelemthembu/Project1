

# https://hub.docker.com/_/microsoft-dotnet
FROM mcr.microsoft.com/dotnet/sdk:5.0 AS build
WORKDIR /build
COPY ["DataAccessLayer/DataAccessLayer.csproj", "DataAccessLayer/"]
COPY ["LogicLayer/LogicLayer.csproj", "LogicLayer/"]
EXPOSE 88
EXPOSE 443



RUN curl -sL https://deb.nodesource.com/setup_10.x |  bash -
RUN apt-get install -y nodejs

# copy csproj and restore as distinct layers
COPY ./*.csproj .
COPY ["Project1/Project1.csproj", "Project1/"]
RUN dotnet restore "./Project1/Project1.csproj"

# copy everything else and build app
COPY . .
WORKDIR /build
RUN dotnet publish "./Project1/Project1.csproj" -c release -o published --no-cache

# final stage/image
FROM mcr.microsoft.com/dotnet/aspnet:5.0
WORKDIR /app
COPY --from=build /build/published ./
ENTRYPOINT ["dotnet", "Project1.dll"]