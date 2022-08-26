using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Models;
using planilla_backend_asp.net.Handlers;

namespace planilla_backend_asp.net.Controllers
{
  [Route("api/")]
  [ApiController]
  public class ReportsController : ControllerBase
  {
    // This returns all the 10 latest reports for the given employeeID.
    [HttpGet]
    [Route("reports")]
    public ActionResult GetProjects(string employeeID)
    {
      var handler = new ReportsHandler();
      var data = handler.GetEmployeeReports(employeeID);
      return Ok(data);
    }

    // This returns the report for the given employeeID, employerID, projectName and paymentDate.
    [HttpGet]
    [Route("employeeReport")]
    public ActionResult GetReport(string employeeID, string employerID, string projectName, string paymentDate)
    {
      var handler = new ReportsHandler();
      var data = handler.GetEmployeeReport(employeeID, employerID, projectName, paymentDate);
      return Ok(data);
    }

    [HttpGet]
    [Route("projectReports")]
    public ActionResult GetProjectReport(string employerID)
    {
      var handler = new ReportsHandler();
      var data = handler.GetProjectReports(employerID);
      return Ok(data);
    }

    // This returns the report for the given employeeID, employerID, projectName and paymentDate.
    [HttpGet]
    [Route("employerReport")]
    public ActionResult GetEmployerReport(string employerID, string projectName, string paymentDate)
    {
      var handler = new ReportsHandler();
      var data = handler.GetEmployerReport(employerID, projectName, paymentDate);
      return Ok(data);
    }

    // This returns the unfiltered reports of employee payments.
    [HttpGet]
    [Route("employeePaymentHistory")]
    public ActionResult GetUnfilteredEmployeePayments(string employerID)
    {
      var handler = new ReportsHandler();
      var data = handler.GetUnfilteredEmployeePayments(employerID);
      return Ok(data);
    }
  }
}
