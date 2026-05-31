using Microsoft.EntityFrameworkCore;
using EventBooking.API.Data;
using Microsoft.AspNetCore.OpenApi;
using EventBooking.API.Repositories;
using EventBooking.API.Services;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers();
// Repositories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IEventRepository, EventRepository>();
builder.Services.AddScoped<IBookingRepository, BookingRepository>();

// Services
builder.Services.AddScoped<ICategoryService, CategoryService>();
builder.Services.AddScoped<IEventService, EventService>();
builder.Services.AddScoped<IBookingService, BookingService>();
builder.Services.AddOpenApi();

builder.Services.AddDbContext<EventDBContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("EventBookingConnection")));

builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAll",
        policy => policy.AllowAnyOrigin()
                        .AllowAnyMethod()
                        .AllowAnyHeader());
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//app.UseHttpsRedirection();

app.UseAuthorization();

app.UseCors("AllowAll");

app.MapControllers();

// Auto migrate and seed
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<EventDBContext>();
    db.Database.Migrate();
    DbSeeder.Seed(db);     // Insert seed data
}

app.Run();

app.Run();
