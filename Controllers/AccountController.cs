using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Authorization;
using LogicLayer.Models;

namespace Project1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class AccountController : ControllerBase
    {

        private IAccountservice _accountservice;

        public AccountController(
            IAccountservice accountservice)
        {
            _accountservice = accountservice;
        }

        // GET: api/Persons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            var account = _accountservice.GetById(id);
            if (account == null)
            {
                return NotFound();
            }
            return account;
        }
    }
}
