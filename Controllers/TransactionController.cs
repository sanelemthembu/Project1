using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using DataAccessLayer.Models;
using Microsoft.AspNetCore.Authorization;
using LogicLayer.Models;
using LogicLayer;
using System.Collections.Generic;
using System.Linq;

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


        [HttpGet("{pageNo}/{pageSize}")]
        public async Task<ActionResult<IEnumerable<Transaction>>> GetPagedPersons(int pageNo, int pageSize)
        {
            var x = pageNo - 1;
            var persons = _transactionservice.GetAll()
                .Skip(x * pageSize)
                .Take(pageSize)
                .ToList();
            return persons;
        }

        [HttpGet("Count")]
        public int PersonsCount()
        {
            return _transactionservice.Count();
        }

    }
}
