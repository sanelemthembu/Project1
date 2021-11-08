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

        [HttpGet("{id}")]
        public async Task<ActionResult<Account>> GetAccount(int id)
        {
            var account = await _accountservice.GetById(id);
            if (account == null)
            {
                return NotFound();
            }
            return account;
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeletePerson(int id)
        {
            _accountservice.Delete(id);
            return Accepted();
        }

        [HttpPut("{id}")]
        public async Task<bool> CloseAccount(int id, bool state)
        {
            var closed = _accountservice.UpdateForClose(id, state) == 1;
            return closed;
        }
    }
}
