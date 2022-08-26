using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Handlers;

namespace planilla_backend_asp.net.Controllers
{
    [Route("api/")]
    [ApiController]
    public class PaymentHistoryController : ControllerBase
    {
        [HttpGet]
        [Route("paymentsHistory")]
        public ActionResult PayProject(string employeeID)
        {
            try
            {
                var handler = new PaymentHistoryHandler();
                var data = handler.GetPaymentHistory(employeeID);
                return Ok(data);
            }
            catch (System.Data.SqlClient.SqlException exception)
            {
                return BadRequest();
            }
}
    }
}
