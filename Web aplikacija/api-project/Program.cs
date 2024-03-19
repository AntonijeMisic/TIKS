var builder = WebApplication.CreateBuilder(args);

builder.Services.AddDbContext<EKnjizaraContext>(options =>
{
    options.UseSqlServer(builder.Configuration.GetConnectionString("DBeKnjizara"));
});

builder.Services.AddCors(options =>
{
    options.AddPolicy("CORS", policy =>
    {
        policy.AllowAnyHeader()
              .AllowAnyMethod()
              .WithOrigins("http://localhost:5555",
                           "https://localhost:5555",
                           "http://localhost:4200",
                           "https://localhost:4200");
    });
});

builder.Services.AddControllers();

// Add services to the container.
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseCors("CORS");

app.UseHttpsRedirection();

app.MapControllers();

app.Run();

