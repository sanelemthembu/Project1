using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Authorization;
using LogicLayer.Models;
using LogicLayer;

namespace Project1.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class TransactionController : ControllerBase
    {

        private ITransactionservice _transactionservice;

        public TransactionController(ITransactionservice transactionservice)
        {
            _transactionservice = transactionservice;
        }

        [HttpPost()]
        public async Task<ActionResult<Transaction>> PostTransaction(Transaction trans)
        {
            var result = await _transactionservice.Add(trans);
            if (result != null)
            {
                return CreatedAtAction("GetTransaction", trans);
            }
            return BadRequest();
        }
        [HttpPut("{id}")]
        public async Task<IActionResult> PutTransaction(int id, Transaction trans)
        {
            if (id != trans.Code)
            {
                return BadRequest();
            }

            try
            {
                _transactionservice.Update(trans);
                return Ok();
            }
            catch (AppException ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }


        // GET: api/Persons/5
        [HttpGet("{id}")]
        public async Task<ActionResult<Transaction>> GetTransaction(int id)
        {
            var trans = _transactionservice.GetById(id);
            if (trans == null)
            {
                return NotFound();
            }
            return trans;
        }
    }
}
