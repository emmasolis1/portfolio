using Microsoft.AspNetCore.Mvc;
using planilla_backend_asp.net.Models;
using planilla_backend_asp.net.Handlers;

namespace planilla_backend_asp.net.Controllers
{
  [Route("api/")]
  [ApiController]
  public class DashboardController : ControllerBase
  {
    [HttpGet]
    [Route("dashboard")]
    public ActionResult GetDashboard(string employerID)
    {
      // Get data from database
      DashboardHandler handler = new DashboardHandler();
      try
      {
        var data = handler.GetDashboard(employerID);
        return Ok(data);
      }
      catch (Exception e)
      {
        return BadRequest(e.Message);
      }
    }

    [HttpGet]
    [Route("dashboardEmployee")]
    public ActionResult GetDashboardEmployee(string employeeID)
    {
      // Get data from database
      DashboardHandler handler = new DashboardHandler();
      try
      {
        var data = handler.GetDashboardEmployee(employeeID);
        return Ok(data);
      }
      catch (Exception e)
      {
        return BadRequest(e.Message);
      }
    }
  }
}
