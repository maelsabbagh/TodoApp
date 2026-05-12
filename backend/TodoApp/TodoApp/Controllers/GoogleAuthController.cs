using Google.Apis.Auth;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace TodoApp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class GoogleAuthController : ControllerBase
    {
        private readonly IConfiguration _configuration;

        public GoogleAuthController(IConfiguration configuration)
        {
            _configuration = configuration;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] GoogleLoginRequest request)
        {
            try
            {
                var settings = new GoogleJsonWebSignature.ValidationSettings
                {
                    Audience = [_configuration["GoogleAuth:ClientId"]]
                };

                var payload = await GoogleJsonWebSignature.ValidateAsync(request.IdToken, settings);

                return Ok(new
                {
                    Email = payload.Email,
                    Name = payload.Name,
                    Picture = payload.Picture
                });
            }
            catch (InvalidJwtException)
            {
                return Unauthorized("Invalid Google token.");
            }
        }
    }
}

public class GoogleLoginRequest
{
    public string IdToken { get; set; } = string.Empty;
}
