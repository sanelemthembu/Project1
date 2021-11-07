using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Authorization;
using LogicLayer.Models;
using LogicLayer;
using System.IdentityModel.Tokens.Jwt;
using System.Text;
using Microsoft.IdentityModel.Tokens;
using System.Security.Claims;
using System;
using Microsoft.Extensions.Options;

namespace Project1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PersonController : ControllerBase
    {

        private IPersonservice _personService;
        private readonly AppSettings _appSettings;

        public PersonController(
            IPersonservice personService,
            IOptions<AppSettings> appSettings
            )
        {
            _appSettings = appSettings.Value;
            _personService = personService;
        }

        // GET: api/Persons
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Person>>> GetPersons()
        {
            var persons = _personService.GetAll().ToList();
            return persons;
        }

        [AllowAnonymous]
        // GET: api/Persons
        [HttpGet("{pageNo}/{pageSize}")]
        public async Task<ActionResult<IEnumerable<Person>>> GetPagedPersons(int pageNo, int pageSize)
        {
            var x = pageNo - 1;
            var persons = _personService.GetAll()
                .Skip(x * pageSize)
                .Take(pageSize)
                .ToList();
            return persons;
        }

        [HttpGet("PersonCount")]
        public int PersonsCount()
        {
            return _personService.PersonsCount();
        }
 
        [HttpGet("accountnumber")]
        public int NextAccountNumber()
        {
            return _personService.getnextAccountNumber();
        }
 
        [HttpPost("account")]
        public async Task<ActionResult<Person>> PostAccount(Account account)
        {
            var result = await _personService.AddAccount(account);
            if (result)
            {
                return CreatedAtAction("GetAccount", account);
            }
            return BadRequest();
        }

        // GET: api/Persons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Person>> GetPerson(int id)
        {
            var person = _personService.GetById(id);
            if (person == null)
            {
                return NotFound();
            }

            return person;
        }

        // PUT: api/Persons/5
        [HttpPut("{id}")]
        public async Task<IActionResult> PutPerson(int id, Person person)
        {
            if (id != person.Code)
            {
                return BadRequest();
            }

            try
            {
                _personService.Update(person);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        [AllowAnonymous]
        [HttpPost]
        public async Task<ActionResult<Person>> register(Person person)
        {
            _personService.Add(person);
            return CreatedAtAction("GetPerson", new { id = person.Code }, person);
        }

        [AllowAnonymous]
        [HttpPost("authenticate")]

        public async Task<ActionResult<Person>> authenticate(Person u)
        {
            var person = _personService.Authenticate(u.username, u.password);

            if (person == null)
                return BadRequest(new { message = "Personname or password is incorrect" });

            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.ASCII.GetBytes(_appSettings.Secret);
            var tokenDescriptor = new SecurityTokenDescriptor
            {
                Subject = new ClaimsIdentity(new Claim[]
                {
                    new Claim(ClaimTypes.Name, person.Code.ToString())
                }),
                Expires = DateTime.UtcNow.AddDays(7),
                SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
            };
            var token = tokenHandler.CreateToken(tokenDescriptor);
            var tokenString = tokenHandler.WriteToken(token);

            // return basic person info and authentication token
            return Ok(new
            {
                Id = person.Code,
                Personname = person.username,
                FirstName = person.Name,
                LastName = person.Surname,
                Token = tokenString
            });
        }
        // DELETE: api/Persons/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            _personService.Delete(id);
            return Accepted();
        }

    }
}
