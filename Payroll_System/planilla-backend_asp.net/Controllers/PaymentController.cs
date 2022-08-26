using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Handlers;
using System.Data.SqlClient;
using System.Data;

namespace planilla_backend_asp.net.Controllers
{
  [Route("api/")]
  [ApiController]
  public class PaymentController : ControllerBase
  {
    [HttpGet]
    [Route("payments")]
    public ActionResult PayProject(string projectName, string employerID)
    {
      try
      {
        var handler = new PaymentHandler();
        var data = handler.PayProjectToday(projectName, employerID);
        return Ok(data);
      }
      catch (System.Data.SqlClient.SqlException exception)
      {
        return BadRequest();
      }
    }

    [HttpGet]
    [Route("employeePayments")]
    public ActionResult GetEmployeePaymentsHistory(string projectName, string userID)
    {
      try
      {
        var handler = new PaymentHandler();
        var data = handler.GetUserPayments(projectName, userID);
        return Ok(data);
      }
      catch (System.Data.SqlClient.SqlException exception)
      {
        return BadRequest();
      }
    }
  }
}
